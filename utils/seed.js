
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const questions = [
    {
        title: 'What is the purpose of a retrospective meeting in Agile?',
        choices: {
          choice1: 'To reflect on the previous iteration and identify areas for improvement.',
          choice2: 'To allocate tasks and assign responsibilities for the upcoming iteration.',
          choice3: 'To present the final product to stakeholders and gather feedback.',
          choice4: 'To conduct a thorough review of the project requirements.',
        },
      },
      {
        title: 'What is the definition of done (DoD) in Agile?',
        choices: {
          choice1: 'The agreed-upon set of criteria that must be met for a user story to be considered complete.',
          choice2: 'A detailed plan outlining the tasks required to complete a project.',
          choice3: 'The final stage in the Agile SDLC where the software is deployed to production.',
          choice4: 'The documentation produced during the software development process.',
        },
      },
      {
        title: 'What is the purpose of user stories in Agile?',
        choices: {
          choice1: 'To capture functional requirements from the perspective of end users.',
          choice2: 'To define technical specifications and implementation details.',
          choice3: 'To create a visual representation of the software system architecture.',
          choice4: 'To estimate the effort and duration of each project task.',
        },
      },
      {
        title: 'What is the role of the product owner in Agile?',
        choices: {
          choice1: 'To represent the interests of stakeholders, prioritize work, and define the product vision.',
          choice2: 'To manage the development team and ensure adherence to Agile practices.',
          choice3: 'To perform quality assurance testing and ensure the software meets the required standards.',
          choice4: 'To create user documentation and provide training to end users.',
        },
      },
      {
        title: 'What is the purpose of velocity in Agile?',
        choices: {
          choice1: 'To measure the amount of work a team can complete in a given iteration.',
          choice2: 'To estimate the overall cost and budget of the project.',
          choice3: 'To track the time spent by each team member on specific tasks.',
          choice4: 'To assess the level of customer satisfaction with the delivered software.',
        },
      },
      {
        title: 'What is the key difference between Scrum and Kanban in Agile?',
        choices: {
          choice1: 'Scrum uses time-boxed iterations, while Kanban follows a continuous flow approach.',
          choice2: 'Scrum places emphasis on self-organizing teams, while Kanban relies on strict hierarchical structures.',
          choice3: 'Scrum focuses on optimizing the flow of work, while Kanban emphasizes fixed deadlines and deliverables.',
          choice4: 'Scrum is suitable for small projects, while Kanban is more suitable for large-scale enterprise projects.',
        },
      },
      {
        title: 'What is the purpose of a burndown chart in Agile?',
        choices: {
          choice1: "To visualize the team's progress and track the remaining work throughout the iteration.",
          choice2: 'To schedule and allocate resources for the project tasks.',
          choice3: 'To evaluate the performance of individual team members.',
          choice4: 'To capture and document all changes made to the software code.',
        },
      },
      {
        title: 'What is the concept of continuous integration (CI) in Agile?',
        choices: {
          choice1: 'The practice of merging code changes into a shared repository frequently to detect integration issues early.',
          choice2: 'The process of continuously deploying new features and updates to end users.',
          choice3: 'The method of continuously testing the software for defects and issues.',
          choice4: 'The technique of continuously gathering feedback from stakeholders to inform development decisions.',
        },
      },
      {
        title: 'What is the role of a quality assurance (QA) analyst in Agile?',
        choices: {
          choice1: 'To ensure that the software meets the required quality standards through testing and validation.',
          choice2: 'To manage the project budget and track financial metrics.',
          choice3: 'To create and maintain the project schedule and timeline.',
          choice4: 'To facilitate communication and collaboration within the development team.',
        },
      },
      {
        title: 'What is the purpose of a product backlog in Agile?',
        choices: {
          choice1: 'To capture and prioritize all desired features and requirements for the software product.',
          choice2: 'To document all bugs and issues encountered during the development process.',
          choice3: "To provide an overview of the team's progress and performance metrics.",
          choice4: 'To create a detailed breakdown of tasks required for each user story.',
        },
      },
    {
        title: 'What is the purpose of a daily stand-up meeting in Agile?',
        choices: {
          choice1: 'To provide a brief status update, discuss progress, and identify any obstacles.',
          choice2: 'To conduct a thorough review of the project requirements.',
          choice3: 'To assign tasks and track individual performance.',
          choice4: 'To create comprehensive documentation and progress reports.',
        },
      },
      {
        title: 'What is the concept of minimum viable product (MVP) in Agile?',
        choices: {
          choice1: 'A version of a product with the minimal features required to satisfy early customers and gather feedback.',
          choice2: 'The final release of the product with all planned features implemented.',
          choice3: 'A prototype of the product used for usability testing and validation.',
          choice4: 'A document outlining the high-level scope and objectives of the project.',
        },
      },
      {
        title: 'What is the purpose of continuous improvement in Agile?',
        choices: {
          choice1: "To regularly assess and enhance the team's processes and practices for increased efficiency and effectiveness.",
          choice2: 'To allocate resources and track project costs.',
          choice3: 'To analyze and document the project risks and mitigation strategies.',
          choice4: 'To ensure that the software meets the required quality standards through rigorous testing.',
        },
      },
      {
        title: 'What is the definition of sprint in Agile?',
        choices: {
          choice1: 'A time-boxed iteration during which the development team completes a set of planned work.',
          choice2: 'A meeting where stakeholders provide feedback and review the progress of the project.',
          choice3: 'A detailed plan outlining the tasks required to complete a project.',
          choice4: 'A document that outlines the acceptance criteria for each user story.',
        },
      },
      {
        title: 'What is the role of the development team in Agile?',
        choices: {
          choice1: 'To design, develop, and test the software product according to the defined requirements.',
          choice2: 'To manage the project budget and timeline.',
          choice3: 'To facilitate communication and collaboration within the team.',
          choice4: 'To prioritize and refine the product backlog.',
        },
      },
      {
        title: 'What is the purpose of a sprint retrospective in Agile?',
        choices: {
          choice1: 'To review the previous sprint, identify strengths and weaknesses, and plan for improvements.',
          choice2: 'To allocate tasks and track individual performance.',
          choice3: 'To validate the software against the specified requirements and acceptance criteria.',
          choice4: 'To present the final product to stakeholders and gather feedback.',
        },
      },
      {
        title: 'What is the role of a business analyst in Agile?',
        choices: {
          choice1: 'To gather and document requirements, analyze user needs, and facilitate communication between stakeholders and the development team.',
          choice2: 'To develop the software and write code.',
          choice3: 'To create and execute test cases to ensure the quality of the software.',
          choice4: 'To create user documentation and provide training to end users.',
        },
      },
      {
        title: 'What is the purpose of backlog refinement in Agile?',
        choices: {
          choice1: 'To review, prioritize, and prepare user stories for future sprints.',
          choice2: 'To assess the performance and productivity of the development team.',
          choice3: 'To conduct a thorough review of the project requirements.',
          choice4: 'To create a visual representation of the software system architecture.',
        },
      },
      {
        title: 'What is the role of a stakeholder in Agile?',
        choices: {
          choice1: 'To represent the interests of individuals or groups affected by the project and provide input and feedback.',
          choice2: 'To manage the development team and ensure adherence to Agile practices.',
          choice3: 'To perform quality assurance testing and ensure the software meets the required standards.',
          choice4: 'To create and maintain the project schedule and timeline.',
        },
      },
      {
        title: 'What is the purpose of the product increment in Agile?',
        choices: {
          choice1: 'To deliver a working and potentially shippable product functionality at the end of each sprint.',
          choice2: 'To document all changes made to the software code.',
          choice3: 'To estimate the overall cost and budget of the project.',
          choice4: 'To track the time spent by each team member on specific tasks.',
        },
      },
  
    {
      title: 'What is the role of a scrum master in Agile?',
      choices: {
        choice1: 'To facilitate the scrum process, remove obstacles, and ensure the team follows Agile principles and practices.',
        choice2: 'To manage the project budget and track financial metrics.',
        choice3: 'To create and maintain the project schedule and timeline.',
        choice4: 'To perform quality assurance testing and ensure the software meets the required standards.',
      },
    },
    {
      title: 'What is the purpose of story points in Agile?',
      choices: {
        choice1: 'To estimate the relative effort and complexity of user stories during sprint planning.',
        choice2: 'To capture and prioritize all desired features and requirements for the software product.',
        choice3: 'To create a detailed breakdown of tasks required for each user story.',
        choice4: 'To evaluate the performance of individual team members.',
      },
    },
    {
      title: 'What is the concept of continuous delivery (CD) in Agile?',
      choices: {
        choice1: 'The ability to release new features and updates to production quickly and reliably.',
        choice2: 'The process of continuously testing the software for defects and issues.',
        choice3: 'The method of continuously gathering feedback from stakeholders to inform development decisions.',
        choice4: 'The technique of continuously optimizing the software performance and scalability.',
      },
    },
    {
      title: 'What is the purpose of a product vision in Agile?',
      choices: {
        choice1: 'To provide a clear and inspiring direction for the development team and stakeholders.',
        choice2: 'To assign tasks and track individual performance.',
        choice3: 'To define technical specifications and implementation details.',
        choice4: 'To validate the software against the specified requirements and acceptance criteria.',
      },
    },
    {
      title: 'What is the role of the customer in Agile?',
      choices: {
        choice1: 'To provide feedback, clarify requirements, and validate the delivered software.',
        choice2: 'To manage the development team and ensure adherence to Agile practices.',
        choice3: 'To create user documentation and provide training to end users.',
        choice4: 'To facilitate communication and collaboration within the development team.',
      },
    },
    {
      title: 'What is the purpose of a sprint review in Agile?',
      choices: {
        choice1: 'To demonstrate the completed work to stakeholders and gather feedback.',
        choice2: 'To allocate tasks and assign responsibilities for the upcoming iteration.',
        choice3: 'To conduct a thorough review of the project requirements.',
        choice4: 'To create comprehensive documentation and progress reports.',
      },
    },
    {
      title: 'What is the concept of test-driven development (TDD) in Agile?',
      choices: {
        choice1: 'The practice of writing tests before writing the corresponding production code.',
        choice2: 'The practice of continuously integrating and testing code changes.',
        choice3: 'The technique of creating test cases based on user stories and acceptance criteria.',
        choice4: 'The approach of involving testers from the beginning of the software development process.',
      },
    },
    {
      title: 'What is the purpose of a definition of ready (DoR) in Agile?',
      choices: {
        choice1: 'To ensure that user stories are well-defined and ready for development in a sprint.',
        choice2: 'To document all bugs and issues encountered during the development process.',
        choice3: 'To evaluate the performance and productivity of the development team.',
        choice4: 'To track the time spent by each team member on specific tasks.',
      },
    },
    {
      title: 'What is the role of the product owner in Agile?',
      choices: {
        choice1: 'To represent the stakeholders, define and prioritize the product backlog, and ensure the value is delivered.',
        choice2: 'To design, develop, and test the software product according to the defined requirements.',
        choice3: 'To create and execute test cases to ensure the quality of the software.',
        choice4: 'To create and maintain the project schedule and timeline.',
      },
    },
    {
      title: 'What is the purpose of a burn-up chart in Agile?',
      choices: {
        choice1: 'To visualize the progress and scope changes of a project over time.',
        choice2: 'To allocate resources and track project costs.',
        choice3: 'To estimate the overall cost and budget of the project.',
        choice4: 'To create a visual representation of the software system architecture.',
      },
    },
  ];

async function seed() {
    try {
        // Create pool
        const pool1 = await prisma.pool.upsert({
            where: { name: 'Programming' },
            update: {
                numberOfQuestions: {
                    increment: 30
                }
            },
            create: {
                name: 'Programming',
                numberOfQuestions: 30
            },
        });

        const findCat = await prisma.category.findUnique({
            where: {
                name_poolId: {

                    name: 'Agile SDLC',
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
                        increment: 30
                    }
                }
            });
            category1 = findCat;
        } else {
            category1 = await prisma.category.create({

                data: {
                    name: 'Agile SDLC',
                    poolId: pool1.id,
                    numOfQuestions: 30
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
        for (let index = 0; index < questions.length; index++) {
            const q = questions[index]
            const question1 = await prisma.questions.create({
                data: {
                    status: 'approved',
                    title: q.title,
                    catId: category1.id,
                    poolId: pool1.id,
                    contributorId: contributor1.id,
                },
            });
    
            // Create choices for question1
    
            const question1choices = await prisma.choice.createMany({
                data: [
                    {
                        title: q.choices.choice2,
                        questionId: question1.id,
                    },
                    {
                        title:  q.choices.choice3,
                        questionId: question1.id,
                    },
                    {
                        title: q.choices.choice4,
                        questionId: question1.id,
                    }
                ],
            });
    
    
            const question1choice = await prisma.choice.create({
                data: {
                    title: q.choices.choice1,
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