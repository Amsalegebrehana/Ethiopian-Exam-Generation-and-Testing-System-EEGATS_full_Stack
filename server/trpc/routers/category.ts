import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const category = router({
    getCategoryCount: protectedProcedure
        .input(
            z.object({
             poolId: z.string(),
            })
          )
          .query(async ({ ctx , input}) => {
            if (ctx.session.role === 'admin') {
                return await ctx.prisma.category.count({
                    where: {
                      poolId: { equals: input.poolId },
                    }
                  });
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }

        }),
    addCategory: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                numOfQuestions: z.number(),
                poolId: z.string()
            })
        )
        .mutation(async ({ctx, input})=>{
            if (ctx.session.role === 'admin') {
                const data= await ctx.prisma.category.create({
                    data:{
                        name: input.name,
                        numOfQuestions: input.numOfQuestions,
                        poolId: input.poolId
                    }
                });
    
                return data;
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
            
        }),
        
    getCategory: protectedProcedure
        .input(
            z.object({
                id:z.string()
            })
        )
        .query(async ({ctx, input})=>{
            if (ctx.session.role === 'admin') {
                const data = await ctx.prisma.category.findUnique({
                    where:{
                        id: input.id
                    }
                });
                return data;
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
            
        }),
    
    getAllCategories: protectedProcedure
        .input(
            z.object({
                skip:z.number(),
                poolId: z.string(),
                search: z.string().optional()
            })
        )
        .query(async ({ctx, input})=>{
            if (ctx.session.role === 'admin') {
                const data = await ctx.prisma.category.findMany({
                    skip: input.skip,
                    take:6,
                    where:{
                        name:{
                            contains: input.search
                        },
                        poolId:input.poolId
                    },
                    include :{
                        _count: {
                          select: {
                            questions: {
                              where :{
                                status : { equals: 'approved'}
                              }
                            },
                          }, 
                          },
            
                        },
                });
                return data;
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
            
        }),

    updateCategory: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                id:z.string()
            })
        )
        .mutation(async ({ctx, input})=>{
            if (ctx.session.role === 'admin') {
                const data = await ctx.prisma.category.update({
                    where:{
                        id: input.id,
                    },
                    data:{
                        name: input.name
                    }
                });
                return data;
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
           
        }),
        
    deleteCategory: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx,input})=>{
            if (ctx.session.role === 'admin') {
                const data = await ctx.prisma.category.delete({
                    where:{
                        id:input.id
                    }
                });
                return data; //MIGHT NEED ADDITIONAL CHECKS
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
            
        }),
        getCategoriesByPoolId : protectedProcedure
        .input(
            z.object({
                poolId: z.string()
            })
        )
        .query(async ({ctx, input})=>{  
            if (ctx.session.role === 'admin') {
                const data = await ctx.prisma.category.findMany({
                    where:{
                        poolId: input.poolId
                    }
                });
                return data;
            }
            else{
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'UNAUTHORIZED ACCESS.',
        
                  });
            }
            
        }),
    
});

