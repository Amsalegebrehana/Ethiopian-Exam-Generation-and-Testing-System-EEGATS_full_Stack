import { jest, test, expect } from "@jest/globals";
import { appRouter } from '../routers'
import { PrismaClient } from "@prisma/client";
import { createInnerTRPCContext } from "~/server/trpc/context";

require('dotenv').config();
  
test("Test Get count of contributors", async () =>{
    const caller = appRouter.createCaller({session: null, prisma: new PrismaClient()});
    const result = await caller.contributor.getCountOfContributors();

    expect(result).toBe(10);
})  