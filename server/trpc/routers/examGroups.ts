import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import https from 'https';
import fs from 'fs'
import bcrypt from "bcrypt";
import { parse } from 'csv-parse';

export const examGroupRouter = router({
    getExamGroupCount: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.examGroup.count();
    }),
    getExamGroups: publicProcedure
      .input(
        z.object({
          skip: z.number(),
          search: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
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
            },
          },
        });
      }),

      addExamGroup: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.prisma.examGroup.create({
                data: {
                    name: input.name,
                },
            });
            return data;
        }),

        getExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.findUnique({
                    where: {
                        id: input.id,
                    },
                });
                return data;
        }),

        updateExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    name: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                    },
                });
                return data;
        }),

        deleteExamGroup: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const data = await ctx.prisma.examGroup.delete({
                    where: {
                        id: input.id,
                    },
                });
                return data;
            }),

        generateCredentials : publicProcedure
        .input(
            z.object({
                inputPath: z.string(),
                examGroupId: z.string(),
            })
        )
        .mutation( async ({ ctx, input }) => {
            let finished = false;
            const inputfilename = input.inputPath.split('/');
      
            const outputFilePath ="./" + inputfilename[inputfilename.length-1].slice(0,inputfilename[inputfilename.length-1].length - 4)  +"new.csv";

            const writableStream = fs.createWriteStream(outputFilePath);
            // create a readable stream
          
            https.get(input.inputPath, (response) => {
                response.pipe(parse({ delimiter: ',',relax_quotes: true, from_line: 2 }))
                .on('data', async (row) => {
                    const password = row[1] + String(Math.ceil(Math.random() * 10 ** 4)).padStart(4, '0');
                    row.push(password);
                    // write the row to the output file
                    writableStream.write(row.join(',') + '\n');
                    
                    const hashedPassword =await bcrypt.hash(password, 10);

                    await ctx.prisma.testTakers.create({
                        data: {
                            name: row[0],
                            username: row[1],
                            password: hashedPassword,
                            examGroupId : input.examGroupId
                        }  
                    });  
                })
                .on('error', (error) => {
                    console.log(error.message);
                })
                .on('end', () => {
                
                    // close the writable stream when done
                    writableStream.end();
                    finished = true;
                   
                });
            }).on('error', (error) => {
                console.log(error.message);
            });
            while (!finished) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return finished;
           
        }), 
        getExamGroupTestTakers: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.testTakers.findMany({
                    where: {
                        examGroup: {
                            id: input.id,
                        },
                    },
                });
            }),
            });
        