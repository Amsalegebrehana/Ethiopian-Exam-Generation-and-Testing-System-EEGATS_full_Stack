import { Choice, QuestionAnswer, Questions } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {QuestionStatus } from "@prisma/client";
const {supabaseUrl} = useRuntimeConfig();
export const questionRouter = router({
    addQuestion: publicProcedure.input(
        z.object({
            questionTitle: z.string(),
            questionImage: z.string().optional(),
            choiceOneTitle : z.string(),
            choiceOneImage : z.string().optional(),
            choiceTwoTitle : z.string(),
            choiceTwoImage : z.string().optional(),
            choiceThreeTitle : z.string(),
            choiceThreeImage : z.string().optional(),
            choiceFourTitle : z.string(),
            choiceFourImage : z.string().optional(),
            correctChoice : z.string(),
            catId : z.string(),
            contrId : z.string(),
        }),
    ).mutation(async ({ ctx, input }) => {
        try{
        const category = await ctx.prisma.category.findUnique({
            where: {
                id: input.catId,
            }
        });
        const contributor = await ctx.prisma.contributors.findUnique({
            where: {
                id: input.contrId,
            }
        });
        if(contributor?.poolId == category?.poolId ){
        const poolId= category?.poolId;
        if(poolId){
            const urlPrefix = supabaseUrl + '/storage/v1/object/public/eegts-images/' 
            const question = await ctx.prisma.questions.create({
                data:{
                    title: input.questionTitle,
                    image: input.questionImage ?  urlPrefix+  input.questionImage : '',
                    catId: input.catId,
                    poolId: poolId,
                    contributorId : input.contrId,
                }
            }).then(
                async (data) => {
                    //    https://ixzzkpsnlfushkyptszh.supabase.co/storage/v1/object/public/eegts-images/0.08247799274854795.png
                    const choiceOne =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceOneTitle,
                            image: input.choiceOneImage ? urlPrefix+  input.choiceOneImage : '',
                            questionId: data.id,
                        }
                    });
                    const choiceTwo =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceTwoTitle,
                            image: input.choiceTwoImage? urlPrefix+  input.choiceTwoImage  :'',
                            questionId: data.id,
                        }
                    });
                    const choiceThree =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceThreeTitle,
                            image: input.choiceThreeImage ? urlPrefix+  input.choiceThreeImage : '',
                            questionId: data.id,
                        }
                    });
                    const choiceFour =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceFourTitle,
                            image: input.choiceFourImage ? urlPrefix+  input.choiceFourImage : '',
                            questionId: data.id,
                        }
                    });
                    const correctAnswer = await ctx.prisma.questionAnswer.create({
                        data:{
                            questionId : data.id,
                            choiceId : input.correctChoice == 'choiceOne' ? choiceOne.id : input.correctChoice == 'choiceTwo' ? choiceTwo.id : input.correctChoice == 'choiceThree' ? choiceThree.id : choiceFour.id
                        }
                    }); 
                    return data;
                }
            )
        return question;
        }}
    }catch (err){
        console.log(err);
    }
     }),
    submitQuestion: publicProcedure
     .input(
        z.string()
     )
    .mutation(
        async ({ctx, input}) => {
            const question = await ctx.prisma.questions.update({
                where: {
                    id: input
                },
                data: {
                    status: QuestionStatus.waiting
                }
            })
            const contrAssignment = await ctx.prisma.contributorAssignment.findFirst({
                where: {
                    contrId: question.contributorId,
                    catId: question.catId,
                }
            })
            await ctx.prisma.contributorAssignment.update({
                where:{
                    id: contrAssignment?.id
                },
                data : {
                    questionsRemaining : contrAssignment!.questionsRemaining - 1
                }
            });
            var reviewers =  await ctx.prisma.contributors.findMany({
                orderBy : {
                    reviewsMade : 'asc',
                },
                take :5
            });
            var reviewerSelected = reviewers[Math.floor(Math.random()*reviewers.length)];
            if(reviewerSelected.id == question.contributorId){
                reviewers = reviewers.filter((item) => item.id != question.contributorId);
                reviewerSelected  = reviewers[Math.floor(Math.random()*reviewers.length)];
            }
            const review = await ctx.prisma.review.create({
                data :{
                    questionId : question.id,
                    reviewerId : reviewerSelected.id,
                
                }
            }).then(async (data) => {
                await ctx.prisma.contributors.update({
                    where:{
                        id: reviewerSelected.id
                    },
                    data :{
                        reviewsMade : reviewerSelected.reviewsMade + 1
                    }
                })}
            );
        }
    ), 
     getQuestion: publicProcedure
     .input(
        z.string()
     )
     .query(
        async ({ctx, input}) => {

            const question = await ctx.prisma.questions.findUnique({
                where: {
                    id: input
                }
            })
            const choices = await ctx.prisma.choice.findMany({
                where: {
                    questionId: input
                }
            })
            const answer = await ctx.prisma.questionAnswer.findFirst({
                where: {
                    questionId: input
                }
            })
            const review = await ctx.prisma.review.findFirst({
                where: {
                    questionId: input
                }
            })

            return {
                question: question,
                choices: choices,
                answer: answer,
                review: review,
            }
        }
     ),
     deleteQuestion: publicProcedure
     .input(
        z.string()
     )
     .mutation(
        async ({ctx, input}) => {
            const question = await ctx.prisma.questions.findFirst({
                where: {
                    id: input
                }
            })
            if (!question){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Question doesn't exist"
                })
            }
            const deleteQuestion = await ctx.prisma.questions.delete({
                where: {    
                    id: input
                }
            })
            const deleteChoices = await ctx.prisma.choice.deleteMany({
                where: {
                    questionId: input
                }
            })
        }
     ),
     updateQuestion: publicProcedure
     .input(
        z.object({
            questionId: z.string(),
            questionTitle: z.string(),
            questionImage: z.string().optional(),
            choiceOneId: z.string(),
            choiceOneTitle : z.string(),
            choiceOneImage : z.string().optional(),
            choiceTwoId: z.string(),
            choiceTwoTitle : z.string(),
            choiceTwoImage : z.string().optional(),
            choiceThreeId: z.string(),
            choiceThreeTitle : z.string(),
            choiceThreeImage : z.string().optional(),
            choiceFourId: z.string(),
            choiceFourTitle : z.string(),
            choiceFourImage : z.string().optional(),
            correctChoiceId : z.string(),
            correctChoice : z.string(),
            catId : z.string(),
        }),
     )
     .mutation(
        async ({ctx, input}) => {
            const updateQuestion = await ctx.prisma.questions.update({
                where: {
                    id: input.questionId
                },
                data: {
                    title: input.questionTitle,
                    image: input.questionImage,
                    catId: input.catId,
                }
            })

            const updateChoiceOne = await ctx.prisma.choice.update({
                where: {
                    id: input.choiceOneId,
                },
                data: {
                    title: input.choiceOneTitle,
                    image: input.choiceOneImage,
                }
            })
            const updateChoiceTwo = await ctx.prisma.choice.update({
                where: {
                    id: input.choiceTwoId,
                },
                data: {
                    title: input.choiceTwoTitle,
                    image: input.choiceTwoImage,
                }
            })
            const updateChoiceThree = await ctx.prisma.choice.update({
                where: {
                    id: input.choiceThreeId,
                },
                data: {
                    title: input.choiceThreeTitle,
                    image: input.choiceThreeImage,
                }
            })
            const updateChoiceFour = await ctx.prisma.choice.update({
                where: {
                    id: input.choiceFourId,
                },
                data: {
                    title: input.choiceFourTitle,
                    image: input.choiceFourImage,
                }
            })
            // Update Correct answer
            const deleteFormerCorrectAnswer = await ctx.prisma.questionAnswer.delete({
                where: {
                    id: input.correctChoiceId
                }
            })
            const correctAnswer = await ctx.prisma.questionAnswer.create({
                data:{
                    questionId : input.questionId,
                    choiceId : input.correctChoice == 'choiceOne' ? input.choiceOneId : input.correctChoice == 'choiceTwo' ? input.choiceTwoId : input.correctChoice == 'choiceThree' ? input.choiceThreeId : input.choiceFourId
                }
            });
        })

});