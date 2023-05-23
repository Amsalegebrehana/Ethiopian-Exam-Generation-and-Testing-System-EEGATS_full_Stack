import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const filter = (text: string) => {
    const length = 100;
    const clamp = '...';
    text = text.slice(3, -4);
    var new_content = text.length > length ? text.slice(0, length) + clamp : text;
    new_content = '<p>' + new_content + '</p>';
    return new_content;
};



export const reviewsRouter = router({
    getReviewsCount: publicProcedure
        .input(
            z.object({
                reviewerId: z.string(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.review.count({
                where: {
                    questions: {
                        title: {
                            contains: input.search,
                        }
                    },
                    reviewerId: input.reviewerId,
                    isReviewed: false
                },
            });
        }),
    getReviews: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
                reviewerId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {

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
    getReview: publicProcedure
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

    getQuestionForReview: publicProcedure
        .input(
            z.object({
                reviewId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
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

    registerFeedback: publicProcedure
        .input(
            z.object({
                reviewId: z.string(),
                feedback: z.string(),
                final: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
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
                    return data;
                }
            });

            return data;
        }),

});
