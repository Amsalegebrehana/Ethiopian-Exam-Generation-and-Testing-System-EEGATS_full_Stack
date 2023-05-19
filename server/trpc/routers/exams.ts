import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { addMinutes } from "date-fns";

// import isOverlapping  from 'date-fns';
import { areIntervalsOverlapping } from 'date-fns'
import { TRPCError } from "@trpc/server";
import { da } from "date-fns/locale";

export const examRouter = router({

    getExamsCount: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.exam.count();
    }),
    getExamIntervals: publicProcedure 
        .input(
            z.object({
                examGroupId: z.string()
            })
        )
        .query(async ({ ctx , input}) => {
             // get all exams with the same exam group id, pool id 
             const exams = await ctx.prisma.exam.findMany({
                select:{
                    testingDate: true,
                    duration: true,
                    
                },
                where: {
                    examGroup: {
                        id: input.examGroupId,
                    },
                },
            });
            
            //  exams start is testing date and end date is testing date + duration

            const examsDateIntervals = exams.map((exam) => {
                return {
                    start: exam.testingDate,
                    end: new Date(exam.testingDate.getTime() + exam.duration * 60000),
                };
            });
            return examsDateIntervals;
        }),
    getExams: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.exam.findMany({
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
        // create exam
    createExam: publicProcedure
        .input(
            z.object({
                name: z.string(),
                examGroupId: z.string(),
                poolId: z.string(),
                numberOfQuestions: z.number(),
                testingDate: z.date(),
                duration: z.number(),
                categories: z.array(z.object({
                    selectedId: z.string(),
                    numberOfQuestionPerCategory: z.number(),
                })),
            })
        )
        .mutation(async ({ ctx, input }) => {
           
            // get all exams with the same exam group id, pool id 
            const previousExams = await ctx.prisma.exam.findMany({
                select:{
                    testingDate: true,
                    duration: true,
                    
                },
                where: {
                    examGroup: {
                        id: input.examGroupId,
                    },
                },
            });
         
            // previous exams start is testing date and end date is testing date + duration

            const previousExamsDateIntervals = previousExams.map((preExam) => {
                return {
                    start: preExam.testingDate,
                    end: new Date(preExam.testingDate.getTime() + preExam.duration * 60000),
                };
            });
            
            // check if the new exam testing date overlaps with any of the previous exams
            const isTestingDateInInterval = previousExamsDateIntervals.some((interval) =>
                
                areIntervalsOverlapping(
                        {
                            start: new Date (input.testingDate), 
                            end: new Date ( input.testingDate.getTime() + input.duration * 60000)
                        },

                        {
                            start: new Date(interval.start), 
                            end: new Date (interval.end)
                        }
                    )
            );
    
            // check if the new exam testing date + duration is in the interval of any previous exams
            if (isTestingDateInInterval) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:"The time slot you picked has another exam scheduled please try to pick another time."
                });
            }

           else {  
                // create exam
                const newExam = await ctx.prisma.exam.create({
                    data: {
                        name: input.name,
                        examGroupId: input.examGroupId,
                        poolId: input.poolId,
                        numberOfQuestions: input.numberOfQuestions,
                        testingDate: input.testingDate,
                        duration: input.duration,
                        status: "generated",
                    },
                });
                // categories for exam
                // filter aproved questions by category id
            
                input.categories.forEach(async (category) => {
                
                    const approvedQuestions = await ctx.prisma.questions.findMany({  
                        where: {
                            
                            catId: category.selectedId,
                            status: "approved",
                        },
                    });
               

                // pick random based on the number of questions
                
                const randomApprovedQuestions = [];
                // shuffle the array
                for (let i = approvedQuestions.length - 1; i > 0; i--) {

                    const j = Math.floor(Math.random() * (i + 1));
                    [approvedQuestions[i], approvedQuestions[j]] = [approvedQuestions[j], approvedQuestions[i]];
                  };

                // take the first category.inputValue elements from the shuffled array
                randomApprovedQuestions.push(...approvedQuestions.slice(0, category.numberOfQuestionPerCategory));

                // iterate the randomly picked questions then assign the exam id to each question
                randomApprovedQuestions.forEach(async (question) => {
                  
                    question.examId = newExam.id;
               
                    question.status = "selected";
                   
                    // then update the question table
                    await ctx.prisma.questions.update({
                        where: {
                            id: question.id,
                        },
                        data: {
                            examId: question.examId,
                            status: question.status
                        },
                    });
                });

                }
            );
            
            return newExam;
        }
       
        
        }),

        // get exam by id
        getExam: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,
           
                    },
                    include: {
                        examGroup: {
                            select:{
                                name: true
                            },
                        },
                        pool:{
                            select:{
                                name: true
                            },
                        },

                    }
                });
            }),
            // get all exams by exam group id
        getExamsByExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        examGroup: {
                            id: input.id,
                        },
                    },
                });
            }),
            // get all exams by pool id
        getExamsByPool: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        pool: {
                            id: input.id,
                        },
                    },
                });
            }),
            publishExam: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                
                })
            )
            .mutation(async ({ ctx, input }) => {
                const exam = await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,

                    },
                });
                if (!exam) {
                    throw new Error(`Exam with id ${input.id} not found`);
                }
                if (exam.testingDate <= new Date()) {
                    throw new Error('Testing date has already passed');
                }
                // change status if testing date is greater than today
                return await ctx.prisma.exam.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        status: "published",
                    },
                });
            }
            ),
            // unpublish exam
            unPublishExam: publicProcedure
            .input(
                z.object({
                    id: z.string(),

                })
            )
            .mutation(async ({ ctx, input }) => {
                const exam = await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,
                    },
                });
                if (!exam) {
                    throw new Error(`Exam with id ${input.id} not found`);
                }
                if (exam.testingDate <= new Date()) {
                    throw new Error('Testing date has already passed');
                }
                // change status if testing date is greater than today
                return await ctx.prisma.exam.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        status: "generated",
                    },
                });
            }
            ),

            // release exam
            releaseExam: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {

                const exam = await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,
                    },
                });

                if (!exam) {
                    throw new Error(`Exam with id ${input.id} not found`);
                }
                // check if testing are already taken or not
                const twoDaysLater = new Date(exam.testingDate.getTime() + 2 * 24 * 60 * 60 * 1000);

                if (new Date()  < twoDaysLater) {
                    throw new Error('Testing date has not yet passed');
                }
                // change status if testing date is greater than today
                return await ctx.prisma.exam.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        status: "gradeReleased",
                    },
                });
            }
            ),
         
});