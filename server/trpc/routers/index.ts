import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

import { examGroupRouter } from './examGroups';
import { contributorRouter } from './contributor'
import { poolRouter } from './pool';
import {questionRouter} from './question'
import {testTakerRouter} from './testTaker'
import { category } from './category';
import {examRouter} from './exams';
import { analyticsRouter } from './analytics';


export const appRouter = router({

    pool: poolRouter,
    examGroup: examGroupRouter,
    contributor: contributorRouter,
    question :questionRouter,
    testtaker : testTakerRouter,
    category :  category,
    exam: examRouter,
    analytics: analyticsRouter,
  
    
});

// export type definition of API
export type AppRouter = typeof appRouter
