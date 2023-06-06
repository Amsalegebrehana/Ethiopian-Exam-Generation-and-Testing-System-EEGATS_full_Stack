import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import https from 'https';
import fs from 'fs'
import bcrypt from "bcrypt";
import { parse } from 'csv-parse';
import { TRPCError } from "@trpc/server";

import { promisify } from "util";



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
        if (ctx.session.role === "admin"){
            return await ctx.prisma.examGroup.findMany({
            include:{
                _count:{
                    select:{
                        Exam:true
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
        }else{
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
                if (ctx.session.role === "admin"){

                    const examGroup = await getExamGroupById(ctx, input.id);
                    if(!examGroup){
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Exam group does not exist.",
                        });
                    }
                    return examGroup;
                }
                else{
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
                if(ctx.session.role === "admin"){
                    const examGroup = await getExamGroupById(ctx, input.id);

                    if(!examGroup){
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
                else{
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "UNAUTHORIZED ACCESS.",
                    });
                }
        }),

        deleteExamGroup : protectedProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                if(ctx.session.role === "admin"){
                    // call the get by id function
                    const examGroup = await getExamGroupById(ctx, input.id);
                    if(!examGroup){
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Exam group does not exist.",
                        });
                    }
                    if(!examGroup){
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
                else{
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
                spreadsheetId: z.string(),
              })
            )
            .mutation(async ({ ctx, input }) => {
              let finished = false;
              let requestSuccess = true;
          
              https.get(input.inputPath, async(response) => {
                response
                  .pipe(parse({ delimiter: ',', relax_quotes: true, from_line: 2 }))
                  .on('data', async (row) => {

                    const fullName = row[0].trim();
          
                    // Check if the fullName contains only letters
                    if (!/^[a-zA-Z]+$/.test(fullName)) {
                      finished = true;
                    }
          
                    // Check if the row[1] is not empty
                    if (!row[1] || row[1].trim() === '' || fullName === '') {
                      finished = true;
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
                    
          
                    if (!createTestTakers) {
                      finished = true;
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
                  .on('end', async() => {
                    // write on the doc
                    
                    finished = true;
              
                  });
              })

              return finished && requestSuccess;
        
              

            })
          ,
        // search test takers count
        getTestTakersCount: protectedProcedure

            .input(
                z.object({
                    search:z.string().optional(),
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                if(ctx.session.role === "admin"){
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
                else{
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
                    search:z.string().optional(),
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {

                if(ctx.session.role === "admin"){
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
                    });
                }
                else{
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "UNAUTHORIZED ACCESS.",
                    });
                }
            }),
            });
        