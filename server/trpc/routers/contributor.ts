import { array, z } from "zod";
import { sendNewInvite, sendReturnEmail, sendNotificationEmail } from "~~/utils/mailer";
import { protectedProcedure, router } from "../trpc";
import { validateEmail } from "~~/utils/emailValidation";
const { auth } = useRuntimeConfig();
import bcrypt from "bcrypt";
import { QuestionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
export const contributorRouter = router({

  getContributorQuestions: protectedProcedure
    .input(
      z.string()
    )
    .query(
      async ({ ctx, input }) => {
        if (ctx.session.role === 'admin') {
          const data = await ctx.prisma.questions.findMany({
            where: {
              contributorId: input,
              status: QuestionStatus.draft,
            }
          })

          return data;
        }
        else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',

          });
        }

      }),

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
          })

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

  searchContributorQuestions: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
        contributorID: z.string(),
      })
    )
    .query(
      async ({ ctx, input }) => {
        if (ctx.session.role === 'admin') {

        }
        else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',

          });
        }
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

  getReviewsMade: protectedProcedure
    .input(
      z.object({
        id: z.string(),

      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const data = await ctx.prisma.contributors.findUnique({
          where: {
            id: input.id,
          }
        }).then((data) => {
          return data?.reviewsMade;
        })
        return data;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }


    }),

  checkifAssigned: protectedProcedure
    .input(
      z.object({
        contrId: z.string(),

      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const contributor = await ctx.prisma.contributors.findUnique({
          where: {
            id: input.contrId
          }
        })

        const data = await ctx.prisma.contributors.findMany({
          select: {
            _count: {
              select: {
                contributorAssignments: {
                  where: {
                    contrId: input.contrId,
                    category: {
                      poolId: contributor?.poolId
                    },
                    questionsRemaining: {
                      gt: 0
                    }
                  },
                },
              },
            },
          },
        }
        )
          .then(
            (data) => {
              var count = 0;
              data.forEach(element => {
                count += element._count.contributorAssignments
              });

              return count > 0
            }

          )
        return data;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
    }),

  getAssignedCategories: protectedProcedure
    .input(
      z.object({
        contrId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const contributor = await ctx.prisma.contributors.findUnique({
          where: {
            id: input.contrId
          }
        })
        const data = await ctx.prisma.category.findMany({
          where: {
            contributorAssignments: {

              some: {
                contrId: input.contrId,
                category: {
                  poolId: contributor?.poolId
                },
                questionsRemaining: {
                  gt: 0
                }
              }

            }
          },


        });
        return data;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    }),

  getQuestionsRemaining: protectedProcedure
    .input(
      z.object({
        id: z.string(),

      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        await ctx.prisma.contributorAssignment.findMany({
          where: {
            contrId: input.id
          }
        }).then(async (data: { catId: any; questionsRemaining: any; }[]) => {
          let results: any[] = [];
          data.forEach(async (relation: { catId: any; questionsRemaining: any; }) => {
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
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
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
          }
        });

        const data = await ctx.prisma.contributors.update({
          where: {
            id: input.id,
          },
          data: {
            isActive: !contributor?.isActive
          },
        });
        return data;
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
        if (emailCheck == false) {
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

        if (user && user.poolId !== input.poolId) {
          return "Already assigned";
        }

        if (user?.poolId === input.poolId && user.isActive === true) {
          return 'Already a member of this pool'
        }

        if (user) {
          await ctx.prisma.contributors.update({
            where: {
              email: input.email,
            },
            data: {
              isActive: true,
            }
          }).then((data) => {
            if (pool) {
              sendReturnEmail({
                url: `${auth.origin}`,
                email: input.email,
                pool: pool?.name,
              });
            }
          });
        } else {
          if (pool) {
            sendNewInvite({
              url: `${auth.origin}/contributor/register?poolId=${input.poolId}`,
              email: input.email,
              pool: pool?.name,
            });
          }
        }
        return true;
      }
      else {
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
          return "Exists";
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
            return "Pool not found";
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
        // console.log(input.contrID);

        return categories;
      }
      else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    })

});