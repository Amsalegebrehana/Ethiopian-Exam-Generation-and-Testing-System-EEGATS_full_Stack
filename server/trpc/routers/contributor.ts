import { z } from "zod";
import {  sendNewInvite, sendReturnEmail } from "~~/utils/mailer";
import { publicProcedure, router } from "../trpc";
const { auth } = useRuntimeConfig();
import bcrypt from "bcrypt";
export const contributorRouter = router({

  getQuestionCount: publicProcedure
  .input(
    z.string()
  )
  .query(
    async ({ctx, input}) => {
      const data = await ctx.prisma.questions.count({
        where: {
          contributorId: input,
        }
      }).then((data) => {
        return data;
      })

      return data;
    }
  ),

  getAllQuestions: publicProcedure
  .query(
    async ({ctx, input}) => {
      const data = await ctx.prisma.questions.findMany()
      .then((data) => {
        return data;
      })
      return data;
    }
  ),


  getReviewsMade: publicProcedure
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
      return data?.reviewsMade;
    })
    return data;

}),

  checkifAssigned : publicProcedure
  .input(
   z.object({
     contrId: z.string(),
    
   })
 )
 .query(async ({ ctx, input }) => {

   const contributor  =  await ctx.prisma.contributors. findUnique({
     where : {
       id : input.contrId
     }
   })

   const data = await ctx.prisma.contributors.findMany({
    select: {
      _count: {
        select: {
          contributorAssignments: { where: {
                   contrId : input.contrId,
                   category : {
                     poolId : contributor?.poolId
                   },
                   questionsRemaining : {
                     gt :0 
                   }
                 },},
        },
      },
    },
       }
     
    
   )
   .then(
     (data)=> {
      var count = 0;
      data.forEach(element => {
        count += element._count.contributorAssignments
      });

      return count > 0
    }
    
    )
    return data;

 }),
  getAssignedCategories: publicProcedure
   .input(
    z.object({
      contrId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const contributor  =  await ctx.prisma.contributors. findUnique({
      where : {
        id : input.contrId
      }
    })
    const data = await ctx.prisma.category.findMany({
      where: {
        contributorAssignments :{
          
          some : {
            contrId : input.contrId,
            category : {
              poolId : contributor?.poolId
            },
            questionsRemaining : {
              gt :0 
            }
          }
       
        }
      },
      
     
    });
   return data;
  }),
 
  // getQuestionsRemaining: publicProcedure
  // .input(
  //   z.object({
  //     id: z.string(),
     
  //   })
  // )
  // .query(async ({ ctx, input }) => {
  //   const data = await ctx.prisma.contributors.findUnique({
  //     where: {
  //       id: input.id,
  //     }
  //   }).then((data) => {
  //     return data?.questionsRemaining;
  //   }
  // )}),


  // assignQuestion: publicProcedure
  // .input(
  //   z.object({
  //     id: z.string(),
  //     numberofQuestions: z.number(),
  //   })
  // )
  // .mutation(async ({ ctx, input }) => {
  //   const data = await ctx.prisma.contributors.update({
  //     where: {
  //       id: input.id,
  //     },
  //     data: {
  //       questionsRemaining: input.numberofQuestions,
  //     },
  //   });
  //   return data;
  // }),
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
  getContributorId : publicProcedure
  .input(z.object({
    email : z.string()
  })).query(async ({ ctx, input }) => {
    const data = await ctx.prisma.contributors.findUnique({
      where: {
        email: input.email,
      }
    });
    return data?.id;

  }),
  inviteContributor: publicProcedure
    .input(
      z.object({
        email: z.string(),
        poolId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pool = await ctx.prisma.pool.findUnique({
        where: {
          id: input.poolId,
        }
      })
      const user = await ctx.prisma.contributors.findUnique({
        where: {
          email: input.email,
        }
      });
      if(user?.poolId === input.poolId){
        return 'Already a member of this pool'
      }
      if(user){
        await ctx.prisma.contributors.update({
          where: {
            email: input.email,
          },
          data: {
            poolId: input.poolId,
            isActive: true,
          }
        }).then((data) => {
          if(pool){
            sendReturnEmail({
              url: `${auth.origin}`,
              email: input.email,
              pool : pool?.name,
            });
          }
        });
      }else{
        if(pool){
          sendNewInvite({
            url: `${auth.origin}/contributor/register?poolId=${input.poolId}`,
            email: input.email,
            pool : pool?.name,
          });
        }
      }
   

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
