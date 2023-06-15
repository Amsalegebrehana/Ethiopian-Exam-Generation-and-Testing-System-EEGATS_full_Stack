import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { addMinutes, isAfter } from "date-fns";

// import isOverlapping  from 'date-fns';
import { areIntervalsOverlapping } from 'date-fns'
import { TRPCError } from "@trpc/server";
import { PDFDocument, PDFPage, StandardFonts } from 'pdf-lib';


// reuseble get exam group by Id here

const getExamById = async (
    ctx: { 
        session: { role: string; }; 
        prisma: { 
            exam: { 
                findUnique: (arg0: 
                    { 
                        where: { id: any; }; }) => any; 
                    }; 
                }; 
            },
                         id: any) => {
    //  retrieve the exam  by ID
    if (ctx.session.role === "admin") {
      const exam = await ctx.prisma.exam.findUnique({
        where: {
          id: id,
        },
      });
      return exam;
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "UNAUTHORIZED ACCESS.",
      });
    }
  }
       

//   DRY testing date overlaps check function for create and update exam
const checkIntervalsOverlap = async(
    ctx: { prisma: { exam: { findMany: (arg0: { select: { testingDate: boolean; duration: boolean }; where: { examGroup: { id: any }; NOT?: { id: any } } }) => any } } },
    input: { [x: string]: any; examGroupId: any; testingDate: Date; duration: number },
   flag: boolean)=>{
    
       // get all exams with the same exam group id, pool id 
        //    if flag true input will have id so find many except for the current exam with the input id 
        let previousExams = [];
        if (flag && input.id){
            // return all exams except with out the current input.id
            previousExams = await ctx.prisma.exam.findMany({
                select:{
                    testingDate: true,
                    duration: true,
                    
                },
                where: {
                    examGroup: {
                        id: input.examGroupId,
                    },
                    NOT: {
                        id: { equals: input.id },
                      },
                      
                }, 
            })
        } else {

            previousExams = await ctx.prisma.exam.findMany({
                select:{
                    testingDate: true,
                    duration: true,
                    
                },
                where: {
                    examGroup: {
                        id: input.examGroupId,
                    },
                },
                
            })
        }

    // exams start is testing date and end date is testing date + duration simplified  object
    const previousExamsDateIntervals = previousExams.map((preExam: { testingDate: { getTime: () => number; }; duration: number; }) => {
        return {
            start: preExam.testingDate,
            end: new Date(preExam.testingDate.getTime() + preExam.duration * 60000),
        };
    });
    
    // check if the new exam testing date overlaps with any of the previous exams
    const isTestingDateInInterval = previousExamsDateIntervals.some((interval: { start: string | number | Date; end: string | number | Date; }) =>
        
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

    return isTestingDateInInterval;
}
// Exam  router starts here
export const examRouter = router({

    getExamsCount: protectedProcedure
        .query(async ({ ctx }) => {
            if (ctx.session.role === "admin") {

                return await ctx.prisma.exam.count();

            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
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

        // search exams count
     searchExamsCount: protectedProcedure
        .input(
            z.object({
                search: z.string().optional(),
                 // optional exam group id
                 examGroupId: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                return await ctx.prisma.exam.count({
                    where: {
                        name: {
                            contains: input.search,
                            mode: 'insensitive'
                        },
                        examGroupId: input.examGroupId,
                    },
                });
            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),
        //  exams searched
        getSearchedExams : protectedProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
                // optional exam group id
                examGroupId: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                // if exam group id is provided
                if(input.examGroupId){
                    return await ctx.prisma.exam.findMany({
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
                            examGroupId: input.examGroupId,
                        },
                    });
                }
                else{

                    return await ctx.prisma.exam.findMany({
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
                    });
                }
            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

        // get exams

    getExams: protectedProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                
                return await ctx.prisma.exam.findMany({
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
                });
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
            
                });
            }

        }),
        // create exam
    createExam: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(255),
                examGroupId: z.string(),
                poolId: z.string(),
                numberOfQuestions: z.number(),
                testingDate: z.date(),
                duration: z.number(),
                examReleaseDate: z.date(),
                gradePassPoint: z.number(),
                categories: z.array(z.object({
                    selectedId: z.string(),
                    numberOfQuestionPerCategory: z.number(),
                })),
            })
        )
        .mutation(async ({ ctx, input }) => {
           
            if (ctx.session.role === "admin") {
            // error handle
                if(!input.name || !input.examGroupId || !input.poolId || !input.numberOfQuestions || !input.testingDate || !input.examReleaseDate || !input.duration || !input.categories){
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:"Please fill all the required fields."
                    });
                }
                
                // check if the new exam testing date overlaps with any of the previous exams
                const isTestingDateInInterval = await checkIntervalsOverlap(ctx, input, false);
        
                // check if the new exam testing date + duration is in the interval of any previous exams
                if ( isTestingDateInInterval) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:"The time slot you picked has another exam scheduled please try to pick another time."
                    });
                }
                // check if the  exam release date is after the testing date
                if(input.examReleaseDate < input.testingDate){

                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:"The exam release date should be after the testing date."
                    });
                }
                // check if gradePassPoint is less than the number of questions
                if(input.gradePassPoint > input.numberOfQuestions && input.numberOfQuestions < 0){
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:"The grade pass point should be less than the number of questions or greater than 0."
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
                                gradePassPoint: input.gradePassPoint,
                                examReleaseDate: input.examReleaseDate,
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
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }
        
        }),

        // get exam by id
        getExam: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                if (ctx.session.role === "admin") {
                return await ctx.prisma.exam.findUnique({
                    where: {
                        id: input.id,
           
                    },
                    include: {
                        examGroup: {
                            select:{
                                name: true,
                                id:true
                            },
                        },
                        pool:{
                            select:{
                                name: true,
                                id:true
                            },
                        },

                    }
                });
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }
            }),
        // get exams count by exam group id
        getExamsCountInExamGroup: protectedProcedure
        .input(
            z.object({
                examGroupId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {

                return await ctx.prisma.exam.count({
                    where: {
                        examGroupId: input.examGroupId,
                    },
                });

            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),
            // get all exams by exam group id
        getExamsByExamGroup: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                if (ctx.session.role === "admin") {
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
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }
            }),
            // get all exams by pool id
        getExamsByPool: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                    skip: z.number(),
                })
            )
            .query(async ({ ctx, input }) => {
                if (ctx.session.role === "admin") {
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
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }
            }),
        // update exam
        updateExam: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                    testingDate: z.date(),
                    duration: z.number(),
                    examReleaseDate: z.date(),
                    examGroupId: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                if (ctx.session.role === "admin") {
                    // get exam by id
                    const exam = await getExamById(ctx, input.id);
                    // check if exam exists
                    if (!exam) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Exam with id ${input.id} not found`
                        });
                    }
                    // check if the new exam testing date overlaps with any of the previous exams
                     
                    const isTestingDateInInterval = await checkIntervalsOverlap(ctx, input, true);
                
                        // check if the new exam testing date + duration is in the interval of any previous exams
                        if ( isTestingDateInInterval) {
                            throw new TRPCError({
                                code: "BAD_REQUEST",
                                message:"The time slot you picked has another exam scheduled please try to pick another time."
                            });
                        }
                        // check if the  exam release date is after the testing date
                        if(input.examReleaseDate < input.testingDate){

                            throw new TRPCError({
                                code: "BAD_REQUEST",
                                message:"The exam release date should be after the testing date."
                            });
                        }
                    // check if the new exam testing date is after the exam release date
                    if(input.examReleaseDate < input.testingDate){
                           throw new TRPCError({
                            code: "BAD_REQUEST",
                            message:"The exam release date should be after the testing date."
                           });
                    }
                    // update exam
                    return await ctx.prisma.exam.update({
                        where: {
                            id: input.id,
                        },
                        data: {
                            testingDate: input.testingDate,
                            duration: input.duration,
                            examReleaseDate: input.examReleaseDate,
                        },
                    });
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                });
            }
        }),

        // publish exam
        publishExam: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                
                })
            )
            .mutation(async ({ ctx, input }) => {
                if(ctx.session.role === 'admin'){
                    // get exam by id
                    const exam = await getExamById(ctx, input.id);
                    // check if exam exists
                    if (!exam) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Exam with id ${input.id} not found`
                        });
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
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })

            }
            }
            ),
            // unpublish exam
            unPublishExam: protectedProcedure
            .input(
                z.object({
                    id: z.string(),

                })
            )
            .mutation(async ({ ctx, input }) => {
                if (ctx.session.role === "admin") {

                        const exam = await getExamById(ctx, input.id);
                    if (!exam) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Exam with id ${input.id} not found`
                        });
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
            } else {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }
            }
            ),
            
            // export exam to pdf with questions and answers
            exportExamToPdf: protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {

                if(ctx.session.role === 'admin'){

                    // get exam by id and include the questions and answers
                    const exam = await ctx.prisma.exam.findUnique({
                        where: {
                            id: input.id,
                        },
                        include: {
                            Questions: {
                                include: {
                                    choices: true,
                                    QuestionAnswer: {
                                        select: {
                                            choiceId : true,
                                            // then include the choice title
                                            choice: {
                                                select: {
                                                    title: true,
                                                },
                                            },
                                        }
                                    }
                                },
                            },
                        },
                    });
                    if (!exam) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Exam with id ${input.id} not found`
                        });
                    }
                    if(exam.status !== "gradeReleased"){
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: `Exam grade is not yet Released.`
                        });
                    }
                    // add content to the pdf document
                    const addContentToPage = (page: PDFPage, content: any[]) => {
                        const { width, height } = page.getSize();
                        const fontSize = 12;
                    
                        let yOffset = height - 50;
                    
                        content.forEach((line) => {
                        page.drawText(line, {
                            x: 50,
                            y: yOffset,
                            font,
                            size: fontSize,
                        });
                        yOffset -= 20;
                        });
                    
                        return page;
                    };
                    
                    // create a new pdf document
                    const pdfDoc = await PDFDocument.create();
                    let currentPage = pdfDoc.addPage();
                    
                    // Set the font used for the document
                    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                    
                    // Initialize an array to store the content lines
                    let contentLines: any[] = [];
                    
                    // Add the exam ID to the content lines
                    // make the name bold by adding <b> tag
                    
                    contentLines.push(`Exam Name: ${exam.name}`);
                    
                    // iterate the questions, the choices, and the answers
                    exam.Questions.forEach((question, index) => {
                        contentLines.push(`Question ${index + 1}: ${question.title}`);
                    
                        question.choices.forEach((choice, choiceIndex) => {
                        contentLines.push(` ${choiceIndex + 1}: ${choice.title}`);
                        });
                    
                        contentLines.push(`Answer: ${question.QuestionAnswer?.choice.title}`);
                    
                        // Check if the current page is filled
                        if (contentLines.length >= 50) {
                            currentPage = addContentToPage(currentPage, contentLines);
                            contentLines = [];
                        
                            // Add a new page
                            currentPage = pdfDoc.addPage();
                        }
                    });
                    
                    // Add remaining content to the final page
                    if (contentLines.length > 0) {
                        currentPage = addContentToPage(currentPage, contentLines);
                    }
                    
                    // save the pdf document
                    const pdfBytes = await pdfDoc.save();
                    
                    return pdfBytes;
  

                }else{
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "UNAUTHORIZED ACCESS.",
                }
                )}
            }),

});

