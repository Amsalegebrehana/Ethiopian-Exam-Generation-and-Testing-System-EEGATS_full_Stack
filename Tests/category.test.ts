import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient, Contributors } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { resolveObjectURL } from "buffer";
import { de } from "date-fns/locale";

const prisma = new PrismaClient();

describe("Category Router", () => {
  describe("getCategoryCount", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    }
    const caller = appRouter.createCaller({session: session, prisma: prisma});
    test("should return category count if user is an admin", async () => {
      
      const ctx = {
        session,
        prisma: {
          category: {
            count: jest.fn().mockResolvedValue(5 as never), // Mock the count function to return a fixed value
          },
        },
      };

      const input = {
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };

      const result = await caller.category.getCategoryCount(input);

      expect(result).toBeGreaterThan(-1);
    });

    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "unauthorized",
      }

      const input = {
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
      const caller = appRouter.createCaller({session: session, prisma: prisma});

      expect(caller.category.getCategoryCount(input)).rejects.toThrow(TRPCError);
    });
  });

  // Add more test cases for other methods in a similar manner

  describe("addCategory", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({session: session,prisma: prisma}) ;
  
    test("should add a new category if user is an admin", async () => {
    
      const input = {
        name: `Category${Math.floor(Math.random()*100000)}`,
        numOfQuestions: Math.floor(Math.random()*100),
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
      };
  
      const result = await caller.category.addCategory(input);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("numOfQuestions");

    });
  
    test("should throw an error if user is not an admin", async () => {
  
      const input = {
        name: "Category2",
        numOfQuestions: 10,
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
      };
  
      await expect(caller.category.addCategory(input)).rejects.toThrow(TRPCError);
    });
  });
  
  describe("getCategory", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({session: session,prisma: prisma});
  
    test("should return a category if user is an admin", async () => {
      const input = {
        id: "49d306e9-a601-41c3-99b9-982386a7a498",
      };
  
      const result = await caller.category.getCategory(input);
  
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("poolId");
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "unauthorized",
      };
      const caller = appRouter.createCaller({session: session, prisma: prisma});
      const input = {
        id: "49d306e9-a601-41c3-99b9-982386a7a498",
      };
  
      await expect(caller.category.getCategory(input)).rejects.toThrow(TRPCError);
    });
  });

  describe("getAllCategories", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({session: session,prisma: prisma});
  
    test("should return all categories if user is an admin", async () => {
  
      const input = {
        skip: 0,
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
  
      const result = await caller.category.getAllCategories(input);
  
      expect(Array.isArray(result)).toBe(true);
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "unauthorized",
      };
      
      const caller = appRouter.createCaller({session: session, prisma: prisma});

      const input = {
        skip: 0,
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
  
      await expect(caller.category.getAllCategories(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  
  describe("updateCategory", () => {
    const session:sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    };
    const caller = appRouter.createCaller({
      session: session,
      prisma: prisma,
    });
  
    test("should update a category if user is an admin", async () => {
  
      const input = {
        id: "13f3ff2b-720d-4ae7-bf55-8d9740679d16",
        name: `Updated Category #${Math.floor(Math.random()*100)}`,
      };
  
      const result = await caller.category.updateCategory(input);
  
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("poolId");
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "unauthorized",
      };
      const caller = appRouter.createCaller({
        session: session,
        prisma: prisma,
      });
  
      const input = {
        id: "category-1",
        name: "Updated Category",
      };
  
      await expect(caller.category.updateCategory(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  


});
