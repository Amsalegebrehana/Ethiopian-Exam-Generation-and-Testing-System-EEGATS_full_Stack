<script setup lang="ts">
import { useQuestionListStore, checkListInterface } from '~~/stores/questions';
definePageMeta({ middleware: 'is-testtaker' })
export interface questionInterface {
    choices: {
        id: string;
        title: string;
        image: string | null;
    }[];
    selectedAnswer: string;
    id: string;
    title: string;
    image: string | null;
    changed: boolean;
    loaded: boolean;
}
const route = useRoute();
const online = useOnline()
const testTakerId = route.params.id as string;
const examId = route.params.eid as string;
const showInstructionModal = ref(true);
const showReviewMessage = ref(false);
const showErrorText = ref(false);
const { $client } = useNuxtApp();
const { data: examDetails, pending: examDetailsPending } = await useAsyncData(() => $client.testtaker.getExamDetails.query({ testTakerId, examId }));
const { data: testSession, pending: testSessionPending } = await useAsyncData(() => $client.testtaker.getTestSession.query({ testTakerId, examId }));
if(testSession.value !== null &&  testSession.value.isSubmitted){
    navigateTo(`/testtaker/${testTakerId}/exams`)
}
const idx = ref(testSession?.value?.currentQuestion ?? 0);
const question = ref();
const timeLeft = ref();
const isLoadingRegisterResponse = ref(false);
const isLoadingSubmitExam = ref(false);
const resuming = ref(false);
const creatingSession = ref(false);
const loadingQuestion = ref(false);
const questionListStore = useQuestionListStore();
const handlesubmit = () => {
    isLoadingSubmitExam.value = true;
    $client.testtaker.submitExam.mutate({ testTakerId, examId });
    navigateTo(`/testtaker/${testTakerId}/exams`)
}
const loadQuestion = async () => {
    loadingQuestion.value = true;
    const { data: checklist } = await useAsyncData(() => $client.testtaker.getExamChecklist.query({ testTakerId, examId }));
    if (checklist) {
        questionListStore.setQuestionList(checklist as unknown as checkListInterface[]);
    }
    const { data } = await useAsyncData(() => $client.testtaker.getExamQuestions.query({ testTakerId, examId, currentIndex: idx.value }));
    question.value = data;
    question.value.loaded = true;
    loadingQuestion.value = false;
}
const navigateQ = async (direction: string, changed: boolean, selectedAnswer?: string, questionId?: string) => {
    if (changed) {
        isLoadingRegisterResponse.value = true;
        const res = await regiseterResponse(selectedAnswer as string, questionId as string);
        isLoadingRegisterResponse.value = false;
        if (!res) {
            showErrorText.value = true;
        }
        else {
            questionListStore.regiseterResponse(questionId as string, selectedAnswer as string);
            if (direction == 'next') {
                await nextQ();
            }
            else {
                await prevQ();
            }

        }
    } else {
        if (direction == 'next') {
            await nextQ();
        }
        else {
            await prevQ();
        }
    }

}
const setQ = async (index: number) => {
    showReviewMessage.value = false;
    idx.value = index;
    await loadQuestion();
}
const prevQ = async () => {
    if (idx.value > 0) {
        idx.value--;
    }
    await loadQuestion();
}
const nextQ = async () => {
    if (examDetails.value) {
        if (idx.value < examDetails?.value?.numberOfQuestions - 1) {
            idx.value++;
            await loadQuestion();
        } else if (idx.value === examDetails?.value?.numberOfQuestions - 1) {
            showReviewMessage.value = true;
            idx.value = -1;
        }
    }

}
const regiseterResponse = async (choiceId: string, questionId: string) => {
    if (online.value) {
        return await $client.testtaker.registerResponse.mutate({ testTakerId, examId, questionId, choiceId, currentIndex: idx.value });
    } else {
        return false;
    }
}
const handleStartExam = async () => {
    creatingSession.value = true;
    try{
        const res =  await $client.testtaker.createTestSession.mutate({ testTakerId, examId });
        if(res){
            testSession.value = res;
            creatingSession.value = false;
            handleResumeSession();
        }
    }catch(e){
        creatingSession.value = false;
       showErrorText.value = true; 
    }
}
const handleResumeSession = async () => {
    resuming.value = true;
    await loadQuestion();
    if (examDetails.value) {

        if (examDetails.value.globalTime > 0) {
            timeLeft.value = examDetails.value.globalTime;
            startCountDown();
        }
        else {
            handlesubmit();
        }

    }
    showInstructionModal.value = false;
    resuming.value = false;
}
const startCountDown = () => {
    setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            handlesubmit();
        }
    }, 1000)
}
const hours = computed(() => {
    return Math.floor(timeLeft.value / 3600)
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
const numEntries = examDetails.value?.numberOfQuestions || 0;

const numRows = Math.ceil(numEntries / 5);
const numCols = 5;

const tableData = computed(() => {
    let number = 1;
    const tableData = [];

    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            if (number <= numEntries) {
                row.push(number.toString().padStart(numEntries.toString().length, '0') );
                number++;
            }
        }
        tableData.push(row);
    }


    return tableData;
},
);

const disableCopyPaste = () => {
    // Disable context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Check for copy shortcut and ctr+shift+i
        if ((e.ctrlKey && e.key == "c") || (e.ctrlKey && e.shiftKey && e.key == "I")) {
        e.preventDefault();
    }
  });
};

onMounted(() => {
  disableCopyPaste();
});
</script>

<template>
    <div>

        <TopBar role="testtaker" :id="testTakerId" />
        <div class="flex">
    
            <div v-if="examDetails && testSession" class="w-full mx-20 mt-24">
    
                <div class="flex flex-row  mb-3 mx-3">
                    <Icon name="iconoir:page" class="w-8 h-8 mr-2 ml-10"></Icon>
                    <p class="text-3xl font-md">{{ examDetails.name }}</p>
                </div>
    
                <div class="flex flex-row">
    
                    <div class="w-8/12 ml-16">
                        <div v-if="!showReviewMessage">
                            <div v-if="question && question.loaded">
    
                                <form>
    
                                    <div class="p-4">
                                        <div v-html="question.value.title" class="p-2 text-xl my-2"></div>
                                        <img v-if="question.value.image" :src=question.value.image class="ml-3"
                                            style="width: 10em; height: 10em; " />
                                    </div>
    
                                    <div v-for="choice in question.value.choices" :key="choice.id" class="ml-10">
    
                                        <div class="flex flex-row align-middle my-3">
                                            <input id="radio_1" type="radio" name="radio" :value="choice.id"
                                                v-model="question.value.selectedAnswer" @change="question.value.changed = true">
                                            <label class="pl-2 " for="radio_1">
    
    
                                                <div v-html="choice.title" class="px-2 text-lg -mt-1"></div>
                                                <img v-if="choice.image" :src=choice.image style="width: 10em; height: 10em;" />
    
                                            </label>
                                        </div>
                                    </div>
                                </form>
                                <div class="flex flex-row my-5 w-10/12 ">
                                    <!-- <div v-if="idx > 0" class="py-2 ml-auto w-1/12">
                                         <button @click="navigateQ('prev', question.value.changed, question.value.selectedAnswer, question.value.id)" class="btn btn-primary" :disabled="isLoadingRegisterResponse">Previous</button>
                                     </div> -->
                                    <div v-if="idx < examDetails.numberOfQuestions" class="py-3 ml-auto w-1/12 mb-20">
                                        <button
                                            @click="navigateQ('next', question.value.changed, question.value.selectedAnswer, question.value.id)"
                                            class="btn btn-primary py-2" :disabled="isLoadingRegisterResponse">
                                            <div v-if="isLoadingRegisterResponse">
                                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6 text-white"></Icon>
                                            </div>
                                            <div v-else class="text-xl">
                                                Next
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                        <div v-else>
                            <div
                                class="text-center mx-auto my-auto justify-center align-text-middle items-center h-screen">
                                <div class="my-40">
    
                                    <h1 class="text-3xl font-bold ">
                                        Make sure you have reviewed all questions before submitting the exam.
                                    </h1>
                                    <button @click="handlesubmit" class="btn btn-primary text-xl p-3 mt-10" :disabled="isLoadingSubmitExam">
                                        <div v-if="isLoadingSubmitExam">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Submit Exam
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-3/12 ">
                        <div class="w-full">
                            <p class="font-bold text-2xl text-center py-5">Time Left :- {{ hours }}:{{ minutes }}:{{ seconds }}
                            </p>
                        </div>
                        <div class="w-9/12 mx-20 shadow-lg py-5 rounded-xl">
                            <div class="bg-primary  text-white text-center text-xl py-5 px-auto rounded-t-xl">
                                Exam Navigation
                            </div>
                            <table class="w-8/12 my-5 mx-auto">
                                <tbody>
                                    <tr v-for="row in tableData">
                                        <td v-for="cell in row" class="table-cell">
                                            <button class="button p-2" @click="setQ(parseInt(cell) - 1)"
                                                :class="{ 'font-bold bg-primary text-white text-lg': idx + 1 === parseInt(cell), 'bg-blue-400 text-lg text-white font-bold': questionListStore.getIsQuestionAnswered(parseInt(cell) - 1), 'bg-gray-300 text-lg font-bold': !questionListStore.getIsQuestionAnswered(parseInt(cell) - 1) }">{{
                                                    cell }}</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
    
    
                    </div>
    
    
    
                </div>
            </div>
        </div>
    
        <div v-if="showInstructionModal"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-screen h-screen my-6 mx-auto max-w-10xl">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
    
                    <!--body-->
                    <div class="relative p-6 flex-auto">
    
    
    
                        <p class="align-middle my-auto font-bold text-lg text-center pt-20 pb-10">{{ examDetails?.name }} Exam
                            Instructions</p>
                        <div class=" mx-auto px-16">
    
                            <ul class="list-disc">
                                <li class="py-1 text-base">The examination will comprise of {{ examDetails?.numberOfQuestions }}
                                    Multiple Choice Questions</li>
                                <li class="py-1 text-base">The duration of this exam is {{ examDetails?.duration }} minutes
                                </li>
                                <li class="py-1 text-base">You are not permitted to obtain assistance by improper means or ask
                                    for help from or give help to any other person. </li>
                                <li class="py-1 text-base">You are not permitted to take screenshots, record the screen, copy
                                    and paste questions or answers or otherwise attempt to take any of the content of this exam
                                    out of the exam for any purpose. </li>
                                <li class="py-1 text-base">Answer all questions to the best of your ability and perception. Good
                                    Luck! </li>
                            </ul>
                        </div>
    
    
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
    
                        <div v-if="testSession">
                            <div v-if="!(resuming || creatingSession)">
                                <button @click="handleResumeSession()"
                                    class="bg-primary rounded-xl text-white py-3 px-4 text-center">
    
    
                                    Resume Exam
    
                                </button>
    
                            </div>
    
                        </div>
                        <div v-else>
    
                            <button @click="handleStartExam()" class="bg-primary rounded-xl text-white py-3 px-4 text-center">
                                <div v-if="resuming || creatingSession">
                                    <Icon name="eos-icons:bubble-loading" class="w-6 h-6 text-white"></Icon>
                                </div>
                                <div v-else>
                                    Start Exam
                                </div>
                            </button>
                        </div>
    
    
    
    
    
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showInstructionModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    
        <div v-if="examDetailsPending || testSessionPending || loadingQuestion"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative  my-6 mx-auto max-w-10xl">
                <!--content-->
                <div class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 rounded-t">
                        <!-- <h3 class="text-3xl font-semibold">
                                                    Modal Title
                                                </h3> -->
                        <!-- <button
                                                    class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button" v-on:click="toggleDeleteModal()">
                                                    <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                                </button> -->
                    </div>
                    <!--body-->
                    <div class="relative p-6 flex-auto">
    
    
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="eos-icons:bubble-loading" class="w-20 h-20 text-primary"></Icon>
    
                        </div>
                    </div>
                    <!--footer-->
    
                </div>
            </div>
        </div>
        <div v-if="examDetailsPending || testSessionPending || loadingQuestion" class="opacity-20 fixed inset-0 z-40 bg-black">
        </div>
    
        <div v-if="!online || showErrorText"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative  my-6 mx-auto max-w-10xl">
                <!--content-->
                <div class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 rounded-t">
                        <!-- <h3 class="text-3xl font-semibold">
                                                    Modal Title
                                                </h3> -->
                        <!-- <button
                                                    class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button" v-on:click="toggleDeleteModal()">
                                                    <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                                </button> -->
                    </div>
                    <!--body-->
                    <div class="relative p-6 flex-auto">
    
    
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <h1 class="text-lg text-center text-red-500">
                                You are offline. Please check your internet connection and try again.
                            </h1>
    
                        </div>
                    </div>
                    <!--footer-->
    
                </div>
            </div>
    </div>
    <div v-if="!online || showErrorText" class="opacity-20 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>
