import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const examRouter = router({
    getExamsCount: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.exam.count();
    }),
    getExams: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.exam.findMany({
                skip: input.skip,
                take: 6,
                orderBy: {
                    createdAt: "desc",
                },
                where: {
                    name: {
                        contains: input.search,
                       },
                },
            });
        }),
        // create exam
    createExam: publicProcedure
        .input(
            z.object({
                name: z.string(),
                examGroupId: z.string(),
                poolId: z.string(),
                numberOfQuestions: z.number(),
                testingDate: z.date(),
                duration: z.number(),
                categories: z.array(z.object({
                    selectedId: z.string(),
                    inputValue: z.number(),
                })),
            })
        )
        .mutation(async ({ ctx, input }) => {
            console.log("here is the input ", input);

            const data = await ctx.prisma.exam.create({
                data: {
                    name: input.name,
                    examGroupId: input.examGroupId,
                    poolId: input.poolId,
                    numberOfQuestions: input.numberOfQuestions,
                    testingDate: input.testingDate,
                    duration: input.duration,
                    status: "generated",
                },
            });
            // categories for exam
            // filter aproved questions by category id
            // assign each approved questions the create exam id
            // filter questions by category id
            console.log("Categories from backend ", input.categories);
            
            input.categories.forEach(async (category) => {
                console.log(" selected Categories  id", category.selectedId)
                const approvedQuestions = await ctx.prisma.questions.findMany({  
                    where: {
                        
                        catId: category.selectedId,
                        status: "approved",
                    },
                });
                console.log("approvedQuestions first ", approvedQuestions);

                // pick random based on the number of questions
                //  Fisher-Yates shuffle algorithm
                const randomApprovedQuestions = [];
                // shuffle the array
                for (let i = approvedQuestions.length - 1; i > 0; i--) {

                    const j = Math.floor(Math.random() * (i + 1));
                    [approvedQuestions[i], approvedQuestions[j]] = [approvedQuestions[j], approvedQuestions[i]];
                  };

                // take the first category.inputValue elements from the shuffled array
                randomApprovedQuestions.push(...approvedQuestions.slice(0, category.inputValue));

                // iterate the randomly picked questions then assign the exam id to each question
                randomApprovedQuestions.forEach(async (question) => {

                    question.examId = data.id;

                    // question.status = "selected";
                    // then update the question table
                    await ctx.prisma.questions.update({
                        where: {
                            id: question.id,
                        },
                        data: {
                            examId: question.examId,
                        },
                    });
                });
                console.log("sec approvedQuestions created ", randomApprovedQuestions);

            }
            );
            return data;
        }),
        // get exam by id
        getExam: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,
                    },
                });
            }),
            // get all exams by exam group id
        getExamsByExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        examGroup: {
                            id: input.id,
                        },
                    },
                });
            }),
            // get all exams by pool id
        getExamsByPool: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        pool: {
                            id: input.id,
                        },
                    },
                });
            }),

});