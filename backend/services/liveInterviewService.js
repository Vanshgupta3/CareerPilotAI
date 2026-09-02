const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");

const createContinuationFallback = (interview, questionCount) => {
    const topic = interview.currentTopic || "core technical concepts";
    const difficulty = questionCount <= 2
        ? "EASY"
        : questionCount <= 5
            ? "MEDIUM"
            : "HARD";

    return {
        action: "NEXT_QUESTION",
        topic,
        difficulty,
        question: `Let's continue with ${topic}. Can you explain how you would apply it in a real ${interview.role} project?`,
        reason: "Fallback continuation to complete the minimum interview length."
    };
};

const startLiveInterview = async ({
    resumeId,
    role,
    level,
    type,
    userId
}) => {

    // Get candidate resume
    const resume = await prisma.resume.findFirst({
        where: {
            id: resumeId,
            userId
        }
    });

    if (!resume) {
        const error = new Error("Resume not found.");
        error.status = 404;
        throw error;
    }

    const prompt = `
You are a Senior Technical Interviewer conducting a live interview.

Candidate Role:
${role}

Experience Level:
${level}

Interview Type:
${type}

Candidate Resume:

${resume.content || "Resume content is not available."}

Your task is to start the interview.

Generate ONLY the first interview question.

Instructions:
- Behave like a professional human interviewer.
- Ask one question only.
- The opening question should be appropriate for the selected role and experience level.
- You may use the candidate's resume when relevant.
- Do not provide an answer to the question.
- Do not explain your reasoning.
- Return ONLY valid JSON.

Return exactly this JSON structure:

{
    "question": "Your interview question",
    "topic": "Topic being tested",
    "difficulty": "EASY"
}

Rules:
- difficulty must be EASY, MEDIUM, or HARD.
- Return only JSON.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let generatedQuestion;

    try {
        generatedQuestion = JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error(
            "Invalid live interview response received from Gemini."
        );
    }

    if (
        !generatedQuestion.question ||
        !generatedQuestion.topic ||
        !generatedQuestion.difficulty
    ) {
        throw new Error(
            "Incomplete live interview response received from Gemini."
        );
    }

    const allowedDifficulties = [
        "EASY",
        "MEDIUM",
        "HARD"
    ];

    if (
        !allowedDifficulties.includes(
            generatedQuestion.difficulty
        )
    ) {
        throw new Error(
            "Invalid interview difficulty received from Gemini."
        );
    }

    const interview = await prisma.interview.create({
        data: {
            role,
            level,
            type,
            mode: "LIVE",
            status: "IN_PROGRESS",
            currentTopic: generatedQuestion.topic,
            currentDifficulty: generatedQuestion.difficulty,
            startedAt: new Date(),
            userId: resume.userId,
            resumeId: resume.id
        }
    });

    const message = await prisma.interviewMessage.create({
        data: {
            role: "AI",
            content: generatedQuestion.question,
            messageType: "QUESTION",
            topic: generatedQuestion.topic,
            difficulty: generatedQuestion.difficulty,
            interviewId: interview.id
        }
    });

    return {
        interviewId: interview.id,
        status: interview.status,
        question: {
            messageId: message.id,
            content: message.content,
            topic: message.topic,
            difficulty: message.difficulty
        }
    };
};


const submitLiveAnswer = async ({
    interviewId,
    answer,
    userId
}) => {

    const interview = await prisma.interview.findFirst({
        where: {
            id: interviewId,
            userId,
            mode: "LIVE"
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            resume: true
        }
    });

    if (!interview) {
        const error = new Error("Live interview not found.");
        error.status = 404;
        throw error;
    }

    if (interview.status !== "IN_PROGRESS") {
        const error = new Error(
            "Interview is not in progress."
        );
        error.status = 400;
        throw error;
    }

    const lastMessage =
        interview.messages[
            interview.messages.length - 1
        ];

    if (
        !lastMessage ||
        lastMessage.role !== "AI" ||
        lastMessage.messageType !== "QUESTION"
    ) {
        const error = new Error(
            "No interview question is waiting for an answer."
        );
        error.status = 400;
        throw error;
    }

    await prisma.interviewMessage.create({
        data: {
            role: "USER",
            content: answer,
            messageType: "ANSWER",
            topic: lastMessage.topic,
            difficulty: lastMessage.difficulty,
            interviewId: interview.id
        }
    });

    const conversationHistory = [
        ...interview.messages,
        {
            role: "USER",
            content: answer,
            messageType: "ANSWER",
            topic: lastMessage.topic,
            difficulty: lastMessage.difficulty
        }
    ];

    let transcript = "";

    for (const message of conversationHistory) {

        transcript += `
${message.role}:
${message.content}

Topic:
${message.topic || "General"}

Difficulty:
${message.difficulty || "Not specified"}

---------------------------------------
`;

    }

    const questionCount =
        conversationHistory.filter(
            (message) =>
                message.role === "AI" &&
                message.messageType === "QUESTION"
        ).length;


    // Hard interview limit
    if (questionCount >= 12) {

        await prisma.interview.update({
            where: {
                id: interview.id
            },
            data: {
                status: "COMPLETED",
                endedAt: new Date()
            }
        });

        return {
            action: "END_INTERVIEW",
            status: "COMPLETED",
            message:
                "Interview completed successfully."
        };

    }


    const canEndInterview = questionCount >= 8;


    const prompt = `
You are a Senior Technical Interviewer conducting a live adaptive interview.

Candidate Role:
${interview.role}

Experience Level:
${interview.level}

Interview Type:
${interview.type}

Candidate Resume:

${interview.resume.content || "Resume content is not available."}

Complete Interview Conversation:

${transcript}

The candidate has just answered the latest interview question.

Your task is to decide what the interviewer should ask next.

You have three possible actions:


FOLLOW_UP

Use FOLLOW_UP when:
- The latest answer is incomplete.
- The candidate mentioned an important technical concept without explaining it.
- The answer is vague.
- The answer contains a potentially incorrect technical claim.
- A deeper question would reveal the candidate's real understanding.


NEXT_QUESTION

Use NEXT_QUESTION when:
- The latest answer sufficiently answers the question.
- The current topic has been explored enough.
- The interview should move to another important skill.
- Repeated follow-ups would make the interview feel unnatural.
- The candidate is unable to answer even after clarification or a follow-up.


END_INTERVIEW

Use END_INTERVIEW only when:
- Ending the interview is currently allowed.
- Enough technical areas have been assessed.
- The candidate's ability can be evaluated fairly.
- Another question would add little evaluation value.


Ending interview currently allowed:
${canEndInterview}

Current number of questions asked:
${questionCount}


Interview behaviour:
- Behave like a professional human interviewer.
- Ask exactly one question when continuing the interview.
- Do not provide the answer.
- Do not praise every answer.
- Do not repeat an already asked question.
- Use the entire conversation to avoid duplication.
- Questions must match the candidate's role and experience level.
- Resume-based questions are allowed.
- Gradually increase difficulty when the candidate demonstrates good understanding.
- If the candidate struggles, keep the difficulty appropriate.
- Avoid asking more than 2 consecutive follow-up questions about the same narrow concept.
- If the candidate clearly says they do not know, do not repeatedly ask the same concept.
- Keep the interview conversational but technically meaningful.


Return ONLY valid JSON.


For FOLLOW_UP or NEXT_QUESTION return:

{
    "action": "FOLLOW_UP",
    "question": "The next interview question",
    "topic": "Topic being tested",
    "difficulty": "MEDIUM",
    "reason": "Short internal reason for choosing this action"
}


For END_INTERVIEW return:

{
    "action": "END_INTERVIEW",
    "question": null,
    "topic": null,
    "difficulty": null,
    "reason": "Short internal reason for ending the interview"
}


Rules:
- action must be FOLLOW_UP, NEXT_QUESTION, or END_INTERVIEW.
- If Ending interview currently allowed is false, you MUST NOT use END_INTERVIEW.
- If action is FOLLOW_UP or NEXT_QUESTION:
  - question is required.
  - topic is required.
  - difficulty must be EASY, MEDIUM, or HARD.
- If action is END_INTERVIEW:
  - question must be null.
  - topic must be null.
  - difficulty must be null.
- reason must be short.
- Return only JSON.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let decision;

    try {
        decision = JSON.parse(cleanedResponse);
    } catch (error) {
        decision = createContinuationFallback(interview, questionCount);
    }


    const allowedActions = [
        "FOLLOW_UP",
        "NEXT_QUESTION",
        "END_INTERVIEW"
    ];

    const allowedDifficulties = [
        "EASY",
        "MEDIUM",
        "HARD"
    ];


    if (!allowedActions.includes(decision.action)) {
        decision = createContinuationFallback(interview, questionCount);
    }


    if (
        decision.action === "END_INTERVIEW" &&
        !canEndInterview
    ) {

        decision = createContinuationFallback(interview, questionCount);

    }


    if (
        decision.action !== "END_INTERVIEW" &&
        (
            !decision.question ||
            !decision.topic ||
            !allowedDifficulties.includes(
                decision.difficulty
            )
        )
    ) {

        decision = createContinuationFallback(interview, questionCount);

    }


    // Complete interview before creating another question
    if (decision.action === "END_INTERVIEW") {

        await prisma.interview.update({
            where: {
                id: interview.id
            },
            data: {
                status: "COMPLETED",
                endedAt: new Date()
            }
        });

        return {
            action: "END_INTERVIEW",
            status: "COMPLETED",
            message:
                "Interview completed successfully."
        };

    }


    // Interview continues
    const nextMessage =
        await prisma.interviewMessage.create({
            data: {
                role: "AI",
                content: decision.question,
                messageType: "QUESTION",
                topic: decision.topic,
                difficulty: decision.difficulty,
                interviewId: interview.id
            }
        });


    await prisma.interview.update({
        where: {
            id: interview.id
        },
        data: {
            currentTopic: decision.topic,
            currentDifficulty: decision.difficulty
        }
    });


    return {
        action: decision.action,
        question: {
            messageId: nextMessage.id,
            content: nextMessage.content,
            topic: nextMessage.topic,
            difficulty: nextMessage.difficulty
        }
    };

};

const generateQuestionReviews = async ({
    interviewId,
    userId
}) => {

    const interview = await prisma.interview.findFirst({

        where: {
            id: interviewId,
            userId,
            mode: "LIVE"
        },

        include: {

            messages: {

                orderBy: {
                    createdAt: "asc"
                }

            }

        }

    });

    if (!interview) {

        const error = new Error("Interview not found.");
        error.status = 404;
        throw error;

    }

    // Preserve completed reviews and generate only the missing ones. A review
    // request can fail part-way through a longer interview, so any saved review
    // must not prevent the remaining questions from being evaluated later.
    const existingReviews = await prisma.questionReview.findMany({

        where: {
            interviewId: interview.id
        },

        include: {
            questionMessage: true
        },

        orderBy: {
            createdAt: "asc"
        }

    });

    const existingReviewIds = new Set(
        existingReviews.map((review) => review.questionMessageId)
    );

    const reviews = existingReviews.map((review) => ({
        questionMessageId: review.questionMessageId,
        question: review.questionMessage.content,
        candidateAnswer: review.candidateAnswer,
        idealAnswer: review.idealAnswer,
        explanation: review.explanation,
        score: review.score
    }));

    for (let i = 0; i < interview.messages.length; i++) {

        const message = interview.messages[i];

        if (
            message.role !== "AI" ||
            message.messageType !== "QUESTION"
        ) {
            continue;
        }

        if (existingReviewIds.has(message.id)) {
            continue;
        }

        const next = interview.messages[i + 1];

        const candidateAnswer =
            next &&
            next.role === "USER"
                ? next.content
                : "No answer provided.";

        const prompt = `
You are a Senior Technical Interviewer.

Evaluate ONLY this single interview question.

Question:
${message.content}

Candidate Answer:
${candidateAnswer}

Return ONLY valid JSON.

{
    "score": 8,
    "idealAnswer": "Write the ideal answer.",
    "explanation": "Explain what the candidate did well and what they missed."
}

Rules:
- score must be between 0 and 10.
- idealAnswer should be concise (maximum 150 words).
- explanation should be concise (maximum 100 words).
- Return ONLY JSON.
`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let review;

        try {

            review = JSON.parse(cleanedResponse);

        } catch {

            throw new Error(
                "Invalid review received from Gemini."
            );

        }

        if (
            typeof review.score !== "number" ||
            review.score < 0 ||
            review.score > 10 ||
            !review.idealAnswer ||
            !review.explanation
        ) {

            throw new Error(
                "Incomplete review received from Gemini."
            );

        }

        await prisma.questionReview.create({

            data: {

                interviewId: interview.id,

                questionMessageId: message.id,

                candidateAnswer,

                idealAnswer: review.idealAnswer,

                explanation: review.explanation,

                score: review.score

            }

        });

        reviews.push({

            questionMessageId: message.id,

            question: message.content,

            candidateAnswer,

            idealAnswer: review.idealAnswer,

            explanation: review.explanation,

            score: review.score

        });

    }

    return reviews;

};

const generateLiveInterviewFeedback = async ({
    interviewId,
    userId
}) => {

    const interview = await prisma.interview.findFirst({
        where: {
            id: interviewId,
            userId,
            mode: "LIVE"
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    if (!interview) {
        const error = new Error("Live interview not found.");
        error.status = 404;
        throw error;
    }

    if (interview.status !== "COMPLETED") {
        const error = new Error(
            "Interview must be completed before generating feedback."
        );
        error.status = 400;
        throw error;
    }

    const existingFeedback =
        await prisma.feedback.findUnique({
            where: {
                interviewId: interview.id
            }
        });

    if (existingFeedback) {
        const reviews = await generateQuestionReviews({
            interviewId,
            userId
        });

        return { feedback: existingFeedback, reviews };
    }

    let transcript = "";

    for (const message of interview.messages) {
        transcript += `
${message.role}:
${message.content}

Topic:
${message.topic || "General"}

Difficulty:
${message.difficulty || "Not specified"}

---------------------------------------
`;
    }

    const prompt = `
You are a Senior Technical Interviewer evaluating a completed live interview.

Candidate Role:
${interview.role}

Experience Level:
${interview.level}

Interview Type:
${interview.type}

Complete Live Interview Transcript:

${transcript}

Evaluate the candidate professionally.

The interview was adaptive. Some questions may be follow-up questions based on the candidate's previous answers.

Evaluate the candidate only from their answers.

Return ONLY valid JSON.

Return exactly this structure:

{
    "overallScore": 82,
    "technicalScore": 84,
    "communicationScore": 76,
    "confidenceScore": 81,
    "problemSolvingScore": 79,
    "strengths": "Mention the candidate's specific strengths based on the interview.",
    "weaknesses": "Mention the candidate's specific weaknesses based on the interview.",
    "suggestions": "Give practical and specific suggestions for improvement.",
    "summary": "Write a professional interview summary in 70-100 words."
}

Rules:
- All scores must be numbers between 0 and 100.
- Base the evaluation only on the candidate's answers.
- Do not give credit for information stated by the interviewer.
- Consider answer correctness and technical depth.
- Consider how clearly concepts were explained.
- Consider whether the candidate handled follow-up questions well.
- Consider confidence based on clarity and decisiveness of answers.
- Consider problem-solving ability where demonstrated.
- Strengths must be specific to this interview.
- Weaknesses must be specific to this interview.
- Suggestions must be practical.
- Return only JSON.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let feedback;

    try {
        feedback = JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error(
            "Invalid live interview feedback received from Gemini."
        );
    }

    const scoreFields = [
        "overallScore",
        "technicalScore",
        "communicationScore",
        "confidenceScore",
        "problemSolvingScore"
    ];

    for (const field of scoreFields) {
        if (
            typeof feedback[field] !== "number" ||
            feedback[field] < 0 ||
            feedback[field] > 100
        ) {
            throw new Error(
                "Invalid score received in live interview feedback."
            );
        }
    }

    if (
        typeof feedback.strengths !== "string" ||
        typeof feedback.weaknesses !== "string" ||
        typeof feedback.suggestions !== "string" ||
        typeof feedback.summary !== "string"
    ) {
        throw new Error(
            "Incomplete live interview feedback received from Gemini."
        );
    }

    const savedFeedback =
        await prisma.feedback.create({
            data: {
                overallScore: feedback.overallScore,
                technicalScore: feedback.technicalScore,
                communicationScore: feedback.communicationScore,
                confidenceScore: feedback.confidenceScore,
                problemSolvingScore: feedback.problemSolvingScore,
                strengths: feedback.strengths,
                weaknesses: feedback.weaknesses,
                suggestions: feedback.suggestions,
                summary: feedback.summary,
                interviewId: interview.id
            }
        });

    const reviews =
    await generateQuestionReviews({

        interviewId,

        userId

    });

    return {
        feedback: savedFeedback,
        reviews
    };
};

const getQuestionReviews = async ({
    interviewId,
    userId
}) => {

    const interview = await prisma.interview.findFirst({

        where: {
            id: interviewId,
            userId,
            mode: "LIVE"
        }

    });

    if (!interview) {

        const error = new Error("Interview not found.");
        error.status = 404;
        throw error;

    }

    const reviews = await prisma.questionReview.findMany({

        where: {
            interviewId: interview.id
        },

        include: {

            questionMessage: true

        },

        orderBy: {

            createdAt: "asc"

        }

    });

    return reviews.map((review) => ({

        questionMessageId: review.questionMessageId,

        question: review.questionMessage.content,

        candidateAnswer: review.candidateAnswer,

        idealAnswer: review.idealAnswer,

        explanation: review.explanation,

        score: review.score

    }));

};
const getLiveInterviewHistory = async (userId) => {

    const interviews = await prisma.interview.findMany({

        where: {
            userId,
            mode: "LIVE",
            status: "COMPLETED"
        },

        include: {

            feedback: {

                select: {

                    overallScore: true

                }

            }

        },

        orderBy: {

            endedAt: "desc"

        }

    });

    return interviews.map((interview) => ({

        interviewId: interview.id,

        role: interview.role,

        level: interview.level,

        type: interview.type,

        status: interview.status,

        overallScore:
            interview.feedback?.overallScore ?? null,

        createdAt: interview.createdAt,

        startedAt: interview.startedAt,

        endedAt: interview.endedAt

    }));

};
const getLiveInterviewById = async ({
    interviewId,
    userId
}) => {

    const interview = await prisma.interview.findFirst({

        where: {
            id: interviewId,
            userId,
            mode: "LIVE"
        },

        include: {

            feedback: true,

            messages: {

                orderBy: {
                    createdAt: "asc"
                }

            },

            reviews: {

                include: {
                    questionMessage: true
                },

                orderBy: {
                    createdAt: "asc"
                }

            }

        }

    });

    if (!interview) {

        const error = new Error("Interview not found.");
        error.status = 404;
        throw error;

    }

    const duration =
        interview.startedAt && interview.endedAt
            ? Math.floor(
                  (interview.endedAt.getTime() -
                      interview.startedAt.getTime()) /
                      1000
              )
            : null;

    return {

        interviewId: interview.id,

        role: interview.role,

        level: interview.level,

        type: interview.type,

        status: interview.status,

        createdAt: interview.createdAt,

        startedAt: interview.startedAt,

        endedAt: interview.endedAt,

        duration,

        feedback: interview.feedback,

        messages: interview.messages,

        reviews: interview.reviews.map((review) => ({

            questionMessageId: review.questionMessageId,

            question: review.questionMessage.content,

            candidateAnswer: review.candidateAnswer,

            idealAnswer: review.idealAnswer,

            explanation: review.explanation,

            score: review.score

        }))

    };

};
module.exports = {
    startLiveInterview,
    submitLiveAnswer,
    generateLiveInterviewFeedback,
    generateQuestionReviews,
    getQuestionReviews,
    getLiveInterviewHistory,
    getLiveInterviewById
};
