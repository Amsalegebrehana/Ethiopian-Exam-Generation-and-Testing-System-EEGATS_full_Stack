import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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
            poolId : z.string(),
            contrId : z.string(),
        }),
    ).mutation(async ({ ctx, input }) => {
        try{

        const pool = await ctx.prisma.pool.findUnique({
            where: {
                id: input.poolId,
            }
        });
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
        if(contributor?.poolId == pool?.id && category?.poolId == pool?.id){
        const question = await ctx.prisma.questions.create({
            data:{
                title: input.questionTitle,
                image: input.questionImage,
                catId: input.catId,
                poolId:input.poolId,
                contributorId : input.contrId,
                status : 'waiting'
            }
        }).then(
            async (data) => {
                const choiceOne =  await ctx.prisma.choice.create({
                    data:{
                        title: input.choiceOneTitle,
                        image: input.choiceOneImage,
                        questionId: data.id,
                    }
                });
                const choiceTwo =  await ctx.prisma.choice.create({
                    data:{
                        title: input.choiceTwoTitle,
                        image: input.choiceTwoImage,
                        questionId: data.id,
                    }
                });
                const choiceThree =  await ctx.prisma.choice.create({
                    data:{
                        title: input.choiceThreeTitle,
                        image: input.choiceThreeImage,
                        questionId: data.id,
                    }
                });
                const choiceFour =  await ctx.prisma.choice.create({
                    data:{
                        title: input.choiceFourTitle,
                        image: input.choiceFourImage,
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
        }else{
            return "error adding question";
        }
    }catch (err){
        console.log(err);
        return "error adding question";
    }
     }),
});