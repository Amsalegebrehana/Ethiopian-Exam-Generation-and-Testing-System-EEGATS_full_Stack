import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import { PrismaClient, Contributors, Questions, Category, ContributorAssignment, Review } from "@prisma/client";
import { filter } from "./reviews";

interface CategoryCounts {
  [categoryName: string]: number;
}

interface ResultItem {
  id: string;
  pool: string;
  name: string;
  numOfQuestions: number;
  categories: CategoryCounts;
  grade: number;
  testTime?: number;
  testDuration?: number,
  ranking?: number,
  chartData?: { data: ChartData<"doughnut", number[], unknown>, options?: any };

}
function generateRandomColors(numOfEntries: number, includeBlack: boolean): string[] {
  const colors: string[] = [];

  for (let i = 0; i < numOfEntries; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  if (includeBlack) {
    colors.pop();
    colors.push('#000000');
  }

  return colors;
}



export const analyticsRouter = router({
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
            pool: {
              select: {
                name: true
              }
            },
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
            const username = testTaker?.username;
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
                const categoryName =  response.questions.category.name.length > 20?  response.questions.category.name.slice(0,19) + '...' : response.questions.category.name;

                if (categoryCounts.hasOwnProperty(categoryName)) {
                  categoryCounts[categoryName]++;
                } else {
                  categoryCounts[categoryName] = 1;
                }
              });

              if (unansweredCount > 0) {
                categoryCounts[unansweredCategoryName] = unansweredCount;
              }

              const chartData: ChartData<"doughnut", number[], unknown> = {
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
              chartData.datasets[0].backgroundColor = generateRandomColors(chartData.labels?.length || 0, unansweredCount > 0);
              const grade = (item.TestSession[0].grade / item.numberOfQuestions) * 100;
              grades.push(grade);

              result.push({
                id: item.id,
                name: item.name,
                pool: item.pool.name,
                numOfQuestions: item.numberOfQuestions,
                categories: categoryCounts,
                grade,
                testTime,
                testDuration,
                chartData: {
                  data: chartData,
                  options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'right',

                      },
                    },
                  } as ChartConfiguration<'doughnut'>['options']
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

  getPoolAnalytics: protectedProcedure
    .input(z.object({
      poolId: z.string()
    }))
    .query(
      async ({ ctx, input }) => {
        if (ctx.session.role === 'admin') {
          try {
            const pool = await ctx.prisma.pool.findUnique({
              where: { id: input.poolId },
              include: {
                Contributors: {
                  include: { Questions: true },
                  orderBy: { Questions: { _count: 'desc' } },
  
                },
                Category: {
                  include: { questions: true },
                  orderBy: { questions: { _count: 'desc' } },
                },
                Exam: true
              }
            });
  
            if (!pool) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Pool not found',
  
              });
            }
  
            const contributorCount: number = pool.Contributors.length;
  
            const categoryDistribution: { categoryName: string; totalQuestions: number }[] = pool.Category.map(
              (category) => ({
                categoryName: category.name,
                totalQuestions: category.questions.length
              })
            );
  
            const examCount: number = pool.Exam.length;
  
            const totalQuestions: number = pool.Category.reduce((total, category) => total + category.questions.length, 0);
  
            const topContributors: { contributorName: string; contributionPercentage: number }[] = pool.Contributors
              .map(contributor => ({
                contributorName: contributor.name,
                contributionPercentage: (contributor.Questions.length / totalQuestions) * 100
              }))
              .sort((a, b) => b.contributionPercentage - a.contributionPercentage)
              .slice(0, 3);
  
  
            const topCategories: { categoryName: string; totalQuestions: number }[] = pool.Category
              .sort((a, b) => b.questions.length - a.questions.length)
              .map((category) => ({
                categoryName: category.name,
                totalQuestions: category.questions.length
              }))
              .slice(0, 3);
  
            const questionStatusMetrics: { [status: string]: number } = {};
  
            pool.Category.forEach((category) => {
              category.questions.forEach((question) => {
                if (!questionStatusMetrics[question.status]) {
                  questionStatusMetrics[question.status] = 0;
                }
                questionStatusMetrics[question.status]++;
              });
            });
  
            const chartData: ChartData<"doughnut", number[], unknown> = {
              labels: [],
              datasets: [{
                data: [],
                backgroundColor: [],
              }],
            };
  
            Object.entries(questionStatusMetrics).forEach(([status, count], index) => {
              chartData.labels?.push(status);
              chartData.datasets[0].data.push(count);
            });
            chartData.datasets[0].backgroundColor = generateRandomColors(chartData.labels?.length || 0, false);
  
            const categoryLabels: string[] = categoryDistribution.map((category) => category.categoryName.length > 20? category.categoryName.slice(0,19) + '...' :category.categoryName);
            const categoryCounts: number[] = categoryDistribution.map((category) => category.totalQuestions);
  
            const categoryDistributionChartData: ChartData<"bar", number[], unknown> = {
              labels: categoryLabels,
              datasets: [
                {
                  label: 'Total Questions',
                  data: categoryCounts,
                  backgroundColor: generateRandomColors(categoryCounts.length, false)
                }
              ]
            };
            const totalApprovedQuestions: number = questionStatusMetrics.approved || 0;
  
            const isEmptyDistribution = Object.keys(questionStatusMetrics).length === 0;
            const isEmptyBarDistribution = Object.keys(categoryCounts).length === 0;
  
            return {
              contributorCount,
              categoryDistribution,
              examCount,
              topContributors,
              topCategories,
              questionStatusMetrics,
              totalApprovedQuestions,
              poolName: pool.name,
              statusDistribution: {
                data: chartData,
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    title: {
                      display: true,
                      text: isEmptyDistribution ? 'No Questions Found' : 'Question Status Distribution',
                      font: {
                        size: 22,
                        weight: 'bold',
                      },
                    },
                    legend: {
                      position: 'right',
  
                    },
                  },
                } as ChartConfiguration<'doughnut'>['options']
              },
              catDistribution: {
                data: categoryDistributionChartData,
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    x: {
                      grid:{
                        display: false
                      },
                      display: true,
                      title: {
                        display: true,
                        text: 'Categories',
                        font: {
                          size: 16,
                          weight : '600'
                        },
                      },
                      
                    },
                    y: {
                      grid:{
                        display: false
                      },
                      display: true,
                      title: {
                        display: true,
                        text: 'Number of Questions',
                        font: {
                          size: 16,
                          weight : '600'
                        },
                      },
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: isEmptyBarDistribution ? 'No Questions Found' : 'Category Distribution',
                      font: {
                        size: 22,
                        weight: 'bold',
                      },
                    },
                    legend: {
                      display: false,
                    },
                  },
                } as ChartConfiguration<'bar'>['options']
              },
            };
          } catch (error) {
            console.error('Error retrieving pool data:', error);
            throw error;
          }
        
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'UNAUTHORIZED ACCESS.',
  
          });
        }
  
      

      }
    ),

  getExamAnalytics: protectedProcedure
    .input(z.object({
      examId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        try {
          const exam = await ctx.prisma.exam.findUnique({
            where: { id: input.examId },
            include: {
              TestSession: {
                where: { isSubmitted: true },
              },
              Questions: {
                include: {
                  QuestionAnswer: true,
                  TestTakerResponse: true,
                  Contributors: true,
                  category: true,
                },
              },
            },
          });
  
          if (!exam) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Exam not found',
  
            });
          }
  
          // Calculate test taker statistics
          const totalTestTakers = exam.TestSession.length;
          const passedTestTakers = exam.TestSession.filter((session) => ((session.grade / exam.numberOfQuestions) * 100) > 50).length;
          const averageGrade =
            totalTestTakers > 0 ? exam.TestSession.reduce((acc, session) => acc + session.grade, 0) / totalTestTakers : 0;
          const highestGrade = Math.max(...exam.TestSession.map((session) => session.grade));
          const lowestGrade = Math.min(...exam.TestSession.map((session) => session.grade));
  
          // Analyze question performance
          const questionPerformance: { contrId: string; title: string; percentageCorrect: number, contrName: string }[] = [];
  
          exam.Questions.forEach((question) => {
            const totalTestTakers = question.TestTakerResponse.length;
            let correctCount = 0;
  
            question.TestTakerResponse.forEach((response) => {
              const isCorrect = response.isCorrect || false;
              if (isCorrect) {
                correctCount++;
              }
            });
  
            const percentageCorrect = (correctCount / totalTestTakers) * 100;
            questionPerformance.push({
              title: filter(question.title, 40),
              contrId: question.contributorId,
              contrName: question.Contributors.name,
              percentageCorrect,
            });
  
          });
  
          // Sort and extract question performance data
          const sortedQuestions = questionPerformance.sort(
            (a, b) => b.percentageCorrect - a.percentageCorrect
          );
          const highestPerformingQuestions = sortedQuestions.slice(0, 3);
          const lowestPerformingQuestions = sortedQuestions.slice(-3).reverse();
  
          const categoryCounts: CategoryCounts = {};
  
          exam.Questions.forEach((question) => {
            const categoryName = question.category.name.length > 20?  question.category.name.slice(0,19) + '...' : question.category.name;
  
            if (categoryCounts.hasOwnProperty(categoryName)) {
              categoryCounts[categoryName]++;
            } else {
              categoryCounts[categoryName] = 1;
            }
          });
  
  
  
          const chartData: ChartData<"doughnut", number[], unknown> = {
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
          chartData.datasets[0].backgroundColor = generateRandomColors(chartData.labels?.length || 0, false);
          const isEmptyDistribution = Object.keys(categoryCounts).length === 0;
          return {
            examId: exam.id,
            totalQuestions: exam.Questions.length,
            totalTestTakers,
            percentagePassed: (passedTestTakers / totalTestTakers) * 100,
            averageGrade: (averageGrade / exam.numberOfQuestions) * 100,
            highestGrade: (highestGrade / exam.numberOfQuestions) * 100,
            lowestGrade: (lowestGrade / exam.numberOfQuestions) * 100,
            highestPerformingQuestions,
            lowestPerformingQuestions,
            statusDistribution: {
              data: chartData,
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  title: {
                    display: true,
                    text: isEmptyDistribution ? 'No Question Found' : 'Question Status Distribution',
                    font: {
                      size: 14,
                      weight: 'bold',
                    },
                  },
                  legend: {
                    position: 'right',
  
                  },
                },
              } as ChartConfiguration<'doughnut'>['options']
            },
  
          };
        } catch (error) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Exam not found',
  
          });
        }
        
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
      

    }),


  getContributorAnalytics: protectedProcedure
    .input(z.object({
      contrId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.role === 'admin') {
        try {
          const contributor = await ctx.prisma.contributors.findUnique({
            where: { id: input.contrId },
            select: {
              Questions: { include: { category: true } },
              contributorAssignments: {
                include: {
                  category: {
                    include: { questions: true },
                  }
                }
              },
              Reviews: {
                include: {
                  questions: true,
                }
              },
              pool: {
                select: {
                  name: true
                }
              },
              name: true,
            },
          });
  
          if (!contributor) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Contributor not found',
  
            });
          }
          const statusDistribution: Record<string, number> = {
            accepted: 0,
            rejected: 0,
            reviewing: 0,
            drafting: 0,
          };
  
          contributor.Questions.forEach((question) => {
            switch (question.status) {
              case "approved":
                statusDistribution.accepted++;
                break;
              case "rejected":
                statusDistribution.rejected++;
                break;
              case "waiting":
                statusDistribution.reviewing++;
                break;
              case "draft":
                statusDistribution.drafting++;
                break;
              default:
                break;
            }
          });
  
  
          
          const totalAssignedQuestions = contributor.contributorAssignments.reduce((total, assignment) => total + assignment.questionsRemaining, 0);
        
          const submittedReviews = contributor.Reviews.filter((review) => review.isReviewed);
  
          const approvingRate = submittedReviews.filter((review) => review.questions.status === 'approved').length;
  
          const chartData: ChartData<"doughnut", number[], unknown> = {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [],
            }],
          };
  
          Object.entries(statusDistribution).forEach(([status, count], index) => {
            chartData.labels?.push(status);
            chartData.datasets[0].data.push(count);
          });
          chartData.datasets[0].backgroundColor = generateRandomColors(chartData.labels?.length || 0, false);
  
  
          const consolidatedCategories: {
            categoryName: string;
            totalQuestions: number;
          }[] = [];
  
          contributor.Questions.forEach((question) => {
            const category: Category = question.category;
            const categoryName: string = category.name;
  
            const existingCategoryIndex = consolidatedCategories.findIndex(
              (consolidatedCategory) => consolidatedCategory.categoryName === categoryName
            );
  
            if (existingCategoryIndex !== -1) {
              consolidatedCategories[existingCategoryIndex].totalQuestions++;
            } else {
              consolidatedCategories.push({ categoryName, totalQuestions: 1 });
            }
          });
  
          const categoryLabels: string[] = consolidatedCategories.map((category) => category.categoryName.length > 20 ? category.categoryName.slice(0,19)+ '...' : category.categoryName,);
          const categoryCounts: number[] = consolidatedCategories.map((category) => category.totalQuestions);
  
          const categoryDistributionChartData: ChartData<"bar", number[], unknown> = {
            labels: categoryLabels,
            datasets: [
              {
                label: 'Total Questions',
                data: categoryCounts,
                backgroundColor: generateRandomColors(categoryCounts.length, false)
              }
            ]
          };
  
          const isEmptyDistribution = statusDistribution.accepted === 0 && statusDistribution.rejected === 0 && statusDistribution.waitingReview === 0 && statusDistribution.inDraft === 0;
          const isEmptyBarDistribution = Object.keys(categoryCounts).length === 0;
  
  
  
  
          return {
           
            totalQuestionsCreated : contributor.Questions.length,
            totalAssignedQuestions,
            approvingRate : (approvingRate / submittedReviews.length) * 100,
            totalReviewsAssigned : contributor.Reviews.length,
            submittedReviews: submittedReviews.length,
            poolName: contributor.pool.name,
            contributorName: contributor.name,
            statusDistribution: {
              data: chartData,
              options:  {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  title: {
                    display: true,
                    text: isEmptyDistribution ? 'No Questions Found' : 'Question Status Distribution',
                    font: {
                      size: 22,
                      weight: 'bold',
                    },
                  },
                  legend: {
                    position: 'right',
  
                  },
                },
              } as ChartConfiguration<'doughnut'>['options']
            },
            catDistribution: {
              data: categoryDistributionChartData,
              options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  x: {
                    grid:{
                      display: false
                    },
                    display: true,
                    title: {
                      display: true,
                      text: 'Categories',
                      font: {
                        size: 16,
                        weight : '600'
                      },
                    },
                    
                  },
                  y: {
                    grid:{
                      display: false
                    },
                    display: true,
                    title: {
                      display: true,
                      text: 'Number of Questions',
                      font: {
                        size: 16,
                        weight : '600'
                      },
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: isEmptyBarDistribution ? 'No Questions Found' : 'Category Distribution',
                    font: {
                      size: 22,
                      weight: 'bold',
                    },
                  },
                  legend: {
                    display: false,
                  },
                },
              } as ChartConfiguration<'bar'>['options']
            },
          }
        } catch (error) {
          console.error("Error retrieving contributor data:", error);
          throw error;
        }
        
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }
      
      

     

    }),

    getDashboardAnalytics : protectedProcedure
    .query(async({ctx,input})=>{
      if (ctx.session.role === 'admin') {
        try{
          // Total Number of Examsx
          const totalExams = await ctx.prisma.exam.count();
          
          // Total Number of Pools
          const totalPools = await ctx.prisma.pool.count();
      
          // Exam Group Test Taker Distribution
          const examGroupDistribution = await ctx.prisma.examGroup.findMany({
            include: {
              TestTakers: true,
            },
            where: {
              TestTakers: {
                some: {
                  id: {
                    not: undefined
                  }
                }
              }
            }
          });
      
          const examGroupData = examGroupDistribution.map((group) => ({
            examGroup: group.name.length > 20 ? group.name.slice(0,19)+ '...' : group.name,
            testTakers: group.TestTakers.length,
          }));
      
      
      
        ;
      
          // Generate Bar Chart Data for Exam Group Test Taker Distribution
          const examGroupChartLabels = examGroupData.map((item) => item.examGroup);
          const examGroupChartValues = examGroupData.map((item) => item.testTakers);
      
          const examGroupChartData = {
            labels: examGroupChartLabels,
            datasets: [
              {
                label: 'Test Takers',
                data: examGroupChartValues,
                backgroundColor: generateRandomColors(examGroupChartLabels.length, false),
              },
            ],
          };
      
          // Generate Doughnut Chart Data for Contributor Distribution
          const contributorDistribution = await ctx.prisma.pool.findMany({
            include: {
              Contributors: true,
            },
            where: {
              Contributors: {
                some: {
                  id: {
                    not: undefined
                  }
                }
              }
            }
          });
          const contributorCount = contributorDistribution.reduce(
            (count, pool) => count + pool.Contributors.length,
            0
          )
          
          const contributorChartData = {
            labels: contributorDistribution.map((pool) => pool.name.length > 20 ? pool.name.slice(0,19)+ '...' : pool.name),
            datasets: [
              {
                data: contributorDistribution.map((pool) => pool.Contributors.length),
                backgroundColor: generateRandomColors(contributorDistribution.length, false),
              },
            ],
          };

          const isEmptyDistribution = contributorCount=== 0;
          const isEmptyBarDistribution = examGroupData.length === 0;
  
          return {
           totalExams,
            totalPools,
            examGroupDistribution: {
              data: examGroupChartData,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid:{
                      display: false
                    },
                    display: true,
                    title: {
                      display: true,
                      text: 'Exam Groups',
                      font: {
                        size: 16,
                        weight : '600'
                      },
                    },
                    
                  },
                  y: {
                    grid:{
                      display: false
                    },
                    display: true,
                    title: {
                      display: true,
                      text: 'Number of Test Takers',
                      font: {
                        size: 16,
                        weight : '600'
                      },
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    align:'end',
                    text: isEmptyBarDistribution ? 'No Exam Group Data Found' : 'Exam Group Distribution',
                    font: {
                      size: 22,
                      weight: 'bold',
                    },
                  },
                  legend: {
                    display: false,
                  },
                },
              } as ChartConfiguration<'bar'>['options'],
            },
            contributorDistribution: {
              data: contributorChartData,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    align:'end',
                    text: isEmptyDistribution ? 'No Contributors Found' : 'Contributor Distribution',
                    font: {
                      size: 22,
                      weight: 'bold',
                    },
                  },
                  legend: {
                    position:'right',
                    // align:'end'
                  },
                },
              } as ChartConfiguration<'doughnut'>['options'],
            },
          };
        } catch (error) {
          console.error('Error retrieving admin dashboard data:', error);
          throw error;
        }

        
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED ACCESS.',

        });
      }

    })


});
