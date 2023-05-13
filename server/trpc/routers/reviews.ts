import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const reviewsRouter = router({
    getReviewsCount: publicProcedure
        .input(
            z.object({
                reviewerId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.review.count({
                where: {
                    reviewerId: input.reviewerId
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
                    // name: {
                    //   contains: input.search,
                    // },
                    reviewerId: input.reviewerId
                },
                include: {
                    questions: {
                        select: {
                            title: true
                        }
                    }
                }
            });
            //   console.log("backend")
            //   const new_reviews: any[] | PromiseLike<any[]> = []
            //   reviews.forEach(async review => {
            //       const question = await ctx.prisma.questions.findUnique({where:{id: review.questionId}})
            //       const curr = {
            //           "review": review,
            //           "questionTitle": question?.title
            //       }
            //       new_reviews.push(curr);
            //       console.log(new_reviews);

            //   });
            //   console.log("passed")
            //   console.log(new_reviews);
            //   return new_reviews;
        }),
    //   getReview: publicProcedure
    //     .input(
    //       z.object({
    //         id: z.string(),
    //       })
    //     )
    //     .query(async ({ ctx, input }) => {
    //       const data = await ctx.prisma.review.findUnique({
    //         where: {
    //           id: input.id,
    //         },
    //       });
    //       return data;
    //     }),

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
                }
            });

            return data;
        }),

});
