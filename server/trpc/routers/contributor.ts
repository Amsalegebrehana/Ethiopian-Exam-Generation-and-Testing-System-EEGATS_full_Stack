import { array, z } from "zod";
import {  sendNewInvite, sendReturnEmail, sendNotificationEmail } from "~~/utils/mailer";
import { publicProcedure, router } from "../trpc";
import { validateEmail } from "~~/utils/emailValidation";
const { auth } = useRuntimeConfig();
import bcrypt from "bcrypt";
export const contributorRouter = router({

  
  getContributorQuestions: publicProcedure
  .input(
    z.string()
  )
  .query(
    async ({ctx, input}) => {
      const data = await ctx.prisma.questions.findMany({
        where: {
          contributorId: input,
        }
      })

      return data;
    }),

  getContributorQuestionCount: publicProcedure
  .input(
    z.string()
  )
  .query(
    async ({ctx, input}) => {
      const data = await ctx.prisma.questions.count({
        where: {
          contributorId: input,
        }
      })

      return data;
    }
  ),
  
  searchContributorQuestions: publicProcedure
  .input(
   z.object({
      skip: z.number(),
      search: z.string().optional(), 
      contributorID: z.string(), 
    })
  )
  .query(
    async ({ctx, input}) => {
      const data = await ctx.prisma.questions.findMany(
        {
          skip: input.skip, 
          take: 6, 
          orderBy: {
            createdAt: "desc"
          },
          where: {
            contributorId: input.contributorID,
            title: {
              contains: input.search,
            },
          },
        });
        return data;
    }),
    
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
 
  getQuestionsRemaining: publicProcedure
  .input(
    z.object({
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    await ctx.prisma.contributorAssignment.findMany({
      where: {
        contrId: input.id
      }
    }).then(async(data: { catId: any; questionsRemaining: any; }[])=>{
      let results: any[] = [];
      data.forEach(async(relation: { catId: any; questionsRemaining: any; })=>{
         const category = await ctx.prisma.category.findUnique({
          where: {
            id: relation.catId
          }
         });
         results.push({
                    category: category?.name,
                    questionsRemaining: relation.questionsRemaining
                  })
      });

      return results;
    });
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
      const emailCheck = validateEmail(input.email);
      if(emailCheck == false){
        return "Invalid Email!";
      }
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

    checkContributorAssignmnet: publicProcedure
      .input(
        z.object({
          email: z.string(),
          poolId: z.string()
        })
      )
      .query(async({ctx,input})=>{
        const emailCheck = validateEmail(input.email);
        if(emailCheck == false){
          return "Invalid Email!";
        }
        const contributor = await ctx.prisma.contributors.findUnique({
          where:{
            email:input.email
          }
        });

        if(contributor && contributor.poolId===input.poolId){
          return "Already a member of this pool";
        }

        if(contributor && contributor.poolId!==input.poolId){
          return true;
        }
        return false;
      }),

    assignQuestion: publicProcedure
      .input(
        z.object({
          contrId: z.string(),
          catId: z.string(),
          questionsRemaining: z.number(),
          poolId: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
            const category = await ctx.prisma.category.findUnique({
              where:{
                id: input.catId
              }
            });

            const pool = await ctx.prisma.pool.findUnique({
              where: {
                id: input.poolId,
              }
            });

            const contributor = await ctx.prisma.contributors.findUnique({
              where:{
                id: input.contrId
              }
            });

            return await ctx.prisma.contributorAssignment.upsert({
              where:{
                contrId_catId :{
                  contrId : input.contrId,
                  catId: input.catId
                }
              },
              update:{
                questionsRemaining: input.questionsRemaining
              },
              create:{
                catId: input.catId,
                contrId: input.contrId,
                questionsRemaining: input.questionsRemaining
              }
            }).then((data)=>{
              if(pool && category && contributor){
                sendNotificationEmail({
                  url: `${auth.origin}`,
                  email: contributor.email,
                  pool : pool?.name,
                  category: category?.name,
                  numberOfQuestions: data.questionsRemaining
                })
              };

              return data;
          });
         
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
    
    getCategoryForAssignment: publicProcedure
    .input(
      z.object({
        contrID: z.string(),
      }))
      .query(async({ctx, input})=>{
        const categories = await ctx.prisma.category.findMany({
          select:{
              name:true,
              id:true,
              contributorAssignments:{
                where:{
                  contrId: input.contrID
                },
                select:{
                  questionsRemaining:true
                }
              }
            }
          
        });
        // console.log(input.contrID);
        
          return categories;
      })
    
});