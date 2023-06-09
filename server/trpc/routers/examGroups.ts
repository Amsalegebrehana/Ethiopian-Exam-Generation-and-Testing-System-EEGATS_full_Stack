import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import https from 'https';
import fs from 'fs'
import bcrypt from "bcrypt";
import { parse } from 'csv-parse';
import { TRPCError } from "@trpc/server";
import pkg from 'pg';
import { error } from "console";
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB2_USER,
    host: process.env.DB2_HOST,
    database: process.env.DB2_DATABASE,
    password: process.env.DB2_PASSWORD,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})



import { promisify } from "util";
import { createObjectCsvStringifier } from "csv-writer";



// reuseble get exam group by Id here

const getExamGroupById = async (ctx: { session: { role: string; }; prisma: { examGroup: { findUnique: (arg0: { where: { id: any; }; }) => any; }; }; }, id: any) => {
    //  retrieve the exam group by ID
    if (ctx.session.role === "admin") {
        const data = await ctx.prisma.examGroup.findUnique({
            where: {
                id: id,
            },
        });
        return data;
    } else {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED ACCESS.",
        });
    }
}

export const examGroupRouter = router({
    getExamGroupCount: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.examGroup.count();
    }),
    getExamGroups: protectedProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                return await ctx.prisma.examGroup.findMany({
                    include: {
                        _count: {
                            select: {
                                Exam: true
                            }
                        }
                    },
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
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }

        }),

    addExamGroup: protectedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                const data = await ctx.prisma.examGroup.create({
                    data: {
                        name: input.name,
                    },
                });
                return data;
            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),
    // all the exam groups
    getAllExamGroup: protectedProcedure
        .input(
            z.object({
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                return await ctx.prisma.examGroup.findMany({
                    where: {
                        name: {
                            contains: input.search,
                        },
                        isPractice: false
                    },
                });
            }
            else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

    getExamGroup: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {

                const examGroup = await getExamGroupById(ctx, input.id);

                if (!examGroup) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Exam group does not exist.",
                    });
                }
                return examGroup;



            } else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

    updateExamGroup: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                const examGroup = await getExamGroupById(ctx, input.id);

                if (!examGroup) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Exam group does not exist.",
                    });
                }

                const data = await ctx.prisma.examGroup.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                    },
                });
                return data;
            }
            else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

    deleteExamGroup: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                // call the get by id function
                const examGroup = await getExamGroupById(ctx, input.id);
                if (!examGroup) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Exam group does not exist.",
                    });
                }
                if (!examGroup) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Exam group does not exist.",
                    });
                }
                const data = await ctx.prisma.examGroup.delete({
                    where: {
                        id: input.id,
                    },
                });
                return data;
            }
            else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

    generateCredentials: publicProcedure
        .input(
            z.object({
                inputPath: z.string(),
                examGroupId: z.string(),

            })
        )
        .mutation(async ({ ctx, input }) => {

            let requestSuccess = true;
      

            https.get(input.inputPath, async (response) => {
                response
                    .pipe(parse({ delimiter: ',', relax_quotes: true, from_line: 2 }))
                    .on('data', async (row) => {

                    

                        const fullName = row[0].trim();

                        // Check if the fullName contains only letters
                        if (!/^[a-zA-Z\s]+$/.test(fullName)) {

                            return
                        }

                        // Check if the row[1] is not empty
                        if (!row[1] || row[1].trim() === '' || fullName === '') {

                            return
                        }

                        const password = row[1] + String(Math.ceil(Math.random() * 10 ** 4)).padStart(4, '0');
                        row.push(password);
                  

                        const hashedPassword = await bcrypt.hash(password, 10); 
           
                        // create test taker

                        const createTestTakers = await ctx.prisma.testTakers.create({
                            data: {
                                name: row[0], 
                                username: row[1], 
                                password: hashedPassword, 
                                examGroupId: input.examGroupId, 
                            },
                        });
                       
                        const tempTestTakers = await ctx.prisma.temporaryTestTakers.create({
                            data: {
                                name: row[0],
                                username: row[1],
                                password: password,
                                examGroupId: input.examGroupId,
                            },
                        });
                  

                        if (!createTestTakers) {

                            requestSuccess = false;

                            throw new TRPCError({
                                code: 'BAD_REQUEST',
                                message: 'Check your file format.',
                            });
                        }


                    })
                    .on('error', (error) => {

                        // handle error while reading
                        requestSuccess = false;
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Check your file format.',
                        });
                    })

            });
                
            return requestSuccess;
        })
    ,
    // search test takers count
    getTestTakersCount: protectedProcedure

        .input(
            z.object({
                search: z.string().optional(),
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (ctx.session.role === "admin") {
                return await ctx.prisma.testTakers.count({
                    where: {
                        name: {
                            contains: input.search,
                        },
                        examGroup: {
                            id: input.id,
                        },
                    },
                });
            }
            else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),

    getExamGroupTestTakers: protectedProcedure
        .input(
            z.object({
                skip: z.number().optional(),
                search: z.string().optional(),
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {

            if (ctx.session.role === "admin") {
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
                        examGroup: {
                            id: input.id,
                        },
                    },
                },
                );
            }
            else {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "UNAUTHORIZED ACCESS.",
                });
            }
        }),
    getExamGroupPractice: protectedProcedure
        .input(
            z.object({
                examGroupId: z.string(),
            })
        ).query(async ({ ctx, input }) => {
            const examGroup = await ctx.prisma.examGroup.findUnique({
                where: {
                    id: input.examGroupId,
                },
                include: {
                    Exam: {
                    }
                }
            });

            if (!examGroup) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'NOT_FOUND',
                })
            }

            if (examGroup.isPractice) {
                return "practice";
            } else {

                var allReleased = true;

                for (const exam of examGroup.Exam) {
                    if (exam.status !== 'gradeReleased') {
                        allReleased = false;
                        break;
                    }
                }

                return allReleased ? "release" : "cantRelease";
            }

        }),

    publishPractice: protectedProcedure
        .input(
            z.object({
                examGroupId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.role === 'admin') {
                const examGroup = await ctx.prisma.examGroup.findUnique({
                    where: {
                        id: input.examGroupId,
                    },
                    include: {
                        Exam: {
                            where: {
                                status: 'gradeReleased'
                            },
                            include: {
                                Questions: {
                                    select: {
                                        id: true,
                                        title: true,
                                        image: true,
                                        choices: true,
                                        QuestionAnswer: {
                                            select: {
                                                id: true,
                                                questionId: true,
                                                choiceId: true,
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                })
                if (examGroup) {

                    try {
                        const client = await pool.connect()

                        await client.query('INSERT INTO "ExamGroup" ("id", "name") VALUES ($1, $2)', [examGroup.id, examGroup.name]);


                        for (const exam of examGroup.Exam) {

                            // Insert exam
                            await client.query('INSERT INTO "Exam" ("id", "name", "numberOfQuestions", "duration", "examGroupId") VALUES ($1, $2, $3, $4, $5)', [exam.id, exam.name, exam.numberOfQuestions, exam.duration, exam.examGroupId]);

                            for (const question of exam.Questions) {

                                // Insert question
                                await client.query('INSERT INTO "Questions" ("id", "title", "image", "examId") VALUES ($1, $2, $3, $4)', [question.id, question.title, question.image, exam.id]);

                                for (const choice of question.choices) {
                                    // Insert choice
                                    await client.query('INSERT INTO "Choice" ("id", "title", "image", "questionId") VALUES ($1, $2, $3, $4)', [choice.id, choice.title, choice.image, question.id]);
                                }
                                if(question.QuestionAnswer){
                                    // Insert question answer
                                    await client.query('INSERT INTO "QuestionAnswer" ("id", "questionId", "choiceId") VALUES ($1, $2, $3)', [question.QuestionAnswer.id, question.QuestionAnswer.questionId, question.QuestionAnswer.choiceId]);
                                }
                            }
                        }

                        await ctx.prisma.examGroup.update({
                            where: {
                                id: input.examGroupId,
                            }
                            ,
                            data: {
                                isPractice: true
                            }
                        });

                        return true;

                    } catch (error) {
                        console.log("error", error)
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'INTERNAL_SERVER_ERROR',
                        })
                    }



                }
            } else {

                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
                })
            }


        }),



    exportTestTakers: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            // Filter test takers by exam group id
            const testTakers = await ctx.prisma.temporaryTestTakers.findMany({
                where: {
                    examGroupId: input.id,
                },
            });

            // Create CSV stringifier
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'name', title: 'Name' },
                    { id: 'username', title: 'Admission Number' },
                    { id: 'password', title: 'Password' },
                ],
            });

            // Convert test takers to CSV data
            const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(testTakers);

            return csvData;
        }),

});

