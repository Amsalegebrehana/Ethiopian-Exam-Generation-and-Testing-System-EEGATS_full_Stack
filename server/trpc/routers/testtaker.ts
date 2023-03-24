import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import bcrypt from "bcrypt";
export const testTakerRouter = router({

  getTestTakerId : publicProcedure
  .input(z.object({
    username : z.string()
  })).query(async ({ ctx, input }) => {
    const data = await ctx.prisma.testTakers.findUnique({
      where: {
        username: input.username,
      }
    });
    return data?.id;

  }),
 
  
});
