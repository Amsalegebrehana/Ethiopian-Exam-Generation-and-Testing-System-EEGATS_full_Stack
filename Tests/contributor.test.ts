import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";

require('dotenv').config();
  
test("Test Get count of contributors", async () => {
    const caller = appRouter.createCaller({session: null, prisma: new PrismaClient()});
    const result = await caller.contributor.getCountOfContributors();

    expect(result).not.toBeNull();
    expect(result).toBeGreaterThan(-1);
})  

describe('getAllContributors', () => {
    test("Should return count of contributors when user is admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "admin",
        }
        const caller = appRouter.createCaller({session: session, prisma: new PrismaClient()});
        const result = await caller.contributor.getAllContributorsCount({});
    
        expect(result).not.toBeNull();
        expect(result).toBeGreaterThan(-1);
    })

    test("Should throw an error when user is not an admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "contributor",
        }
        const caller = appRouter.createCaller({session: session, prisma: new PrismaClient()});
        const result = await caller.contributor.getAllContributorsCount({});
    
        expect(result).rejects.toThrow(TRPCError);
    })


})
