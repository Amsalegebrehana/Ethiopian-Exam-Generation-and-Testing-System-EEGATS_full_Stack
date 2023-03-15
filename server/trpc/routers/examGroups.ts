import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const examGroupRouter = router({
    getExamGroupCount: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.examGroup.count();
    }),
    getExamGroups: publicProcedure
      .input(
        z.object({
          skip: z.number(),
          search: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await ctx.prisma.examGroup.findMany({
          include:{
            _count:{
                select:{
                    Exam:true
                }
            }
          },
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

      addExamGroup: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.prisma.examGroup.create({
                data: {
                    name: input.name,
                },
            });
            return data;
        }),

        getExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.findUnique({
                    where: {
                        id: input.id,
                    },
                });
                return data;
        }),

        updateExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    name: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                    },
                });
                return data;
        }),

        deleteExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.delete({
                    where: {
                        id: input.id,
                    },
                });
                return data;
            }),
});