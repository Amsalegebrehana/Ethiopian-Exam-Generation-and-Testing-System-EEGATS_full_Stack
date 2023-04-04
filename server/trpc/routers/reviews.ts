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
        });
      }),

});
