<script setup lang="ts">
import SingleQuestion from '@/components/testtaker/SingleQuestion.vue'
import { useQuestionListStore , itemInterface} from '~~/stores/questions';
definePageMeta({ middleware: 'is-testtaker' })
const route = useRoute ();
const testTakerId = route.params.id as string;
const examId = route.params.eid as string;
const showInstructionModal = ref(true);
const { $client } = useNuxtApp();
const {data: examDetails} = await useAsyncData(()=> $client.testtaker.getExamDetails.query({testTakerId, examId}));
const {data: testSession} = await useAsyncData(()=> $client.testtaker.getTestSession.query({testTakerId, examId}));
const idx = ref(0);

const questionListStore = useQuestionListStore();
questionListStore.setTestTaker(testTakerId);
// const {data: questions  } = await useAsyncData(()=> $client.testtaker.getExamQuestions.query({testTakerId, examId}));;
    // questionListStore.setQuestions(questions as unknown as itemInterface[]);

const isLoading = ref(false);
const handlesubmit = () => {
    // isLoading.value = true;
    // $client.testtaker.submitExam.mutate({testTakerId, examId});
    // navigateTo( `/testtaker/${testTakerId}/exams`)
}

const handleStartExam = async () => {
    await $client.testtaker.createTestSession.mutate({testTakerId, examId});
    const {data: questions  } = await useAsyncData(()=> $client.testtaker.getExamQuestions.query({testTakerId, examId}));;
    questionListStore.setQuestions(questions as unknown as itemInterface[]);
    showInstructionModal.value = false;
    }
const handleResumeSession = async () => {
    const {data: questions  } = await useAsyncData(()=> $client.testtaker.getExamQuestions.query({testTakerId, examId}));;
    questionListStore.setQuestions(questions as unknown as itemInterface[]);
   
    showInstructionModal.value = false;
}
</script>

<template>
    <div>

        <h1>Exam page for test taker</h1>
        {{ examDetails }}
        {{ questionListStore.questionList }}
      
            <!-- {{ questions }} -->
        
            <div v-for="question in questionListStore.getAllQuestions()" :key="question.id" class="px-20">
    

<SingleQuestion :question="question" :model-value="question.selectedAnswer"/>


           </div>
           <button @click="handlesubmit" class="btn btn-primary"> <div v-if="isLoading">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Submit
                                        </div></button>
                    </div>
     
        <div v-if="showInstructionModal"
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex ">
    <div class="relative w-screen h-screen my-6 mx-auto max-w-10xl">
        <!--content-->
        <div
            class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
           
            <!--body-->
            <div class="relative p-6 flex-auto">
            
              
                    
                    <p class="align-middle my-auto font-bold text-lg text-center pt-20 pb-10">{{ examDetails?.name }} Exam Instructions</p>
                    <div class=" mx-auto px-16">

                        <ul class="list-disc">
                            <li class="py-1 text-base">The examination will comprise of {{ examDetails?.numberOfQuestions }} Multiple Choice Questions</li>
                            <li class="py-1 text-base">The duration of this exam is {{ examDetails?.duration }} minutes </li>
                            <li class="py-1 text-base">You are not permitted to obtain assistance by improper means or ask for help from or give help to any other person. </li>
                            <li class="py-1 text-base">You are not permitted to take screenshots, record the screen, copy and paste questions or answers or otherwise attempt to take any of the content of this exam out of the exam for any purpose. </li>
                            <li class="py-1 text-base">Answer all questions to the best of your ability and perception. Good Luck! </li>
                        </ul>
                    </div>
                 
              
            </div>
            <!--footer-->
            <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                                        
                <div v-if="testSession">
                    <button @click="handleResumeSession()"
                                            class="bg-primary rounded-xl text-white py-3 px-4 text-center">
                                           Resume
                                        </button>
                </div>
                <div v-else>
                    <button @click="handleStartExam()"
                                            class="bg-primary rounded-xl text-white py-3 px-4 text-center">
                                            Start Exam
                                        </button>
                </div>

                                     

                             

                                    </div>
        </div>
    </div>
</div>
<div v-if="showInstructionModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>

 
</template>
