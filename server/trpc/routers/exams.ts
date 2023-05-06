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
    addExam: publicProcedure
        .input(
            z.object({
                name: z.string(),
                examGroupId: z.string(),
                poolId: z.string(),
                numberOfQuestions: z.number(),
                testingDate: z.date(),
                duration: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
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