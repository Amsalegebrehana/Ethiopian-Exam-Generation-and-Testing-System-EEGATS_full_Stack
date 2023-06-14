import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient, Contributors } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { resolveObjectURL } from "buffer";
import { de } from "date-fns/locale";

require('dotenv').config();
const prisma = new PrismaClient();

describe('getAllContributors', () => {
    test("Should return count of contributors when user is admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "admin",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
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
        const caller = appRouter.createCaller({session: session, prisma: prisma});
    
        expect(caller.contributor.getAllContributorsCount({})).rejects.toThrow(TRPCError);
    })
})

describe("getAllContributors", () => {
    test("should return an array of at most 6 contributors when user is an admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "admin",
        }
        const context = {session: session, prisma: prisma}
        const caller = appRouter.createCaller(context);
        const result = await caller.contributor.getAllContributors({skip: 0});
        
        expect(result.length).toBeGreaterThanOrEqual(0);
        expect(result.length).toBeLessThanOrEqual(6);
    })

    test("should throw an error when user is not an admin", () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "contributor",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        
        expect(caller.contributor.getAllContributors({skip: 0})).rejects.toThrow(TRPCError);
    })
})

describe("getContributorQuestionCount", () => {
    test("should return question count of a contributor when user is a contributor or an admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "admin",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        const result = await caller.contributor.getContributorQuestionCount("430d59ec-a583-43b1-91bb-ac4f3442f252");

        expect(result).toBeGreaterThanOrEqual(0);
    })

    test("should throw an error when user is either not an admin or a contributor", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "testtaker",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        expect(caller.contributor.getContributorQuestionCount("430d59ec-a583-43b1-91bb-ac4f3442f252")).rejects.toThrow(TRPCError);
    })
})

describe("searchContributorQuestions", () => {
    test("should return a list of contributors when the role is contributor", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "contributor",
        }
        const input = {
            skip: 0,
            search: "search string",
            contributorId: "430d59ec-a583-43b1-91bb-ac4f3442f252",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        const result = await caller.contributor.searchContributorQuestions(input);

        expect(Array.isArray(result)).toBe(true);
    })

    test("should throw an error when user is not an admin", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "testtaker",
        }
        const input = {
            skip: 0,
            search: "search string",
            contributorId: "430d59ec-a583-43b1-91bb-ac4f3442f252",
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        expect(caller.contributor.searchContributorQuestions(input)).rejects.toThrow(TRPCError);
    })

})

describe("checkifAsigned", () => {
    test("should return boolean value when role is admin or contributor", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "contributor",
        }
        const input = {
            contrId: "430d59ec-a583-43b1-91bb-ac4f3442f252"
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        const result = await caller.contributor.checkifAssigned(input);

        expect(typeof result).toBe('boolean');
    })

    test("should throw an error is user is not authorized", () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "unauthorized-user",
        }
        const input = {
            contrId: "430d59ec-a583-43b1-91bb-ac4f3442f252"
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        expect(caller.contributor.checkifAssigned(input)).rejects.toThrow(TRPCError);
    })
})

describe("getAssignedCategories", () => {
    test("should return assigned categories when use is authorized", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "contributor",
        }
        const input = {
            contrId: "430d59ec-a583-43b1-91bb-ac4f3442f252"
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        const result = await caller.contributor.getAssignedCategories(input);
        
        expect(Array.isArray(result)).toBe(true);
    })

    test("should throw an error when user is not authorized", async () => {
        const session: sessionInterface = {
            user: "",
            expires: "",
            uid: "",
            role: "unauthorized-user",
        }
        const input = {
            contrId: "Yohannes Doe"
        }
        const caller = appRouter.createCaller({session: session, prisma: prisma});
        expect(caller.contributor.checkifAssigned(input)).rejects.toThrow(TRPCError);
    })
})