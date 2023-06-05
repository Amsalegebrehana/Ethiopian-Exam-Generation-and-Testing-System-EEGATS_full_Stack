import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import nodemailer from "nodemailer";
const { auth } = useRuntimeConfig();
import { TRPCError } from "@trpc/server";



export const filter = (text: string, length=100) => {
    const clamp = '...';
    text = text.slice(3, -4);
    var new_content = text.length > length ? text.slice(0, length) + clamp : text;
    new_content = '<p>' + new_content + '</p>';
    return new_content;
};



export async function sendNotification({
    email,
    url,
    pool
}: {
    email: string;
    url: string;
    pool: string;
}) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: "invite.eegts@gmail.com",
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: ' <no-reply@eegts.com>',
        to: email,
        subject: "Contribute at EEGTS",
        html: `<p>Greetings,<br></p> <p>You have been assigned to contribute more questions for the Ethiopian Exam Generation and Testing System's ${pool} pool.<br></p><p>Log into your account by clicking <a href="${url}">HERE</a></p>`,
    });

}


export const reviewsRouter = router({
    getReviewsCount: protectedProcedure
        .input(
            z.object({
                reviewerId: z.string(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            
            // restrict if not contributor
            if (ctx.session.role !== "contributor") {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            // restrict if not the right contributor trys to access
            if (ctx.session.uid !== input.reviewerId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            return await ctx.prisma.review.count({
                where: {
                    questions: {
                        title: {
                            contains: input.search,
                            mode: 'insensitive'
                        }
                    },
                    reviewerId: input.reviewerId,
                    isReviewed: false
                },
            });
        }),
    getReviews: protectedProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
                reviewerId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {

            // restrict if not contributor
            if (ctx.session.role !== "contributor") {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            // restrict if not the right contributor trys to access
            if (ctx.session.uid !== input.reviewerId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            return await ctx.prisma.review.findMany({
                skip: input.skip,
                take: 6,
                orderBy: {
                    createdAt: "desc",
                },

                where: {
                    questions: {
                        title: {
                            contains: input.search,
                            mode: 'insensitive'
                        }
                    },
                    reviewerId: input.reviewerId,
                    isReviewed: false
                },
                include: {
                    questions: {
                        select: {
                            title: true
                        }
                    }
                }
            }).then((reviews) => {
                reviews.forEach(review => {
                    review.questions.title = filter(review.questions.title);
                });
                return reviews;
            });
        }),
    getReview: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.prisma.review.findUnique({
                where: {
                    id: input.id,
                },
            });
            return data;
        }),

    getQuestionForReview: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            // restrict if not contributor
            if (ctx.session.role !== "contributor") {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            const review = await ctx.prisma.review.findUnique({
                where: {
                    id: input.reviewId,
                }
            });

            // restrict if not the right contributor trys to access
            if (ctx.session.uid !== review?.reviewerId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            const data = await ctx.prisma.review.findFirst({
                where: {
                    id: input.reviewId,
                },
                select: {
                    questions: {
                        select: {
                            title: true,
                            id: true,
                            image: true,
                            choices: true,
                            QuestionAnswer: {
                                select: {
                                    choiceId: true
                                }
                            },
                            category: {
                                select: {
                                    name: true

                                }
                            },
                            pool: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            return data;
        }),

    registerFeedback: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
                feedback: z.string(),
                final: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {

            // restrict if not contributor
            if (ctx.session.role !== "contributor") {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }

            const review = await ctx.prisma.review.findUnique({
                where: {
                    id: input.reviewId,
                }
            });

            // restrict if not the right contributor trys to access
            if (ctx.session.uid !== review?.reviewerId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',

                });
                process.exit();
            }


            const data = await ctx.prisma.review.update({
                where: {
                    id: input.reviewId,
                },
                data: {
                    feedback: input.feedback,
                    isReviewed: true
                },
            }).then(async (data) => {
                const question = await ctx.prisma.questions.update({
                    where: {
                        id: data.questionId
                    },
                    data: {
                        status: input.final ? "approved" : "rejected"
                    }
                });

                if (input.final) {
                    const pool = await ctx.prisma.pool.update({
                        where: {
                            id: question.poolId
                        },
                        data: {
                            numberOfQuestions: {
                                increment: 1,
                            }
                        }
                    });
                    return data;
                } else {
                    const contAss = await ctx.prisma.contributorAssignment.update({
                        where: {
                            contrId_catId: {
                                contrId: question.contributorId,
                                catId: question.catId,
                            }
                        },
                        data: {
                            questionsRemaining: {
                                increment: 1
                            }
                        }
                    });
                    const contributor = await ctx.prisma.contributors.findUnique({
                        where: {
                            id: question.contributorId
                        }
                    });

                    const pool = await ctx.prisma.pool.findUnique({
                        where: {
                            id: contributor?.poolId,
                        },
                    });

                    sendNotification({ email: contributor!.id, pool: pool!.name, url: `${auth.origin}/contributor/login` });

                    return data;
                }
            });

            return data;
        }),

});
