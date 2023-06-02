import { array, z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { sendStatusNotificationEmail, sendNewInvite, sendReturnEmail, sendNotificationEmail } from "~~/utils/mailer";
import { validateEmail } from "~~/utils/emailValidation";
import bcrypt from "bcrypt";
import { QuestionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const { auth } = useRuntimeConfig();

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
      if(ctx.session.role == 'contributor' || ctx.session.role == 'admin'){
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
            mode: 'insensitive'
          },
        },
      })} else{
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
      contributorId: z.string(),
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
          contributorId: input.contributorId,
          status: {
            equals: 'draft'
          },
          title: {
            contains: input.search,
            mode: 'insensitive'
          }, 
        },
      });

    return result;
    } else{
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }}),

  adminResetPassword: protectedProcedure.
    input(
      z.object({
        id: z.string(),
      })
    ).mutation(
      async ({ ctx, input }) => {
        if (ctx.session.role === 'admin') {
          const pwd = Math.random().toString(36).slice(-8);
          const hashed = await bcrypt.hash(pwd, 10)
          const data = await ctx.prisma.contributors.update({
            where: {
              id: input.id,
            },
            data: {
              password: hashed,
              failedAttempts: 0
            },
          });
          return pwd;
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }

      }
    ),

  getContributorQuestionCount: protectedProcedure
    .input(
      z.string()
    )
    .query(
      async ({ ctx, input }) => {
        if (ctx.session.role === 'admin') {
          const data = await ctx.prisma.questions.count({
            where: {
              contributorId: input,
            }
          });

          return data;
        }
        else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',

          });
        }

      }
    ),
  getReviewsMade: protectedProcedure
  .input(
    z.object({ 
      id: z.string(),
     
    })
  )
  .query(async ({ ctx, input }) => {
    if(ctx.session.role == 'contributor' || ctx.session.role == 'admin'){
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
    }}),

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

  disableContributor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const contributor = await ctx.prisma.contributors.findUnique({
          where: {
            id: input.id
          },
          include:{
            pool:true
          }
        });

        let status = '';
        if(contributor?.isActive === true){
          status = 'Inactive';
        }
        else{
          status = 'Active';
        }
        await ctx.prisma.contributors.update({
          where: {
            id: input.id,
          },
          data: {
            isActive: !contributor?.isActive
          },
          }).then((data) =>{
            if(contributor){
              sendStatusNotificationEmail({
                url: `${auth.origin}`,
                email: contributor.email,
                pool: contributor.pool.name,
                status: status
              })
            }
          });
        
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    }),

  getContributorId: protectedProcedure
    .input(z.object({
      email: z.string()
    })).query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const data = await ctx.prisma.contributors.findUnique({
          where: {
            email: input.email,
          }
        });
        return data?.id;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }


    }),
  inviteContributor: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        poolId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const emailCheck = validateEmail(input.email);
        if (emailCheck == true) {
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
  
          if (user && user.poolId !== input.poolId) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Already assigned',
              });
  
          }
  
          if (user?.poolId === input.poolId && user.isActive === true) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Already a member of this pool',
              });
          }
          if(pool){
            console.log(":wokfe")
            try{
              sendNewInvite({
                  url: `${auth.origin}/contributor/register?poolId=${input.poolId}`,
                  email: input.email,
                  pool: pool?.name,
              })
            }
            catch(err){
              console.log("Error: ", err);
            }
            
          }
          else{
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Pool not found',
              });
          }
          return true;
        }
        else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Email!',
            });
          }  
        }
        else{
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
  
          });
        }
        
    }),

  assignQuestion: protectedProcedure
    .input(
      z.object({
        contrId: z.string(),
        catId: z.string(),
        questionsRemaining: z.number(),
        poolId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const category = await ctx.prisma.category.findUnique({
          where: {
            id: input.catId
          }
        });

        const pool = await ctx.prisma.pool.findUnique({
          where: {
            id: input.poolId,
          }
        });

        const contributor = await ctx.prisma.contributors.findUnique({
          where: {
            id: input.contrId
          }
        });

        return await ctx.prisma.contributorAssignment.upsert({
          where: {
            contrId_catId: {
              contrId: input.contrId,
              catId: input.catId
            }
          },
          update: {
            questionsRemaining: input.questionsRemaining
          },
          create: {
            catId: input.catId,
            contrId: input.contrId,
            questionsRemaining: input.questionsRemaining
          }
        }).then((data) => {
          if (pool && category && contributor) {
            sendNotificationEmail({
              url: `${auth.origin}`,
              email: contributor.email,
              pool: pool?.name,
              category: category?.name,
              numberOfQuestions: data.questionsRemaining
            })
          };

          return data;
        });
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }


    }),

  registerContributor: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        email: z.string(),
        poolId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const email = await ctx.prisma.contributors.findUnique({
          where: {
            email: input.email
          }
        });
        if (email) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Exists',
  
          });;
        }
        else {
          const pwd = await bcrypt.hash(input.password, 10)
          const pool = await ctx.prisma.pool.findUnique({
            where: {
              id: input.poolId,
            }
          });
          if (pool !== null) {
            const res = ctx.prisma.contributors.create({
              data: {
                name: input.name,
                password: pwd,
                email: input.email,
                poolId: pool?.id,
              },
            });
            return res;
          }
          else {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Pool not found',
    
            });
          }
        }
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }


    }),

  getCategoryForAssignment: protectedProcedure
    .input(
      z.object({
        contrID: z.string(),
      }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const categories = await ctx.prisma.category.findMany({
          select: {
            name: true,
            id: true,
            contributorAssignments: {
              where: {
                contrId: input.contrID
              },
              select: {
                questionsRemaining: true
              }
            }
          }

        });

        return categories;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

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