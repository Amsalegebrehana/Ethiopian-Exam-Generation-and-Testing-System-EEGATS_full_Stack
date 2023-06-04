import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";


const confirmPasswordHash = (plainPassword: string, hashedPassword: string) => {
    return new Promise((resolve) => {
        bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
            resolve(res);
        });
    });
};


export const passwordHandlerRouter = router({

    changePassword: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                oldPassword: z.string(),
                newPassword: z.string(),
            })
        ).mutation(
            async ({ ctx, input }) => {
                const hashed = await bcrypt.hash(input.newPassword, 10);
                const oldhashed = await bcrypt.hash(input.oldPassword, 10);

                // If user is admin
                if (ctx.session.role === 'admin') {
                    const user = await ctx.prisma.admin.findFirst({
                    });

                    const isSame = await confirmPasswordHash(
                        input.oldPassword,
                        user!.password
                      )
                    if (!isSame) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Incorrect Password',
                        })
                    }
                    const data = await ctx.prisma.admin.update({
                        where: {
                            id: user!.id,
                        },
                        data: {
                            password: hashed,
                        },
                    });
                    return data;
                }

                // If user is testaker
                else if (ctx.session.role === "testtaker") {
                    const user = await ctx.prisma.testTakers.findUnique({
                        where: {
                            id: input.id,
                        },
                    });

                    if (user!.password !== oldhashed) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Incorrect Password',
                        })
                    }
                    const data = await ctx.prisma.testTakers.update({
                        where: {
                            id: input.id,
                        },
                        data: {
                            password: hashed,
                        },
                    });
                    return hashed;
                }

                // If user is contributor
                else if (ctx.session.role === "contributor") {
                    const user = await ctx.prisma.contributors.findUnique({
                        where: {
                            id: input.id,
                        },
                    });

                    if (user!.password !== oldhashed) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Incorrect Password',
                        })
                    }
                    const data = await ctx.prisma.contributors.update({
                        where: {
                            id: input.id,
                        },
                        data: {
                            password: hashed,
                        },
                    });
                    return hashed;

                } else {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'UNAUTHORIZED ACCESS.',
                    })
                }

            }
        ),
    // change Password procedure ends here



});