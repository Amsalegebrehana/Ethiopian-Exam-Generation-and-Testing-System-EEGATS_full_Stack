import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const poolRouter = router({
  getPoolsCount: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pool.count();
  }),
  getPools: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pool.findMany({
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


  addPool: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.pool.create({
        data: {
          name: input.name,
        },
      });
      return data;
    }),

  getPool: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.pool.findUnique({
        where: {
          id: input.id,
        },
      });
      return data;
    }),

  updatePool: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.pool.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return data;
    }),

  deletePool: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.pool.delete({
        where: {
          id: input.id,
        },
      });
      return data;
    }),
});
