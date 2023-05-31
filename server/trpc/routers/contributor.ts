import { array, z } from "zod";
import {  sendNewInvite, sendReturnEmail, sendNotificationEmail } from "~~/utils/mailer";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { validateEmail } from "~~/utils/emailValidation";
const { auth } = useRuntimeConfig();
import bcrypt from "bcrypt";
import { Prisma, QuestionStatus } from "@prisma/client";
import { category } from "./category";
import { throws } from "assert";
import { TRPCError } from "@trpc/server";
export const contributorRouter = router({

  
  getContributorQuestions: protectedProcedure
  .input(
    z.object({
      contrId: z.string(),
      skip: z.number()
    })
  )
  .query(
    async ({ctx, input}) => { 
      if(ctx.session.role == 'contributor'){
        const data = await ctx.prisma.questions.findMany({
          skip: input.skip,
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            contributorId: input.contrId,
            status: QuestionStatus.draft,
          }
        })
  
        return data;
      } else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS',
        })
      }
    }),

  getContributorDraftCount: protectedProcedure
  .input(
    z.string()
  )
  .query(
    async ({ctx, input}) => {
      if(ctx.session.role == 'contributor'){
        const data = await ctx.prisma.questions.count({
          where: {
            contributorId: input,
            status: QuestionStatus.draft
          }
        })
  
        return data;
      } else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS',
        })
      }
    }
  ),
  
  searchQuestionsCount: protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor'){
      return await ctx.prisma.questions.count({
        where: {
          title: {
            contains: input.search,
          },
        },
      })} else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS',
        })
      }
  }),

  searchQuestions: protectedProcedure
  .input(
    z.object({
      skip: z.number(),
      search: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor'){
      const result = await ctx.prisma.questions.findMany({
        skip: input.skip,
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          status: {
            equals: 'draft'
          },
          title: {
            contains: input.search?.toLowerCase(),
          },
        }
      })

      return result;
    } else{
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS',
      })
    }

  }),

  searchContributorQuestions: protectedProcedure
  .input(
   z.object({
      skip: z.number(),
      search: z.string().optional(), 
      contributorID: z.string(), 
    })
  )
  .query(
    async ({ctx, input}) => {
      if(ctx.session.role == 'contributor'){
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
      } else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS',
        })
      }
    }),
    
  getReviewsMade: protectedProcedure
  .input(
    z.object({ 
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor'){
      const data = await ctx.prisma.contributors.findUnique({
        where: {
          id: input.id,
        }
      }).then((data) => {
        return data?.reviewsMade;
      })
      return data;
    } else{
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS',
      })
    }

}),

  checkifAssigned : protectedProcedure
  .input(
   z.object({
     contrId: z.string(),
    
   })
 )
 .query(async ({ ctx, input }) => {
  if(ctx.session.role == 'contributor'){
    var count = 0;
    const assignments = await ctx.prisma.contributorAssignment.findMany({
      where: {
        contrId: input.contrId,
      }
    })
    assignments.forEach((item) => count += item.questionsRemaining);
    return count > 0;
  } else{
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'UNAUTHORIZED ACCESS',
    })
  }
 }),

  getAssignedCategories: protectedProcedure
   .input(
    z.object({
      contrId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor'){
      const contributor  =  await ctx.prisma.contributors.findUnique({
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
    } else{
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS',
      })
    }
  }),
 
  getQuestionsRemaining: protectedProcedure
  .input(
    z.object({
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor'){
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
    } else{
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS',
      })
    }
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
      }),

      getRemainingQuestionsByCategories: protectedProcedure
      .input(
        z.object({
          contrId: z.string(),
        }))
      .query(async({ctx, input})=>{
        if(ctx.session.role == 'contributor'){
          const assignments = await ctx.prisma.contributorAssignment.findMany({
            where: {
              contrId: input.contrId
            }
          });
          const categories = await Promise.all(assignments.map(async (assignment, index) => {
            const category = await ctx.prisma.category.findUniqueOrThrow({
              where: {
                id: assignment.catId,
              }
            })
            return {name: category.name, questionsRemaining: assignment.questionsRemaining}
          }))
  
          return categories.filter((cat) => cat != null);
        } else{
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS',
          })
        }
      }),

      getCountOfContributors: publicProcedure
      .query(async({ctx, input}) => {
          const count = ctx.prisma.contributors.findMany({});
          return (await count).length;
      })
    
});