// login
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
//  bcrypt
import bcrypt from 'bcrypt'; 

// 
import { sendOtp } from "../../../utils/mailer";
import { generateOtp } from "../../../utils/generateOtp";

export const login = router({
    loginUser: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
                role: z.string()
            })
        )
        .mutation(async ({ctx, input})=>{

            console.log("here")
            
                if (input.role === 'admin'){
                    console.log(input.email)
                    // find admin user from admin table
                    const adminUser = await ctx.prisma.admin.findUnique({
                        where: {
                            email: input.email,
                        },
                    });

                    console.log("adminUser", adminUser);
                    if (!adminUser) {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'Admin user not found.',
                        });
                    }
                    // check the password with the hashed password 
                    const res = await bcrypt.compare(input.password, adminUser.password);

                    console.log("res", res);

                    if (res === false) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Invalid credentials.',
                        });
                    }
                    // generate
                    const { otp, hashedOtp, expiryTime } = await generateOtp();
                    // update the otp in admin table
                    const updatesAdmin = await ctx.prisma.admin.update({
                        where: {
                            id: adminUser.id,
                        },
                        data: {
                            otp: hashedOtp,
                            otpExpiryDate: expiryTime,
                        },
                    });
                    console.log("otp updated", otp);
                    //  send email with otp admin email
                    await sendOtp({
                        email: adminUser.email,
                        otp,
                    });
                    console.log("otp sent");

                    return updatesAdmin;
                    
                } else if (input.role === 'contributor'){
                    // find contributor user from contributor table
                    const contributorUser = await ctx.prisma.contributors.findUnique({
                        where: {
                            email: input.email,
                        },
                    });

                    // check if contributor exists
                    if (!contributorUser) {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'Contributor user not found.',
                        });
                    }

                    // check if password matches
                    const res = await bcrypt.compare(input.password, contributorUser.password);

                    if (res === false) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Invalid credentials.',
                        });
                    }
                     // generate
                     const { otp, hashedOtp, expiryTime } = await generateOtp();
                    // update the otp in admin table
                    const updatedContributor = await ctx.prisma.contributors.update({
                        where: {
                            id: contributorUser.id,
                        },
                        data: {
                            otp: hashedOtp,
                            otpExpiryDate: expiryTime,
                        },
                    });
                    //  send email with otp 
                    await sendOtp({
                        email: contributorUser.email,
                        otp,
                    });

                    return updatedContributor;
                }
                else{

                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'You have no the required roles.',
                    });

                }
            
        }),
});