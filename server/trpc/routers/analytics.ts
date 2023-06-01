import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ChartData, ChartDataset } from 'chart.js';

interface CategoryCounts {
  [categoryName: string]: number;
}
const options : OptionInterface = {
  responsive: true,
  maintainAspectRatio: true
}

interface OptionInterface{responsive: boolean, maintainAspectRatio : boolean}

interface ResultItem {
  id: string;
  name: string;
  numOfQuestions: number;
  categories: CategoryCounts;
  grade: number;
  testTime?: number;
  testDuration?: number,
  ranking?: number,
  chartData?: {data:   ChartData<"doughnut", number[], unknown>, options : OptionInterface};

}
function generateRandomColors(numOfEntries: number, includeBlack: boolean): string[] {
  const colors: string[] = [];

  for (let i = 0; i < numOfEntries; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  if(includeBlack){
    colors.pop();
    colors.push('#000000');
  }

  return colors;
}

export const analyticsRouter = router({
  getQuestionStatusDistribution: protectedProcedure
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {

        const questionStatusDistribution = await ctx.prisma.questions.groupBy({
          by: ['status'],
          _count: { id: true },
        });

        const labels: string[] = [];
        const counts: number[] = [];
        const backgroundColors = ['#41B883', '#E46651', '#00D8FF', '#DD1B16'];
        // const backgroundColors = generateRandomColors(questionStatusDistribution.length);

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
        return { data: { labels, datasets }, options };

      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    }),
  getTestTakerResults: protectedProcedure
    .input(z.object({
      testTakerId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        const testTaker = await ctx.prisma.testTakers.findUnique({
          where: {
            id: input.testTakerId,
          }
        });
        const data = await ctx.prisma.exam.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            examGroup: {
              id: testTaker?.examGroupId
            },
            status: {
              not: 'generated'
            }
          },
          select: {
            id: true,
            name: true,
            numberOfQuestions: true,
            duration: true,
            TestSession: {
              where:
              {
                testTakerId: input.testTakerId,
                isSubmitted: true

              },
              select: {
                testTakers: {
                  select: {
                    username: true,
                    id: true
                  }
                },
                grade: true,
                updatedAt: true,
                createdAt: true
              }

            },
            TestTakerResponse: {
              where: {
                testTakerId: input.testTakerId,
                isCorrect: true
              },
              select: {
                questions: {
                  select: {
                    category: {
                      select: {
                        name: true
                      }
                    }
                  }
                }

              }
            },
          }

        }).then((data) => {
          if (data) {
            const result: ResultItem[] = [];
            const username = data[0].TestSession[0].testTakers.username;
            const grades: number[] = [];
            data.forEach(async (item) => {
              const unansweredCategoryName = "Incorrect";
              const correctCount = 0; 
              let unansweredCount = item.numberOfQuestions - item.TestTakerResponse.length;

              const testDuration = item.duration;
              const testTime = Math.abs(Math.round((item.TestSession[0].updatedAt.getTime() - item.TestSession[0].createdAt.getTime()) / 60000));
              const categoryCounts: CategoryCounts = {};
              const testTakerIndex = item.TestSession.findIndex((session) => session.testTakers.id === input.testTakerId);
              var ranking;
              // If the test taker's test session is found, return the ranking
              if (testTakerIndex !== -1) {
                ranking = testTakerIndex + 1;
              }
              item.TestTakerResponse.forEach((response) => {
                const categoryName = response.questions.category.name;
                
                if (categoryCounts.hasOwnProperty(categoryName)) {
                  categoryCounts[categoryName]++;
                } else {
                  categoryCounts[categoryName] = 1;
                }
              });
              
              if (unansweredCount > 0) {
                categoryCounts[unansweredCategoryName] = unansweredCount;
              }

              const labels: string[] = [];
              const counts: number[] = [];
            
              const chartData:  ChartData<"doughnut", number[], unknown> = {
                labels: [],
                datasets: [{
                  data: [],
                  backgroundColor: [],
                }],
              };
              
              Object.entries(categoryCounts).forEach(([category, count], index) => {
                chartData.labels?.push(category);
                chartData.datasets[0].data.push(count);
              });
              chartData.datasets[0].backgroundColor = generateRandomColors(chartData.labels?.length || 0, unansweredCount > 0 );
              const grade = (item.TestSession[0].grade / item.numberOfQuestions) * 100;
              grades.push(grade);





              result.push({
                id: item.id,
                name: item.name,
                numOfQuestions: item.numberOfQuestions,
                categories: categoryCounts,
                grade,
                testTime,
                testDuration,
                chartData : {
                  data : chartData,
                  options
                },
                
              });
            });
            const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            const highestGrade = Math.max(...grades);
            const lowestGrade = Math.min(...grades);

            return {
              result,
              averageGrade,
              highestGrade,
              lowestGrade,
              username,
              options
            };

          }

        });
        return data;
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    }),



});
