<script setup lang="ts">
import SingleQuestion from '@/components/testtaker/SingleQuestion.vue'

import { useQuestionListStore , questionInterface} from '~~/stores/questions';
definePageMeta({ middleware: 'is-testtaker' })
const route = useRoute ();
const testTakerId = route.params.id as string;
const examId = route.params.eid as string;
const showInstructionModal = ref(true);
const { $client } = useNuxtApp();
const {data: examDetails} = await useAsyncData(()=> $client.testtaker.getExamDetails.query({testTakerId, examId}));
const {data: testSession} = await useAsyncData(()=> $client.testtaker.getTestSession.query({testTakerId, examId}));

const questionListStore = useQuestionListStore();
const question = computed(() => {
  return questionListStore.questionList[questionListStore.currentQuestion]
})
questionListStore.setTestTaker(testTakerId);
const timeLeft = ref();
const isLoading = ref(false);
const handlesubmit = () => {
    console.log("submitting exam");
    // isLoading.value = true;
    // $client.testtaker.submitExam.mutate({testTakerId, examId});
    // navigateTo( `/testtaker/${testTakerId}/exams`)
}
const loadQuestions = async () => {
    const {data: questions  } = await useAsyncData(()=> $client.testtaker.getExamQuestions.query({testTakerId, examId}));;
    questionListStore.setQuestions(questions as unknown as questionInterface[]);
}
const prevQ = () => {
    questionListStore.setPrevQuestion();
}
const nextQ = () => {
    questionListStore.setNextQuestion();
}

const handleStartExam = async () => {
    await $client.testtaker.createTestSession.mutate({testTakerId, examId});
    handleResumeSession();
    }
const handleResumeSession = async () => {
    
    questionListStore.getQuestionsLength() === 0 && await loadQuestions();
        if(examDetails.value){

            if(examDetails.value.globalTime > 0){
                timeLeft.value = examDetails.value.globalTime;
                startCountDown();
            }
            else{
                handlesubmit();
            }
        
        }
    // setInterval(() => {
    //     questionListStore.decrementTimeTracker();
    //   }, 3000)
    // if(testingDate !== undefined){
    //     questionListStore.setTimeTracker(Date.now() - testingDate);
    // }

    showInstructionModal.value = false;
}
const startCountDown = () => {
    setInterval(() => {
        if(timeLeft.value > 0){
            timeLeft.value--;
        }else{
            handlesubmit();
        }
      }, 1000)
}
const hours = computed(() => {
    return Math.floor(timeLeft.value/ 3600)
        .toString()
        .padStart(2, '0')
});
const minutes = computed(() => {
    return Math.floor((timeLeft.value % 3600) / 60)
        .toString()
        .padStart(2, '0')
});
const seconds = computed(() => {
    return (timeLeft.value % 60).toString().padStart(2, '0')
});

</script>

<template>
    <div>

        <h1>Exam page for test taker</h1>
        {{ examDetails }} 
        {{ timeLeft }}
        <div>{{ hours }}:{{ minutes }}:{{ seconds }}</div>
    
       <!-- {{ questionListStore }} -->
   
        <!-- <CountdownTimer  :duration="questionListStore.timeTracker" @timeout="onTimeout" /> -->
    
         <!-- <div v-if="question">

            <SingleQuestion :question="question" />
         </div> -->
<!-- 
           <div class="flex flex-row mt-5 w-10/12">
<div v-if="questionListStore.currentQuestion > 0"  class="py-2 ml-auto w-1/12">
    <button @click="prevQ" class="btn btn-primary">Previous</button>
</div>
<div v-if="questionListStore.currentQuestion < questionListStore.questionList.length - 1"  class="py-2 ml-auto w-1/12">
    <button @click="nextQ" class="btn btn-primary">Next</button>
</div>
</div> -->

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
                                           Resume Exam
                                        </button>
                </div>
                <div v-else>
                    <!-- TODO add if no error -->
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
