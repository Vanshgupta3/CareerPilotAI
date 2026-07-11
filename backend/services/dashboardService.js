const prisma = require("../prisma/prismaClient");

const getDashboardStats = async (userId) => {

    const totalInterviews =
        await prisma.interview.count({

            where: {

                userId

            }

        });
        const liveInterviews =
    await prisma.interview.count({

        where: {

            userId,

            mode: "LIVE"

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
const latestInterview =
    await prisma.interview.findFirst({

        where: {

            userId

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
    const recentInterviews =
    await prisma.interview.findMany({

        where: {

            userId

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

        },

        take: 5

    });
    return {

    totalInterviews,

    liveInterviews,

    completedInterviews,

    averageScore,

    highestScore,

    atsScore:
        latestResume?.analysis?.atsScore || 0,

    latestInterview,

    recentInterviews

};

};
const getDashboardAnalytics = async (userId) => {

    const feedbacks = await prisma.feedback.findMany({

        where: {

            interview: {

                userId

            }

        },

        include: {

            interview: {

                select: {

                    createdAt: true

                }

            }

        },

        orderBy: {

            interview: {

                createdAt: "asc"

            }

        }

    });

    const latestResume = await prisma.resume.findFirst({

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

    const average = (field) => {

        if (feedbacks.length === 0) return 0;

        return Number(

            (
                feedbacks.reduce(

                    (sum, item) => sum + item[field],

                    0

                ) / feedbacks.length

            ).toFixed(1)

        );

    };

    const scoreHistory = feedbacks.map((item) => ({

        date: item.interview.createdAt,

        overallScore: item.overallScore

    }));

    return {

        overallAverage: average("overallScore"),

        technicalAverage: average("technicalScore"),

        communicationAverage: average("communicationScore"),

        confidenceAverage: average("confidenceScore"),

        problemSolvingAverage: average("problemSolvingScore"),

        bestScore:
            feedbacks.length
                ? Math.max(...feedbacks.map(f => f.overallScore))
                : 0,

        latestScore:
            feedbacks.length
                ? feedbacks[feedbacks.length - 1].overallScore
                : 0,

        totalInterviews: feedbacks.length,

        resumeATS:
            latestResume?.analysis?.atsScore ?? 0,

        scoreHistory

    };

};
module.exports = {

    getDashboardStats,
    getDashboardAnalytics

};