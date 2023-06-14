import { jest, test, expect, describe } from "@jest/globals";
import { appRouter } from '../server/trpc/routers'
import { PrismaClient, Contributors, QuestionStatus } from "@prisma/client";
import { createInnerTRPCContext } from "../server/trpc/context";
import { sessionInterface } from "../server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { resolveObjectURL } from "buffer";
import { de } from "date-fns/locale";

describe("submitQuestion", () => {
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
  
    test("should submit a question if user is a contributor", async () => {
  
      const input = "1";
  
      const result = await caller.question.submitQuestion(input);
  
      expect(result).toEqual({
        id: "1",
        status: QuestionStatus.waiting,
        // Include other question properties as expected
      });
      // Assert other database function calls and input validations
    });
  
    test("should throw an error if user is not a contributor", async () => {
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
  
      const input = "1";
  
      await expect(caller.question.submitQuestion(input)).rejects.toThrow(
        TRPCError
      );
    });
  });

  describe("getQuestion", () => {
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
  
    test("should return the question, choices, answer, and review if user is an admin or contributor", async () => {
  
      const input = "1";
  
      const result = await caller.question.getQuestion(input);
  
      expect(result).toEqual({
        question: {
          id: "1",
          // Include other question properties as expected
        },
        choices: [
          {
            id: "1",
            questionId: "1",
            // Include other choice properties as expected
          },
          {
            id: "2",
            questionId: "1",
            // Include other choice properties as expected
          },
        ],
        answer: {
          id: "1",
          questionId: "1",
          // Include other question answer properties as expected
        },
        review: {
          id: "1",
          questionId: "1",
          // Include other review properties as expected
        },
      });
      // Assert other database function calls and input validations
    });
  
    test("should throw an error if user is neither an admin nor a contributor", async () => {
      const session:sessionInterface = {
        user: "",
        expires: "",
        uid: "",
        role: "guest",
      };
      
      const caller = appRouter.createCaller({
        session: session,
        prisma: new PrismaClient(),
      });

      const input = "1";
  
      await expect(caller.question.getQuestion(input)).rejects.toThrow(
        TRPCError
      );
    });
  });
  
  
  describe("updateQuestion", () => {
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
  
    test("should update the question and choices if user is a contributor", async () => {
  
      const input = {
        questionId: "1",
        questionTitle: "Updated question title",
        questionImage: "updated-question-image.jpg",
        choiceOneId: "1",
        choiceOneTitle: "Updated choice one title",
        choiceOneImage: "updated-choice-one-image.jpg",
        choiceTwoId: "2",
        choiceTwoTitle: "Updated choice two title",
        choiceTwoImage: "updated-choice-two-image.jpg",
        choiceThreeId: "3",
        choiceThreeTitle: "Updated choice three title",
        choiceThreeImage: "updated-choice-three-image.jpg",
        choiceFourId: "4",
        choiceFourTitle: "Updated choice four title",
        choiceFourImage: "updated-choice-four-image.jpg",
        correctChoiceId: "1",
        correctChoice: "choiceOne",
        catId: "1",
      };
  
      const result = await caller.question.updateQuestion(input);
  
      expect(result).toEqual({
        question: {
          id: "1",
          // Include other question properties as expected
        },
        choices: [
          {
            id: "1",
            // Include other choice properties as expected
          },
          {
            id: "2",
            // Include other choice properties as expected
          },
          {
            id: "3",
            // Include other choice properties as expected
          },
          {
            id: "4",
            // Include other choice properties as expected
          },
        ],
      });
      // Assert other database function calls and input validations
    });
  
    test("should throw an error if user is not a contributor", async () => {
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
  
      const input = {
        questionId: "1",
        questionTitle: "Updated question title",
        questionImage: "updated-question-image.jpg",
        choiceOneId: "1",
        choiceOneTitle: "Updated choice one title",
        choiceOneImage: "updated-choice-one-image.jpg",
        choiceTwoId: "2",
        choiceTwoTitle: "Updated choice two title",
        choiceTwoImage: "updated-choice-two-image.jpg",
        choiceThreeId: "3",
        choiceThreeTitle: "Updated choice three title",
        choiceThreeImage: "updated-choice-three-image.jpg",
        choiceFourId: "4",
        choiceFourTitle: "Updated choice four title",
        choiceFourImage: "updated-choice-four-image.jpg",
        correctChoiceId: "1",
        correctChoice: "choiceOne",
        catId: "1",
        // Include other input properties as needed
      };
  
      await expect(
        caller.question.updateQuestion(input)
      ).rejects.toThrow(TRPCError);
    });
  });
  