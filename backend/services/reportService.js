const PDFDocument = require("pdfkit");
const prisma = require("../prisma/prismaClient");

const downloadInterviewReport = async ({
    interviewId,
    userId,
    res
}) => {

    const interview = await prisma.interview.findFirst({

        where: {
            id: interviewId,
            userId
        },

        include: {

            user: true,

            resume: {

                include: {

                    analysis: true

                }

            },

            feedback: true,

            questions: {

                include: {

                    answers: true

                }

            },

            messages: {

                orderBy: {

                    createdAt: "asc"

                }

            },

            reviews: {

                include: {

                    questionMessage: true

                }

            }

        }

    });

    if (!interview) {

        const error = new Error("Interview not found.");

        error.status = 404;

        throw error;

    }

    const doc = new PDFDocument({

        margin: 50

    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=CareerPilot_Report_${interview.id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(24)
        .text("CareerPilot", {
            align: "center"
        });

    doc.moveDown();

    doc.fontSize(18)
        .text("AI Interview Report", {
            align: "center"
        });

    doc.moveDown(2);

    doc.fontSize(14)
        .text(`Candidate : ${interview.user.name}`);

    doc.text(`Role : ${interview.role}`);

    doc.text(`Level : ${interview.level}`);

    doc.text(`Interview Type : ${interview.type}`);

    doc.text(`Interview Mode : ${interview.mode}`);

    doc.text(
        `Interview Date : ${interview.createdAt.toLocaleString()}`
    );

    if (
        interview.startedAt &&
        interview.endedAt
    ) {

        const duration = Math.floor(

            (
                interview.endedAt.getTime() -
                interview.startedAt.getTime()

            ) / 1000

        );

        doc.text(
            `Duration : ${duration} seconds`
        );

    }

    doc.end();

};

module.exports = {

    downloadInterviewReport

};