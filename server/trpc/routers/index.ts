import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

import { examGroupRouter } from './examGroups';
import { contributorRouter } from './contributor'
import { poolRouter } from './pool';

export const appRouter = router({

    pool: poolRouter,
    examGroup: examGroupRouter,
    contributor: contributorRouter,
    
});

// export type definition of API
export type AppRouter = typeof appRouter
