const PDFDocument = require("pdfkit");
const prisma = require("../prisma/prismaClient");

const C = {
    ink: "#132238", navy: "#10253F", blue: "#1E6FF2", cyan: "#4ED5F6",
    paper: "#F7F9FC", white: "#FFFFFF", slate: "#667085", line: "#DCE3EC",
    green: "#16A36A", amber: "#E99B25", red: "#D65353", softBlue: "#EAF2FF",
    softGreen: "#E9F8F0", softAmber: "#FFF5E4", softRed: "#FFF0F0"
};

const PAGE = { width: 595.28, height: 841.89, left: 48, right: 48, top: 58, bottom: 58 };
const CONTENT_WIDTH = PAGE.width - PAGE.left - PAGE.right;

function clean(value, fallback = "Not available") {
    if (value === null || value === undefined || value === "") return fallback;
    return String(value).replace(/[\u2022\u2023]/g, "-");
}

function scoreColor(score) {
    const value = Number(score) || 0;
    return value >= 75 ? C.green : value >= 55 ? C.amber : C.red;
}

function scoreLabel(score) {
    const value = Number(score) || 0;
    return value >= 75 ? "Strong" : value >= 55 ? "Developing" : "Needs focus";
}

function durationLabel(startedAt, endedAt) {
    if (!startedAt || !endedAt) return "Not recorded";
    const seconds = Math.max(0, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
    return `${Math.floor(seconds / 60)} min ${seconds % 60} sec`;
}

function drawRoundRect(doc, x, y, width, height, fill, radius = 12, stroke = null) {
    doc.roundedRect(x, y, width, height, radius).fill(fill);
    if (stroke) doc.roundedRect(x, y, width, height, radius).lineWidth(0.7).stroke(stroke);
}

function ensureSpace(doc, needed) {
    if (doc.y + needed > doc.page.height - PAGE.bottom) doc.addPage();
}

function addPageChrome(doc) {
    doc.save();
    doc.rect(0, 0, PAGE.width, 8).fill(C.blue);
    doc.fillColor(C.navy).font("Helvetica-Bold").fontSize(10).text("CAREERPILOT", PAGE.left, 25);
    doc.fillColor(C.slate).font("Helvetica").fontSize(8).text("INTERVIEW INTELLIGENCE REPORT", PAGE.left + 78, 26);
    doc.moveTo(PAGE.left, 45).lineTo(PAGE.width - PAGE.right, 45).lineWidth(0.6).stroke(C.line);
    doc.restore();
    doc.x = PAGE.left;
    doc.y = PAGE.top;
}

function sectionTitle(doc, kicker, title, description = "") {
    ensureSpace(doc, 88);
    doc.fillColor(C.blue).font("Helvetica-Bold").fontSize(8).text(kicker.toUpperCase());
    doc.moveDown(0.35);
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(22).text(title);
    if (description) {
        doc.moveDown(0.35);
        doc.fillColor(C.slate).font("Helvetica").fontSize(10.5).text(description, { width: CONTENT_WIDTH });
    }
    doc.moveDown(0.95);
}

function metricCard(doc, x, y, width, label, score) {
    const color = scoreColor(score);
    drawRoundRect(doc, x, y, width, 95, C.white, 14, C.line);
    doc.fillColor(C.slate).font("Helvetica-Bold").fontSize(8).text(label.toUpperCase(), x + 16, y + 15, { width: width - 32 });
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(25).text(String(Number(score) || 0), x + 16, y + 31);
    doc.fillColor(C.slate).font("Helvetica").fontSize(9).text("out of 100", x + 52, y + 45);
    doc.roundedRect(x + 16, y + 76, width - 32, 5, 3).fill(C.line);
    doc.roundedRect(x + 16, y + 76, Math.max(3, (width - 32) * Math.min(Math.max(Number(score) || 0, 0), 100) / 100), 5, 3).fill(color);
}

function insightPanel(doc, title, items, accent, tint) {
    const values = Array.isArray(items) ? items : clean(items, "").split(/\n+/).filter(Boolean);
    if (!values.length) return;
    const body = values.map((item) => `- ${clean(item, "")}`).join("\n");
    doc.font("Helvetica").fontSize(10.5);
    const bodyHeight = doc.heightOfString(body, { width: CONTENT_WIDTH - 58, lineGap: 3 });
    const height = Math.max(92, bodyHeight + 52);
    ensureSpace(doc, height + 12);
    const y = doc.y;
    drawRoundRect(doc, PAGE.left, y, CONTENT_WIDTH, height, tint, 12);
    doc.roundedRect(PAGE.left, y, 5, height, 3).fill(accent);
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(12).text(title, PAGE.left + 22, y + 16);
    doc.fillColor(C.ink).font("Helvetica").fontSize(10.5).text(body, PAGE.left + 22, y + 38, { width: CONTENT_WIDTH - 46, lineGap: 3 });
    doc.y = y + height + 12;
}

function keyValueGrid(doc, values) {
    const rows = values.filter((entry) => entry[1] !== undefined);
    const cardHeight = 54;

    const drawValue = (label, value, x, y, width) => {
        drawRoundRect(doc, x, y, width, cardHeight, C.paper, 10);
        doc.fillColor(C.slate).font("Helvetica-Bold").fontSize(7.5).text(label.toUpperCase(), x + 13, y + 11, { width: width - 26 });
        doc.fillColor(C.ink).font("Helvetica").fontSize(10.5).text(clean(value), x + 13, y + 26, { width: width - 26, ellipsis: true });
    };

    for (let index = 0; index < rows.length; index += 2) {
        ensureSpace(doc, cardHeight + 10);

        const y = doc.y;
        const gap = 10;
        const width = (CONTENT_WIDTH - gap) / 2;
        const [leftLabel, leftValue] = rows[index];
        const right = rows[index + 1];

        drawValue(leftLabel, leftValue, PAGE.left, y, width);
        if (right) {
            drawValue(right[0], right[1], PAGE.left + width + gap, y, width);
        }

        doc.x = PAGE.left;
        doc.y = y + cardHeight + 10;
    }
}

function bodyCard(doc, heading, body, badge) {
    const usable = CONTENT_WIDTH - 40;
    const text = clean(body, "No response was recorded.");
    doc.font("Helvetica").fontSize(10);
    const bodyHeight = doc.heightOfString(text, { width: usable, lineGap: 3 });
    const height = bodyHeight + 58;
    ensureSpace(doc, height + 12);
    const y = doc.y;
    drawRoundRect(doc, PAGE.left, y, CONTENT_WIDTH, height, C.white, 12, C.line);
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(11).text(heading, PAGE.left + 18, y + 15);
    if (badge) {
        doc.fillColor(C.blue).font("Helvetica-Bold").fontSize(8).text(badge, PAGE.left + 18, y + 31);
    }
    doc.fillColor(C.ink).font("Helvetica").fontSize(10).text(text, PAGE.left + 18, y + (badge ? 45 : 33), { width: usable, lineGap: 3 });
    doc.y = y + height + 12;
}

function drawCover(doc, interview, overall) {
    doc.save();
    doc.rect(0, 0, PAGE.width, PAGE.height).fill(C.navy);
    doc.circle(540, 82, 150).fillOpacity(0.16).fill(C.cyan).fillOpacity(1);
    doc.circle(50, 730, 210).fillOpacity(0.09).fill(C.blue).fillOpacity(1);
    doc.fillColor(C.cyan).font("Helvetica-Bold").fontSize(12).text("CAREERPILOT", PAGE.left, 55);
    doc.fillColor(C.white).font("Helvetica").fontSize(9).text("INTERVIEW INTELLIGENCE", PAGE.left, 73);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(34).text("Your interview,\nmade actionable.", PAGE.left, 165, { lineGap: 5 });
    doc.fillColor("#B8C7DA").font("Helvetica").fontSize(13).text("A clear readout of performance, strengths, and next steps.", PAGE.left, 255, { width: 360, lineGap: 4 });
    drawRoundRect(doc, PAGE.left, 338, CONTENT_WIDTH, 184, C.white, 18);
    doc.fillColor(C.slate).font("Helvetica-Bold").fontSize(9).text("OVERALL READINESS", PAGE.left + 26, 366);
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(54).text(String(overall), PAGE.left + 26, 388);
    doc.fillColor(C.slate).font("Helvetica").fontSize(13).text("/100", PAGE.left + 123, 425);
    doc.fillColor(scoreColor(overall)).font("Helvetica-Bold").fontSize(12).text(scoreLabel(overall), PAGE.left + 26, 467);
    doc.roundedRect(PAGE.left + 190, 404, 255, 10, 5).fill(C.line);
    doc.roundedRect(PAGE.left + 190, 404, Math.max(4, 255 * Math.min(Math.max(overall, 0), 100) / 100), 10, 5).fill(scoreColor(overall));
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(20).text(clean(interview.role), PAGE.left, 577, { width: CONTENT_WIDTH });
    doc.fillColor("#B8C7DA").font("Helvetica").fontSize(11).text(`${clean(interview.level)}  |  ${clean(interview.mode)}  |  ${new Date(interview.createdAt).toLocaleDateString()}`, PAGE.left, 606);
    doc.fillColor("#B8C7DA").font("Helvetica").fontSize(10).text(`Prepared for ${clean(interview.user?.name, "Candidate")}`, PAGE.left, 735);
    doc.restore();
}

async function downloadInterviewReport({ interviewId, userId, res }) {
    const interview = await prisma.interview.findFirst({
        where: { id: interviewId, userId },
        include: {
            user: true,
            resume: { include: { analysis: true } },
            feedback: true,
            questions: { include: { answers: true } },
            messages: { orderBy: { createdAt: "asc" } },
            reviews: { include: { questionMessage: true }, orderBy: { createdAt: "asc" } }
        }
    });
    if (!interview) {
        const error = new Error("Interview not found.");
        error.status = 404;
        throw error;
    }

    const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true, autoFirstPage: true });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=CareerPilot_Report_${interview.id}.pdf`);
    doc.pipe(res);

    const feedback = interview.feedback || {};
    const overall = Number(feedback.overallScore) || 0;
    drawCover(doc, interview, overall);
    // Every content page, including pages created automatically for long answers,
    // receives the same header treatment.
    doc.on("pageAdded", () => addPageChrome(doc));

    doc.addPage();
    sectionTitle(doc, "01 / Profile", "Interview at a glance", "The context behind this assessment.");
    keyValueGrid(doc, [
        ["Candidate", interview.user?.name], ["Role", interview.role],
        ["Experience level", interview.level], ["Interview type", interview.type],
        ["Interview mode", interview.mode], ["Status", interview.status],
        ["Interview date", new Date(interview.createdAt).toLocaleString()],
        ["Duration", durationLabel(interview.startedAt, interview.endedAt)]
    ]);

    if (interview.feedback) {
        ensureSpace(doc, 430);
        doc.moveDown(0.8);
        sectionTitle(doc, "02 / Performance", "A balanced scorecard", "Scores reveal where readiness is strongest and where practice will matter most.");
        const gap = 10;
        const width = (CONTENT_WIDTH - gap) / 2;
        const y = doc.y;
        metricCard(doc, PAGE.left, y, width, "Overall", feedback.overallScore);
        metricCard(doc, PAGE.left + width + gap, y, width, "Technical", feedback.technicalScore);
        metricCard(doc, PAGE.left, y + 105, width, "Communication", feedback.communicationScore);
        metricCard(doc, PAGE.left + width + gap, y + 105, width, "Confidence", feedback.confidenceScore);
        doc.y = y + 210;
        metricCard(doc, PAGE.left, doc.y, CONTENT_WIDTH, "Problem solving", feedback.problemSolvingScore);
        doc.y += 112;
        insightPanel(doc, "What is working", feedback.strengths, C.green, C.softGreen);
        insightPanel(doc, "Where to focus", feedback.weaknesses, C.amber, C.softAmber);
        insightPanel(doc, "Recommended next steps", feedback.suggestions, C.blue, C.softBlue);
        if (feedback.summary) {
            ensureSpace(doc, 150);
            sectionTitle(doc, "03 / Assessment", "Executive summary");
            bodyCard(doc, "AI assessment", feedback.summary, "BOTTOM LINE");
        }
    }

    const reviewMode = interview.mode === "LIVE" && interview.reviews?.length;
    const transcriptMode = interview.mode === "LIVE" && !reviewMode && interview.messages?.length;
    if (reviewMode || transcriptMode || interview.questions?.length) {
        doc.addPage();
        sectionTitle(doc, "04 / Evidence", reviewMode ? "Question reviews" : transcriptMode ? "Interview transcript" : "Questions and answers", "The detail behind the score.");
        if (reviewMode) {
            interview.reviews.forEach((review, index) => {
                // Keep a review together where possible so the candidate's
                // answer is never separated from its ideal answer.
                ensureSpace(doc, 380);
                bodyCard(doc, `Question ${index + 1}`, review.questionMessage?.content, `SCORE ${clean(review.score, 0)}/10`);
                bodyCard(doc, "Candidate answer", review.candidateAnswer);
                bodyCard(doc, "Ideal answer", review.idealAnswer);
                bodyCard(doc, "AI explanation", review.explanation);
            });
        } else if (transcriptMode) {
            interview.messages.forEach((message) => {
                const speaker = ["assistant", "ai", "interviewer"].includes(message.role) ? "Interviewer" : "Candidate";
                bodyCard(doc, speaker, message.content, speaker.toUpperCase());
            });
        } else {
            interview.questions.forEach((question, index) => {
                const answer = question.answers?.[0];
                bodyCard(doc, `Question ${index + 1}`, question.questionText, answer?.score != null ? `SCORE ${answer.score}/10` : "QUESTION");
                bodyCard(doc, "Candidate answer", answer?.answerText || "No answer submitted.");
                bodyCard(doc, "Ideal answer", question.idealAnswer || "An ideal answer was not saved for this earlier interview.");
                if (answer?.strengths) bodyCard(doc, "What you did well", answer.strengths);
                if (answer?.improvements) bodyCard(doc, "What to improve", answer.improvements);
            });
        }
    }

    if (interview.resume?.analysis) {
        const analysis = interview.resume.analysis;
        doc.addPage();
        sectionTitle(doc, "05 / Resume", "Resume intelligence", "A quick view of applicant tracking readiness and discoverability.");
        metricCard(doc, PAGE.left, doc.y, CONTENT_WIDTH, "ATS score", analysis.atsScore);
        doc.y += 112;
        bodyCard(doc, "Resume summary", analysis.summary, "OVERVIEW");
        insightPanel(doc, "Skills detected", analysis.skills, C.blue, C.softBlue);
        insightPanel(doc, "Missing keywords", analysis.missingKeywords, C.amber, C.softAmber);
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i += 1) {
        if (i === 0) continue;
        doc.switchToPage(i);
        doc.save();
        doc.moveTo(PAGE.left, PAGE.height - 35).lineTo(PAGE.width - PAGE.right, PAGE.height - 35).lineWidth(0.6).stroke(C.line);
        doc.fillColor(C.slate).font("Helvetica").fontSize(8).text("Generated by CareerPilot", PAGE.left, PAGE.height - 25);
        doc.text(`${i + 1} / ${range.count}`, PAGE.width - PAGE.right - 35, PAGE.height - 25, { width: 35, align: "right" });
        doc.restore();
    }
    doc.end();
}

module.exports = { downloadInterviewReport };
