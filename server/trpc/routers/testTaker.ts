import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import shuffleSeed from 'shuffle-seed';
import { TRPCError } from "@trpc/server";

export const testTakerRouter = router({
  getTestTakersCount: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.role === 'admin') {
      return await ctx.prisma.testTakers.count();
    } else {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS.',
      })
    }
  }),
  getTestTakers: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
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
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }
    }),

  getTestTakerId: publicProcedure
    .input(z.object({
      username: z.string()
    })).query(async ({ ctx, input }) => {
      const data = await ctx.prisma.testTakers.findUnique({
        where: {
          username: input.username,
        }
      });
      return data?.id;

    }),
  getExamsCount: protectedProcedure
    .input(z.object({
      testTakerId: z.string(),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testTaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId,
          }
        });
        const data = await ctx.prisma.exam.findMany({
          where: {
            examGroup: {
              id: testTaker?.examGroupId
            },
            status: {
              not: 'generated'
            }
          },
          select: {
            _count: true
          },
        });
        return data.length;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }

    }),
  getExams: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string().optional(),
        testTakerId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testTaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId,
          }
        });
        const data = await ctx.prisma.exam.findMany({
          skip: input.skip,
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            name: {
              contains: input.search,
            },
            examGroup: {
              id: testTaker?.examGroupId
            },
            status: {
              not: 'generated'
            }
          },
          include: {
            TestSession: {
              where:
              {
                testTakerId: input.testTakerId,

              },

            }
          }

        });
        return data;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }

    }),
  getExamDetails: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string()
    })).query(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const data = await ctx.prisma.exam.findUnique({
            where: {
              id: input.examId,
            },
            include: {
              TestSession: {
                where:
                {
                  testTakerId: input.testTakerId,

                },
              },
            }
          }).then((data) => {
            if (data) {

              const currentDateTime = new Date();
              const globalTimeInSeconds: number = (data.duration * 60) - Math.floor((currentDateTime.valueOf() - data.testingDate.valueOf()) / 1000);

              const res = {
                ...data,
                globalTime: globalTimeInSeconds,
              };
              return res;

            }
            else {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'NOT_FOUND.',
              })
            }
          });
          return data;
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }

    }),


  getExamQuestions: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string(),
      currentIndex: z.number()
    })).query(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const data = await ctx.prisma.questions.findMany({
            where: {
              examId: input.examId,
            },
            select: {
              id: true,
              title: true,
              image: true,
              choices: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                }
              },
              TestTakerResponse: {
                where: {
                  testTakerId: input.testTakerId,
                  examId: input.examId,
                },
                select: {
                  choiceId: true,
                }
              }
            },
          }

          ).then((data) => {
            return data.map((item) => {
              return {
                ...item,
                choices: shuffleSeed.shuffle(item.choices, input.testTakerId),
                selectedAnswer: item.TestTakerResponse.length > 0 ? item.TestTakerResponse[0].choiceId : '',
                changed: false
              }
            })
          });
          const allQuestions = shuffleSeed.shuffle(data, input.testTakerId);
          return allQuestions[input.currentIndex];

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }

    }),

  getExamChecklist: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string(),
    })).query(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const data = await ctx.prisma.questions.findMany({
            where: {
              examId: input.examId,
            },
            select: {
              id: true,
              TestTakerResponse: {
                where: {
                  testTakerId: input.testTakerId,
                  examId: input.examId,
                },
                select: {
                  choiceId: true,
                }
              }
            },
          }

          ).then((data) => {
            return data.map((item) => {
              return {
                ...item,
                selectedAnswer: item.TestTakerResponse.length > 0 ? item.TestTakerResponse[0].choiceId : '',
              }
            })
          });
          return shuffleSeed.shuffle(data, input.testTakerId);

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }


    }),

  createTestSession: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const exam = await ctx.prisma.exam.findUnique({
            where: {
              id: input.examId,
            }
          });
          if (exam) {

            if (Date.now() > exam?.testingDate.getDate() && Date.now() < exam?.testingDate.getDate() + exam?.duration * 60 * 1000) {
              const data = await ctx.prisma.testSession.create({
                data: {
                  examId: input.examId,
                  testTakerId: input.testTakerId,
                }
              });
              return data;
            }
          } else {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Exam not found`
          });
          }

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }

    }),
  getTestSession: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string()
    }))
    .query(async ({ ctx, input }) => {

      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const data = await ctx.prisma.testSession.findUnique({
            where: {
              testTakerId_examId: {
                testTakerId: input.testTakerId,
                examId: input.examId,
              }
            }
          });
          return data;

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }


      }else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }
    }),
  registerResponse: protectedProcedure
    .input(z.object({
      questionId: z.string(),
      testTakerId: z.string(),
      examId: z.string(),
      choiceId: z.string(),
      currentIndex: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          try {
            const correctAnswer = await ctx.prisma.questionAnswer.findUnique({
              where: {
                questionId: input.questionId,
              }
            });
            const data = await ctx.prisma.testTakerResponse.upsert({
              where: {
                testTakerId_examId_questionId: {
                  questionId: input.questionId,
                  testTakerId: input.testTakerId,
                  examId: input.examId,
                },
              },
              update: {
                choiceId: input.choiceId,
                isCorrect: correctAnswer?.choiceId === input.choiceId ? true : false,
              },
              create: {

                choiceId: input.choiceId,
                testTakerId: input.testTakerId,
                examId: input.examId,
                questionId: input.questionId,
                isCorrect: correctAnswer?.choiceId === input.choiceId ? true : false,
              },
            }).then(async (data) => {
              await ctx.prisma.testSession.update({
                where: {
                  testTakerId_examId: {
                    testTakerId: input.testTakerId,
                    examId: input.examId,
                  }
                },
                data: {
                  currentQuestion: input.currentIndex,
                }
              });
              return data;
            });
            if (data) {

              return true;
            } else {
              return false;
            }
          } catch (e) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Error in registering response',

            });
          }


          return true;

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }


      }else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }}),
  submitExam: protectedProcedure
    .input(z.object({
      examId: z.string(),
      testTakerId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.role === 'testtaker' && ctx.session.uid === input.testTakerId) {
        const testtaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId
          },
          select: {
            examGroup: {
              select: {
                Exam: {
                  where: {
                    id: input.examId
                  }
                }
              }
            }
          }
        }).then((testtaker) => {
          return testtaker?.examGroup.Exam.find((Exam) => Exam.id === input.examId) !== null
        });

        if (testtaker) {
          const correctcount = await ctx.prisma.testTakers.findFirst({
            where: {
              id: input.testTakerId,
            },
            select: {
              _count: {
                select: {
                  TestTakerResponse: {
                    where: {
                      isCorrect: true,
                      examId: input.examId,
                    }
                  }
                },
              },
            },
    
          });
    
    
          const data = await ctx.prisma.testSession.update({
            where: {
              testTakerId_examId: {
                examId: input.examId,
                testTakerId: input.testTakerId,
              },
            },
            data: {
              isSubmitted: true,
              grade: correctcount?._count.TestTakerResponse,
    
            },
          })
          return data;
    

        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
          })
        }


      }else{
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',
        })
      }


      
    }),

});