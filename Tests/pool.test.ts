import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient, Contributors, Pool } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { resolveObjectURL } from "buffer";
import { de } from "date-fns/locale";

describe("getPoolContributorsCount", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should return contributors count if user is an admin", async () => {
      const ctx = {
        session,
        prisma: {
          contributors: {
            count: jest.fn().mockResolvedValue(10 as never), // Mock the count function to return a fixed value
          },
        },
      };
  
      const input = {
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
  
      const result = await caller.pool.getPoolContributorsCount(input);
  
      expect(result).toBe(10);
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };
  
      const input = {
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
  
      await expect(caller.pool.getPoolContributorsCount(input)).rejects.toThrow(
        TRPCError
      );
    });
  });

describe("getPoolContributors", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should return pool contributors if user is an admin", async () => {
      const ctx = {
        session,
        prisma: {
          contributors: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: "1",
                name: "Contributor 1",
                // Include other properties as needed
              },
              {
                id: "2",
                name: "Contributor 2",
                // Include other properties as needed
              },
            ] as never), // Mock the findMany function to return a fixed array of contributors
          },
        },
      };
  
      const input = {
        skip: 0,
        search: "",
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
      };
  
      const result = await caller.pool.getPoolContributors(input);
  
      expect(result).toEqual([
        {
          id: "1",
          name: "Contributor 1",
          // Include other properties as expected
        },
        {
          id: "2",
          name: "Contributor 2",
          // Include other properties as expected
        },
      ]);
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };
  
      const input = {
        skip: 0,
        search: "",
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
      };
  
      await expect(caller.pool.getPoolContributors(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  
  describe("getPools", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should return pools if user is an admin", async () => {
      const input = {
        skip: 0,
        search: "",
      };
  
      const result = await caller.pool.getPools(input);
  
      expect(result).toEqual([
        {
          id: "1",
          name: "Pool 1",
          // Include other properties as expected
        },
        {
          id: "2",
          name: "Pool 2",
          // Include other properties as expected
        },
      ]);
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };

      const caller = appRouter.createCaller({
        session: session,
        prisma: new PrismaClient(),
      });
  
      const input = {
        skip: 0,
        search: "",
      };
  
      await expect(caller.pool.getPools(input)).rejects.toThrow(TRPCError);
    });
  });
  
  describe("addPool", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should add a pool if user is an admin", async () => {
      const input = {
        name: "Pool 1",
        // Include other properties as needed
      };
  
      const result = await caller.pool.addPool(input);
  
      expect(result).toEqual({
        id: "1",
        name: "Pool 1",
        // Include other properties as expected
      });
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };

      const caller = appRouter.createCaller({
        session: session,
        prisma: new PrismaClient(),
      });
  
      const input = {
        name: "Pool 1",
        // Include other properties as needed
      };
  
      await expect(caller.pool.addPool(input)).rejects.toThrow(TRPCError);
    });
  });
  

  describe("updatePool", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should update a pool if user is an admin", async () => {
  
      const input = {
        id: "1",
        name: "Updated Pool 1",
        // Include other properties as needed
      };
  
      const result = await caller.pool.updatePool(input);
  
      expect(result).toEqual({
        id: "1",
        name: "Updated Pool 1",
        // Include other properties as expected
      });

    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };

      const caller = appRouter.createCaller({
        session: session,
        prisma: new PrismaClient(),
      });
  
      const input = {
        id: "1",
        name: "Updated Pool 1",
        // Include other properties as needed
      };
  
      await expect(caller.pool.updatePool(input)).rejects.toThrow(TRPCError);
    });
  });
  
  describe("deletePool", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: new PrismaClient(),
    });
  
    test("should delete a pool if user is an admin", async () => {
  
      const input = {
        id: "1",
      };
  
      const result = await caller.pool.deletePool(input);
  
      expect(result).toEqual({
        id: "1",
        name: "Deleted Pool 1",
        // Include other properties as expected
      });
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };
      
      const caller = appRouter.createCaller({
        session: session,
        prisma: new PrismaClient(),
      });
  
      const input = {
        id: "1",
      };
  
      await expect(caller.pool.deletePool(input)).rejects.toThrow(TRPCError);
    });
  });
  