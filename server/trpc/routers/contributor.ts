import { z } from "zod";
import { sendInviteEmail } from "~~/utils/mailer";
import { publicProcedure, router } from "../trpc";
const { auth } = useRuntimeConfig();
import bcrypt from "bcrypt";
export const contributorRouter = router({

  getReviewsReamining: publicProcedure
  .input(
    z.object({ 
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.findUnique({
      where: {
        id: input.id,
      }
    }).then((data) => {
      return data?.reviewsRemaining;
    }
  )}),
  getQuestionsRemaining: publicProcedure
  .input(
    z.object({
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.findUnique({
      where: {
        id: input.id,
      }
    }).then((data) => {
      return data?.questionsRemaining;
    }
  )}),
  assignReviews: publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.findUnique({
      where: {
        id: input.id,
      }
    }).then(async (data) => {
      if(data){

        await ctx.prisma.contributors.update({
          where: {
            id: input.id,
          },
          data: {
            reviewsRemaining: data?.reviewsRemaining - 1,
          },
        });
        return data;
      }
    }
  )
  }),
  assignQuestion: publicProcedure
  .input(
    z.object({
      id: z.string(),
      numberofQuestions: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.update({
      where: {
        id: input.id,
      },
      data: {
        questionsRemaining: input.numberofQuestions,
      },
    });
    return data;
  }),
  disableContributor: publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.update({
      where: {
        id: input.id,
      },
      data: {
        isActive: false,
      },
    });
    return data;
  }),
  inviteContributor: publicProcedure
    .input(
      z.object({
        email: z.string(),
        poolId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      sendInviteEmail({
        url: `${auth.origin}/contributor/register?poolId=${input.poolId}`,
        email: input.email,
      });

      return true;
    }),

  registerContributor: publicProcedure
    .input(
      z.object({
        name : z.string(),
        password: z.string(),
        email: z.string(),
        poolId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.poolId);
      const pwd = await bcrypt.hash(input.password, 10)
      const res = await ctx.prisma.pool.findUnique({
        where: {
          id: input.poolId,
        }
      }).then(async (data) => {
        if(data){
          const res= await ctx.prisma.contributors.create({
            data: {
              name: input.name,
              password: pwd,
              email: input.email,
              poolId: data?.id,
            },
          });
          return res;
        }
          
      });
      return res;
      
    }),
});
