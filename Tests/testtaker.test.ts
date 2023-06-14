import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient, Contributors, TestTakers } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { resolveObjectURL } from "buffer";
import { de } from "date-fns/locale";

describe("getTestTakersCount", () => {
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
  
    test("should return the test taker count if user is an admin", async () => {
      const input = {
        search: "John",
      };
  
      const result = await caller.testtaker.getTestTakersCount(input);
  
      expect(result).toBeGreaterThan(-1);
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
        search: "John",
      };
  
      await expect(
        caller.testtaker.getTestTakersCount(input)
      ).rejects.toThrow(TRPCError);
    });
  });
  
  describe("getTestTakers", () => {
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
  
    test("should return the test takers if user is an admin", async () => {
      
      const input = {
        skip: 0,
        search: "John",
      };
  
      const result = await caller.testtaker.getTestTakers(input);
  
      expect(result).toEqual([
        { id: "1", username: "John", createdAt: "2022-01-01", examGroup: {} },
        { id: "2", username: "Jane", createdAt: "2022-02-01", examGroup: {} },
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
        search: "John",
      };
  
      await expect(
        caller.testtaker.getTestTakers(input)
      ).rejects.toThrow(TRPCError);
    });
  });
  

  describe("getExams", () => {
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
  
    test("should return the exams if user is an admin", async () => {
      const input = {
        skip: 0,
        search: "Math",
        testTakerId: "1",
      };
  
      const result = await caller.exam.getExams(input);
  
      expect(result).toEqual([
        {
          id: "exam1",
          name: "Math Exam",
          createdAt: "2022-01-01",
          examGroup: { id: "group1" },
          status: "completed",
          TestSession: [{ testTakerId: "1" }],
        },
        {
          id: "exam2",
          name: "Science Exam",
          createdAt: "2022-02-01",
          examGroup: { id: "group1" },
          status: "completed",
          TestSession: [{ testTakerId: "1" }],
        },
      ]);
    });
  
    test("should throw an error if user is not an admin", async () => {
      const session: sessionInterface = {
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
        search: "Math",
        testTakerId: "1",
      };
  
      await expect(
        caller.exam.getExams(input)
      ).rejects.toThrow(TRPCError);
    });
  });
  
  describe("getExamChecklist", () => {
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
  
    test("should return the exam's checklist", async () => {
  
      const input = {
        examId: "exam1",
        testTakerId: "1",
      };
  
      const result = await caller.testtaker.getExamChecklist(input);
  
      expect(result).toEqual([
        {
          id: "question1",
          examId: "exam1",
          TestTakerResponse: [
            { testTakerId: "1", examId: "exam1", choiceId: "choice1" },
          ],
          selectedAnswer: "choice1",
        },
        {
          id: "question2",
          examId: "exam1",
          TestTakerResponse: [],
          selectedAnswer: "",
        },
      ]);
    });
  });
  
  describe("submitExam", () => {
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
  
    test("should submit the exam and return the updated test session", async () => {
  
      const input = {
        examId: "exam1",
        testTakerId: "testTaker1",
      };
  
      const result = await caller.testtaker.submitExam(input);
  
      expect(result).toEqual({
        id: "testSession1",
        examId: "exam1",
        testTakerId: "testTaker1",
        isSubmitted: true,
        grade: 5,
      });
    });
  });
  