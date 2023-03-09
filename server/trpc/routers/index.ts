import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

import { poolRouter } from './pool';
export const appRouter = router({
  
    pool: poolRouter,
    
  
});

// export type definition of API
export type AppRouter = typeof appRouter
