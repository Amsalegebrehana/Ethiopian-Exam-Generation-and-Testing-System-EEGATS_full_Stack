import { jest, test, expect, describe } from "@jest/globals";
import { TRPCError } from "@trpc/server";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient } from "@prisma/client";
// import {Category} from "@prisma/client"
import { sessionInterface } from "../server/trpc/trpc";

describe("Category Router", () => {
  describe("getCategoryCount", () => {
    const session: sessionInterface = {
      user: "",
      expires: "",
      uid: "",
      role: "admin",
    }
    const caller = appRouter.createCaller({session: session, prisma: new PrismaClient()});
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
        role: "contributor",
      }
      const ctx = {
        session
      };

      const input = {
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };

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
    const caller = appRouter.createCaller({session: session,prisma: new PrismaClient()}) ;
  
    test("should add a new category if user is an admin", async () => {
  
      const input = {
        name: "Category1",
        numOfQuestions: 10,
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
      };
  
      const result = await caller.category.addCategory(input);
  
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("numofQuestions");

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
    const caller = appRouter.createCaller({session: session,prisma: new PrismaClient()});
  
    test("should return a category if user is an admin", async () => {
      const input = {
        name:"Category2",
        id: "category-id",
      };
  
      const result = await caller.category.getCategory(input);
  
      expect(result).toEqual({ id: "category-id", name:"Category2"});
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contrtor",
      };
      const caller = appRouter.createCaller({session: session,prisma: new PrismaClient()});
      const input = {
        id: "category-id",
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
    const caller = appRouter.createCaller({session: session,prisma: new PrismaClient()});
  
    test("should return all categories if user is an admin", async () => {
  
      const input = {
        skip: 0,
        poolId: "2e2a5bd3-cc5c-475c-9527-8ee24fc57c24",
        search: "",
      };
  
      const result = await caller.category.getAllCategories(input);
  
      expect(typeof result).toBe("object");
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "contributor",
      };
      
      const caller = appRouter.createCaller({session: session,prisma: new PrismaClient()});

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
      prisma: new PrismaClient(),
    });
  
    test("should update a category if user is an admin", async () => {
  
      const input = {
        id: "category-1",
        name: "Updated Category",
      };
  
      const result = await caller.category.updateCategory(input);
  
      expect(result).toEqual({ id: "category-1", name: "Updated Category" });
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
        id: "category-1",
        name: "Updated Category",
      };
  
      await expect(caller.category.updateCategory(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  
  describe("deleteCategory", () => {
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
  
    test("should delete a category if user is an admin", async () => {
  
      const input = {
        id: "category-1",
      };
  
      const result = await caller.category.deleteCategory(input);
  
      expect(result).toEqual({ id: "category-1" });
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
        id: "category-1",
      };
  
      await expect(caller.category.deleteCategory(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  


});

