<template>
     <div v-if="selectedQuestion && isOpen" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
    <div v-if="selectedQuestion && isOpen"
                    class="absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] max-w-full h-[100%]  ">
                    <div class="p-3 flex-col bg-white rounded-xl">
                        <div class="">
                            <button @click="onToggle" class="float-right px-1">
                                <Icon name="eva:close-outline" class="w-8 h-8 text-red-600"></Icon>
                            </button>
                        </div>
                        <div
                            class="p-5 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[70em] max-w-[70em] flex h-[50vh] opacity-100 gap-4 text-lg">
                            <div class="flex-1 overflow-scroll">
                                <div v-html="selectedQuestion.title" class="py-5" />
                                <img v-if="selectedQuestion.image" :src=selectedQuestion.image
                                    style="width: 10em; height: 10em;" />
                                <div v-for="choice in selectedQuestion.choices" :key="choice.id" class="ml-5">

                                    <div class="flex flex-row align-middle my-1 mt-5 ml-5">
                                        <input id="radio_1" type="radio" name="radio" :value="choice.id"
                                            v-model="selectedQuestion.correctAnswer" :disabled="true">
                                        <label class="pl-2 " for="radio_1">


                                            <div v-html="choice.title" class="px-2"></div>
                                            <img v-if="choice.image" :src=choice.image
                                                style="width: 10em; height: 10em;" />

                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex" :class="{'fixed w-full' : selectedQuestion && isOpen}">
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6 content middle mt-20 ">
                <div class=" rounded-md mt-5 p-5 ">
                    <div class="flex flex-row  align-middle ">
                        <NuxtLink :to="`/admin/exams`">
                            <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                        </NuxtLink>
                        <h2 class="intro-y text-lg font-medium ">Exam Detail</h2>
                    </div>
                </div>
                

                <div class="container mx-auto py-8 align-middle justify-center items-center ">
                    <div v-if="exam">
                        <div class="flex flex-row justify-between">

                            <h1 class="text-4xl font-bold ml-6">{{ exam.name }}</h1>
                            <div class="flex flex-row justify-end">
                                <button v-if="exam.status === 'gradeReleased' " class="btn box flex items-center text-slate-600 dark:text-slate-300 shadow" @click="exportExam()">  <Icon name="material-symbols:export-notes-outline" class="hidden sm:block w-4 h-4 mr-2 text-primary"></Icon> Export PDF </button>

                                <button v-if="publishBtn" class="btn btn-success shadow-md mt-5 mr-4 text-white"
                                    @click="publishExam">Publish</button>
                                <button v-if="unpublishBtn" class="btn btn-success shadow-md mt-5 mr-4 text-white"
                                    @click="unPublishExam">Un Publish</button>
                            </div>



                        </div>
                    </div>


                   
                    
                        <!-- <div v-if="selectedQuestion && isOpen" class="opacity-25 fixed inset-0 z-40 bg-black"></div> -->
                    
                    <div class="mt-8 grid grid-cols-2 gap-6  shadow-lg">
                        <div>



                            <div v-if="exam">
                                <div class="grid grid-cols-3 gap-6">
                                    <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                        <div class="mx-2">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <!-- <Icon name="lucide:calendar-check"
                                                        class="h-12 w-12  my-2 text-primary align-middle"></Icon> -->
                                                    <Icon v-if="exam.status === 'published'"
                                                        name="ic:baseline-published-with-changes"
                                                        class="w-12 h-12 text-primary"></Icon>
                                                    <Icon v-else-if="exam.status === 'gradeReleased'"
                                                        name="material-symbols:new-releases" class="w-12 h-12 text-success">
                                                    </Icon>
                                                    <Icon v-else-if="exam.status === 'generated'" name="ri:ai-generate"
                                                        class="w-12 h-12 text-warning"></Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-lg font-bold text-gray-500">Status</h2>
                                                    <div class="flex items-center justify-center text-md" :class="{
                                                        'text-warning': exam.status === 'generated',
                                                        'text-primary': exam.status === 'published',
                                                        'text-success': exam.status === 'gradeReleased',

                                                    }">



                                                        {{ examStatus(exam.status) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                        <div class="mx-4">

                                            <div class="flex flex-row justify-between  space-x-6  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="material-symbols:alarm"
                                                        class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-lg font-bold text-gray-500">Duration</h2>
                                                    <p class="text-3xl font-bold text-gray-800">{{ exam.duration }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                        <div class="mx-2">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="mdi:message-question-outline"
                                                        class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-lg font-bold text-gray-500">Questions</h2>
                                                    <p class="text-3xl font-bold text-gray-800">{{ exam.numberOfQuestions }}
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                </div>
                                <div class="grid grid-cols-2 gap-6 mt-5">


                                    <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                        <div class="mx-2">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="lucide:calendar"
                                                        class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-lg font-bold text-gray-500">Testing</h2>
                                                    <p class="text-md font-bold text-gray-800">
                                                        {{ exam.examReleaseDate.toDateString() }}</p>
                                                    <p class="text-md  text-gray-700">
                                                        {{ exam.examReleaseDate.toLocaleTimeString() }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                        <div class="mx-2">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="lucide:calendar-check"
                                                        class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-lg font-bold text-gray-500">Release</h2>
                                                    <p class="text-md font-bold text-gray-800">
                                                        {{ exam.examReleaseDate.toDateString() }}</p>
                                                    <p class="text-md  text-gray-700">
                                                        {{ exam.examReleaseDate.toLocaleTimeString() }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="grid grid-cols-2 gap-6 mt-4 ">
                                    <div class="align-middleh-full justify-between mt-5 py-4">
                                        <div class="bg-white rounded-lg m-6 p-6 justify-center hover:bg-gray-100">
                                            <div class="mx-4">

                                                <div class="flex flex-row justify-between  space-x-6 ">
                                                    <NuxtLink :to="`/admin/pools/${exam.pool.id}`">

                                                        <div class=" align-middle ">
                                                            <h2 class="text-lg font-bold text-gray-500">Pool</h2>
                                                            <p class="text-3xl font-bold text-gray-800">{{
                                                                exam.pool.name.length > 15 ? exam.pool.name.slice(0, 14) +
                                                            '...' : exam.pool.name }}
                                                            </p>
                                                        </div>
                                                    </NuxtLink>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-white rounded-lg  p-6 justify-center hover:bg-gray-100 mt-10 m-6">
                                            <div class="mx-4">

                                                <div class="flex flex-row justify-between  space-x-6 ">
                                                    <NuxtLink :to="`/admin/examGroups/${exam.examGroup.id}`">

                                                        <div class=" align-middle ">
                                                            <h2 class="text-lg font-bold text-gray-500">Exam Group</h2>
                                                            <p class="text-3xl font-bold text-gray-800">{{
                                                                exam.examGroup.name.length > 15 ?
                                                                exam.examGroup.name.slice(0, 14) + '...' :
                                                                exam.examGroup.name }}
                                                            </p>
                                                        </div>
                                                    </NuxtLink>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="mt-4" v-if="analytics">
                                        <Doughnut :data="analytics.statusDistribution.data"
                                            :options="analytics.statusDistribution.options" />
                                    </div>


                                </div>
                            </div>


                        </div>

                        <div class="align-middle items-center  my-auto h-full justify-center" v-if="analytics">
                            <div v-if="analytics.highestGrade && analytics.lowestGrade && analytics.averageGrade"
                                class="bg-white rounded-lg shadow-lg p-6 justify-center mt-4 mb-2 mx-auto ">
                                <div class="flex flex-row items-center mx-auto justify-between w-3/4">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-green-700 rounded-full flex-shrink-0"></div>
                                        <div class="ml-2">
                                            <p class="text-gray-600"> Highest Grade</p>
                                            <p class="text-lg font-semibold">{{ analytics.highestGrade.toFixed(2) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-yellow-700 rounded-full flex-shrink-0"></div>
                                        <div class="ml-2">
                                            <p class="text-gray-600"> Average Grade</p>
                                            <p class="text-lg font-semibold">{{ analytics.averageGrade.toFixed(2) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-red-700 rounded-full flex-shrink-0"></div>
                                        <div class="ml-2">
                                            <p class="text-gray-600"> Lowest Grade</p>
                                            <p class="text-lg font-semibold">{{ analytics.lowestGrade.toFixed(2) }}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="grid grid-cols-2 gap-6">
                              

                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="mx-4">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="streamline:interface-user-check-actions-close-checkmark-check-geometric-human-person-single-success-up-user"
                                                    class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-lg font-bold text-gray-500">Test Takers</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.totalTestTakers }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="mx-4">

                                        <div class="flex flex-row justify-between  space-x-6  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="streamline:interface-favorite-award-ribbon-reward-like-social-rating-media"
                                                    class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-lg font-bold text-gray-500">Pass Grade</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.passGrade }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="mx-4">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="iconoir:group"
                                                    class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-lg font-bold text-gray-500">Registered Test Takers</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.registeredTestTakers }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="mx-4">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:check-decagram-outline"
                                                    class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-lg font-bold text-gray-500">Pass Rate</h2>
                                                <p class="text-2xl font-bold text-gray-800"
                                                    v-if="analytics.percentagePassed">{{
                                                        analytics.percentagePassed.toFixed(2) }}%</p>
                                                <p v-else>-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div v-if="analytics.highestGrade && analytics.lowestGrade && analytics.averageGrade">
                                <div class="bg-white rounded-lg  p-6 mt-3">
                                    <h3 class="text-2xl font-bold mb-4 text-gray-600">Correct Answer Performance
                                    </h3>
                                    <div class="space-y-4">

                                        <div class="flex flex-row justify-between ">

                                            <p class="text-left font-bold text-gray-500 text-lg pb-2">Question</p>

                                            <p class="text-center font-bold text-gray-500 text-lg">Percentage of Test Takers
                                            </p>
                                        </div>

                                        <div
                                            class="overflow-y-scroll bg-white rounded-xl h-[20vh] opacity-100 text-lg justify-between w-full">

                                            <div v-for="(question, index) in analytics.highestPerformingQuestions"
                                                :key="index" class="flex flex-col">
                                                <div></div>
                                                <div class="flex flex-row w-full justify-between my-2">
                                                    <div>

                                                        <button @click="setQ(question)">
                                                            <div v-html="question.title" class="" />
                                                        </button>
                                                    </div>

                                                    <div class="text-right w-4/12">
                                                        <div class="relative h-2 bg-gray-200 rounded">
                                                            <div class="absolute top-0 left-0 h-2 rounded"
                                                                :style="{ width: question.percentageCorrect + '%' }">
                                                                <div class="h-2 rounded "
                                                                    :class="{ 
                                                                        'bg-green-50': question.percentageCorrect < 10, 
                                                                        'bg-green-100': question.percentageCorrect > 10 && question.percentageCorrect < 20, 
                                                                        'bg-green-200': question.percentageCorrect > 20 && question.percentageCorrect < 30, 
                                                                        'bg-green-300': question.percentageCorrect > 30 && question.percentageCorrect < 40, 
                                                                        'bg-green-400': question.percentageCorrect > 40 && question.percentageCorrect < 50, 
                                                                        'bg-green-500': question.percentageCorrect > 50 && question.percentageCorrect < 60, 
                                                                        'bg-green-600': question.percentageCorrect > 60 && question.percentageCorrect < 70, 
                                                                        'bg-green-700': question.percentageCorrect > 70 && question.percentageCorrect < 80, 
                                                                        'bg-green-800': question.percentageCorrect >= 80 }">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span class="text-gray-700 text-sm">{{
                                                            question.percentageCorrect.toFixed(2)
                                                        }}%</span>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="w-full text-center text-lg align-middle justify-center items-center my-auto mt-20 h-full">
                                No Exam Analytics yet
                            </div>


                        </div>

                    </div>


                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import { Chart, registerables } from 'chart.js';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();
const selectedQuestion = ref();
const isOpen = ref(false);
const setQ = (question: { id: string; title: string; percentageCorrect: number, image: string, correctAnswer: string, choices: any }) => {
    selectedQuestion.value = question
    isOpen.value = true;
}
const onToggle = () => {
    isOpen.value = !isOpen.value
    selectedQuestion.value = null
};

const route = useRoute();
// current exam id
const id = route.params.id as string;

// fetch exam by id

const exam = await $client.exam.getExam.query({ id: id });
const analytics = await $client.analytics.getExamAnalytics.query({ examId: id });


// unpublish the published exam if the exam hasn't started yet (change status to generated)

const publishBtn = ref(true);
const unpublishBtn = ref(false);
//  at the time of the test they both are disabled

const twoDaysLater = exam && new Date(exam.testingDate.getTime() + 2 * 24 * 60 * 60 * 1000);

// if exam grade is released then no publish exam
if (exam!.status === 'published' || exam!.status === 'gradeReleased') {
    publishBtn.value = false;

}
// if exam is published and the testing date is in the future then unpublishing exam is possible
if (exam?.status === 'published' && exam?.testingDate > new Date()) {
    unpublishBtn.value = true;
    
}

// export exam  to pdf
const exportExam = async ()=>{
    const response = await $client.exam.exportExamToPdf.query({ id: id });

     // Handle the response
     const pdfBlob = new Blob([response], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl);
};

// publish the generated exam if the exam hasn't started yet (change status to published)
const publishExam = async () => {

    const updatedExam = await $client.exam.publishExam.mutate({ id: id });
    
    publishBtn.value = false;
    // if the exam is published and the testing date is in the future then unpublishing exam is possible
    if (updatedExam && updatedExam.status === 'published' ) {
        unpublishBtn.value = true;
    }
    else {
        unpublishBtn.value = false;
    }
    window.location.reload();

};

// unpublish the published exam if the exam hasn't started yet (change status back to generated)
const unPublishExam = async () => {

    const updatedExam = await $client.exam.unPublishExam.mutate({ id: id });
    unpublishBtn.value = false;
    // if the exam is generated and the testing date is in the future then publishing exam after unpublishing it is possible
    if (updatedExam.status === 'generated') {
        publishBtn.value = true;
    }
    else {
        publishBtn.value = false;
    }
    window.location.reload();
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)
const examStatus = (status: string) => {
    if (status === 'published') {
        return 'Published';
    } else if (status === 'gradeReleased') {
        return 'Grade Released';
    }
    else if (status === 'generated') {
        return 'Generated';
    }
    else {
        return 'UnPublished';
    }

}


</script>
<style scoped>
.middle {
    margin-left: 13vmax;
}
.w-full.overflow-y-auto {
  height: calc(100vh - 4rem - 3.5rem); /* Adjust the height according to your needs */
}
</style>