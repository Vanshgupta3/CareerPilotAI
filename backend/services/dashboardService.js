const prisma = require("../prisma/prismaClient");

const getDashboardStats = async (userId) => {

    const totalInterviews =
        await prisma.interview.count({

            where: {

                userId

            }

        });

    const completedInterviews =
        await prisma.feedback.count({

            where: {

                interview: {

                    userId

                }

            }

        });

    const feedbacks =
        await prisma.feedback.findMany({

            where: {

                interview: {

                    userId

                }

            },

            select: {

                overallScore: true

            }

        });

    const highestScore =
        feedbacks.length > 0
            ? Math.max(
                  ...feedbacks.map(
                      (f) => f.overallScore
                  )
              )
            : 0;

    const averageScore =
        feedbacks.length > 0
            ? Math.round(
                  feedbacks.reduce(

                      (sum, item) =>
                          sum + item.overallScore,

                      0

                  ) / feedbacks.length
              )
            : 0;

    const latestResume =
        await prisma.resume.findFirst({

            where: {

                userId

            },

            include: {

                analysis: true

            },

            orderBy: {

                uploadedAt: "desc"

            }

        });

    return {

        totalInterviews,

        completedInterviews,

        averageScore,

        highestScore,

        atsScore:
            latestResume?.analysis?.atsScore || 0

    };

};

module.exports = {

    getDashboardStats

};