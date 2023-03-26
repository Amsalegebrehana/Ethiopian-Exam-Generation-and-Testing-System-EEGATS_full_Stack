import { z } from "zod";
import { publicProcedure, router } from "../trpc";


export const testTakerRouter = router({
    getTestTakersCount: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.testTakers.count();
    }),
    getTestTakers: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.testTakers.findMany({
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
        

});