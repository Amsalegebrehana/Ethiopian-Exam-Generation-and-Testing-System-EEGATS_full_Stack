import { Choice, QuestionAnswer, Questions } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
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
        const contrAssignment = await ctx.prisma.contributorAssignment.findFirst({
            where :{
                catId: input.catId,
                contrId: input.contrId,
            }
        });
        var reviewers =  await ctx.prisma.contributors.findMany({
            orderBy : {
                reviewsMade : 'asc',
            },
            take :5
        });
        if(contributor?.poolId == category?.poolId ){
        const poolId= category?.poolId;
        if(poolId){
            const urlPrefix = supabaseUrl + '/storage/v1/object/public/eegts-images/'
            const question = await ctx.prisma.questions.create({
                data:{
                    title: input.questionTitle,
                    image:  urlPrefix+  input.questionImage,
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
                            image: urlPrefix+  input.choiceOneImage,
                            questionId: data.id,
                        }
                    });
                    const choiceTwo =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceTwoTitle,
                            image:  urlPrefix+  input.choiceTwoImage,
                            questionId: data.id,
                        }
                    });
                    const choiceThree =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceThreeTitle,
                            image:  urlPrefix+  input.choiceThreeImage,
                            questionId: data.id,
                        }
                    });
                    const choiceFour =  await ctx.prisma.choice.create({
                        data:{
                            title: input.choiceFourTitle,
                            image:  urlPrefix+  input.choiceFourImage,
                            questionId: data.id,
                        }
                    });
                    const correctAnswer = await ctx.prisma.questionAnswer.create({
                        data:{
                            questionId : data.id,
                            choiceId : input.correctChoice == 'choiceOne' ? choiceOne.id : input.correctChoice == 'choiceTwo' ? choiceTwo.id : input.correctChoice == 'choiceThree' ? choiceThree.id : choiceFour.id
                        }
                    });
                    if(contrAssignment){
                        await ctx.prisma.contributorAssignment.update({
                            where:{
                                id: contrAssignment?.id
                            },
                            data : {
                                questionsRemaining : contrAssignment?.questionsRemaining - 1
                            }
                        });
                    }
                    var reviewerSelected = reviewers[Math.floor(Math.random()*reviewers.length)];
                    if(reviewerSelected.id == contributor?.id){
                        reviewers = reviewers.filter((item) => item.id != contributor?.id);
                        reviewerSelected  = reviewers[Math.floor(Math.random()*reviewers.length)];
                    }
                    const review = await ctx.prisma.review.create({
                        data :{
                            questionId : data.id,
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
                        });
                        return "question added successfully";
                    }
                    );
                   
    
                }
            )
        }
        }else{
            return "error adding question";
        }
    }catch (err){
        console.log(err);
        return "error adding question";
    }
     }),

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
     )
});