import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

import { examGroupRouter } from './examGroups';
import { contributorRouter } from './contributor'
import { poolRouter } from './pool';
import {questionRouter} from './question'
import {testTakerRouter} from './testTaker'
import { reviewsRouter } from './reviews'
import { category } from './category';
import {examRouter} from './exams';
import { analyticsRouter } from './analytics';
import { passwordHandlerRouter } from './password_handler';
import { PrismaClient } from '@prisma/client';
import { login } from './login';

import * as cron from "node-cron";

export const appRouter = router({

    pool: poolRouter,
    examGroup: examGroupRouter,
    contributor: contributorRouter,
    question :questionRouter,
    testtaker: testTakerRouter,
    review: reviewsRouter,
    category :  category,
    exam: examRouter,
    analytics: analyticsRouter,
    passwordHandlerRouter: passwordHandlerRouter,
    login: login,
    
});
// / access prisma client
const prismaClient = new PrismaClient();

// do cron job exam 
const cronJobExam = async () => {
    // invoke the cron job exam release
       // Schedule the cron job
       cron.schedule("* * * * *", async () => {
        // Code to execute on the defined schedule

        const exams = await prismaClient.exam.findMany({
                    where: {
                        examReleaseDate: { lte: new Date() },
                        status: { not: 'gradeReleased' },
                    },
                });
         // Update status for each exam
     
         exams.forEach(async (exam) => {
           
            await prismaClient.exam.update({
                where: {
                    id: exam.id,
                },
                data: {
                    status: 'gradeReleased',
                },
            });
                
            });
        // Perform any operations you need here
   
        });
}
// invoke the cron job exam 
cronJobExam();


// export type definition of API
export type AppRouter = typeof appRouter
