import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const poolRouter = router({
  getPoolContributorsCount: protectedProcedure
    .input(
      z.object({
        poolId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        return await ctx.prisma.contributors.count({
          where: {
            poolId: { equals: input.poolId },
          }
        });
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    }),
  getPoolContributors: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
        poolId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const contributors = await ctx.prisma.contributors.findMany({
          skip: input.skip,
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            poolId: { equals: input.poolId },
            name: {
              contains: input.search,
              mode: 'insensitive'
            },
          },
          include: {
            contributorAssignments: {
              where: {
                questionsRemaining: {
                  gt: 0
                }
              }
            }

          }
        }).then((contributors) => {
          contributors.map((contributor) => {
            let sumOfQuestions = 0;
            contributor.contributorAssignments.forEach((contr) => {
              sumOfQuestions += contr.questionsRemaining;
            });
            contributor.reviewsMade = sumOfQuestions;
            //REVIEWS MADE HAS BEEN CHANGED TO TOTAL QUESTIONS ASSIGNED
          });

          return contributors;
        });
        return contributors;

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),
  getPoolsCount: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        return await ctx.prisma.pool.count({
          where: {
            name: {
              contains: input.search,
              mode: 'insensitive'
            },
          },
        });
      }
    }),

  getPools: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        return await ctx.prisma.pool.findMany({
          skip: input.skip,
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            name: {
              contains: input.search,
              mode: 'insensitive'
            },
          },
          include: {
            _count: {
              select: {
                Questions: {
                  where: {
                    status: { equals: 'approved' }
                  }
                },

              },

            },

          },
        });
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }
    }),

  addPool: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const data = await ctx.prisma.pool.create({
          data: {
            name: input.name,
          },
        });
        return data;

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),

  getPool: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        const data = await ctx.prisma.pool.findUnique({
          where: {
            id: input.id,
          },
        });
        return data;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),

  updatePool: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        const data = await ctx.prisma.pool.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
        });
        return data;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),

  deletePool: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        try {

          const data = await ctx.prisma.pool.delete({
            where: {
              id: input.id,
            },
          });
          return data;
        }
        catch (e) {
          return 'Can\'t delete pool.';
        }

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),
  getPoolsWithCategories: protectedProcedure
    .input(
      z.object({

      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        const data = await ctx.prisma.pool.findMany({
          select: {
            id: true,
            name: true,
            Category: {
              select: {
                id: true,
                name: true,
                questions: {
                  where: {
                    status: { equals: 'approved' }
                  }
                }
              }
            }
          }
        });
        return data;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),


});
