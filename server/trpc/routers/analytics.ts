import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const analyticsRouter = router({
  getQuestionStatusDistribution: protectedProcedure
  .query(async ({ ctx , input}) => {
    if(ctx.session.role === 'admin'){

        const questionStatusDistribution = await ctx.prisma.questions.groupBy({
            by: ['status'],
            _count: { id: true },
          });
    
          const labels: string[] = [];
          const counts: number[] = [];
          const backgroundColors = ['#41B883', '#E46651', '#00D8FF', '#DD1B16'];
    
          questionStatusDistribution.forEach((item) => {
            labels.push(item.status);
            counts.push(item._count.id);
          });
    
          const datasets = [
            {
              backgroundColor: backgroundColors,
              data: counts,
            },
          ];

          const options ={
            responsive: true,
            maintainAspectRatio: true
            }
    
          return { data:{labels, datasets}, options };
        
    } else{
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'UNAUTHORIZED ACCESS.',
  
      });
    }

  }),

      
});
