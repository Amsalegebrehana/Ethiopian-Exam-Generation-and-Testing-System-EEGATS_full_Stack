
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
    try {
        // Create pool
        const pool1 = await prisma.pool.upsert({
            where: { name: 'Programming' },
            update: {
                numberOfQuestions: {
                    increment: 16
                }
            },
            create: {
                name: 'Programming',
                numberOfQuestions: 16
            },
        });

        const findCat = await prisma.category.findUnique({
            where: {
                name_poolId: {

                    name: 'Database',
                    poolId: pool1.id
                }
            }
        });
        var category1;
        if (findCat) {
            await prisma.category.update({
                where: {
                    id: findCat.id,
                }, data: {
                    numOfQuestions: {
                        increment: 16
                    }
                }
            });
            category1 = findCat;
        } else {
            category1 = await prisma.category.create({

                data: {
                    name: 'Database',
                    poolId: pool1.id,
                    numOfQuestions: 16
                },
            });

        }

        // Create contributors
        const contributor1 = await prisma.contributors.upsert({
            where: { email: 'jane@eegts.org' },
            update: {},
            create: {
                name: 'Jane Doe',
                email: 'jane@eegts.org',
                password: 'password',
                poolId: pool1.id
            },
        });
        for (let index = 0; index < 16; index++) {
            const question1 = await prisma.questions.create({
                data: {
                    status: 'approved',
                    title: `Question ${index + 1} ${category1.name}`,
                    catId: category1.id,
                    poolId: pool1.id,
                    contributorId: contributor1.id,
                },
            });
    
            // Create choices for question1
    
            const question1choices = await prisma.choice.createMany({
                data: [
                    {
                        title: 'Choice 2',
                        questionId: question1.id,
                    },
                    {
                        title: 'Choice 3',
                        questionId: question1.id,
                    },
                    {
                        title: 'Choice 4',
                        questionId: question1.id,
                    }
                ],
            });
    
    
            const question1choice = await prisma.choice.create({
                data: {
                    title: 'Choice 1',
                    questionId: question1.id,
                }
            });
            await prisma.questionAnswer.create({
                data: {
                    questionId: question1.id,
                    choiceId: question1choice.id,
                }
            });
            
        }
        // Create questions

        // Create more questions, choices, and other entities as needed

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();