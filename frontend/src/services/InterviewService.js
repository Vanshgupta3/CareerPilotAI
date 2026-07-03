import axios from "axios";

const INTERVIEW_API = "http://localhost:5000/api/interview";
const ANSWER_API = "http://localhost:5000/api/answer";

// Start Interview
export const startInterview = async (data, token) => {

    const response = await axios.post(

        `${INTERVIEW_API}/start`,

        data,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Get Interview Questions
export const getInterviewQuestions = async (

    interviewId,
    token

) => {

    const response = await axios.get(

        `${INTERVIEW_API}/${interviewId}/questions`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Submit All Answers
export const submitAnswers = async (

    answers,
    token

) => {

    const response = await axios.post(

        `${ANSWER_API}/submit`,

        {
            answers
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Generate Interview Feedback
export const generateInterviewFeedback = async (

    interviewId,
    token

) => {

    const response = await axios.post(

        `${INTERVIEW_API}/feedback`,

        {
            interviewId
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};