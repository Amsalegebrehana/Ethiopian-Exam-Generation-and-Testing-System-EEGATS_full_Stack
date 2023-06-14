<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="examgroups" />
            <div class="w-full mx-6 content middle mt-20 ">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/admin/examGroups/${examGroupId}`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y  font-bold mb-4">Exam Group Analytics</h2>
                </div>
                <div v-if="analytics">
                    <div class="grid grid-cols-6 gap-6">
                        <div class="bg-white rounded-lg shadow-lg p-6 justify-center space-x-10">
                            <div class="mx-4">

                                <div class="flex flex-row justify-between  items-center text-center">
                                    <div class="text-left align-middle">
                                        <Icon name="healthicons:i-exam-qualification-outline"
                                            class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                    </div>
                                    <div class="text-right align-middle ">
                                        <h2 class=" font-bold text-gray-500">Exams</h2>
                                        <p class="text-3xl font-bold text-gray-800">{{ analytics.totalExams }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 justify-center space-x-10">
                            <div class="mx-4">

                                <div class="flex flex-row justify-between  items-center text-center">
                                    <div class="text-left align-middle">
                                        <Icon name="iconoir:group" class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                    </div>
                                    <div class="text-right align-middle ">
                                        <h2 class=" font-bold text-gray-500">Test Takers</h2>
                                        <p class="text-3xl font-bold text-gray-800">{{ analytics.totalTestTakers }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                            <div class="mx-4">

                                <div class="flex flex-row justify-between items-center text-center">
                                    <div class="text-left align-middle">
                                        <Icon
                                            name="streamline:interface-favorite-award-ribbon-reward-like-social-rating-media"
                                            class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                                    </div>
                                    <div class="text-right align-middle ">
                                        <h2 class=" font-bold text-gray-500">Pass Grade</h2>
                                        <p class="text-3xl font-bold text-gray-800">{{ analytics.totalPassPoint }}
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
                                        <h2 class=" font-bold text-gray-500">Pass Rate</h2>
                                        <p class="text-2xl font-bold text-gray-800" v-if="analytics.percentagePassed">{{
                                            analytics.percentagePassed.toFixed(2) }}%</p>
                                        <p v-else>-</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 justify-center space-x-10">
                            <div class="mx-4">

                                <div class="flex flex-row justify-between  items-center text-center">
                                    <div class="text-left align-middle">
                                        <div class="w-12 h-12 bg-green-700 rounded-full flex-shrink-0"></div>
                                    </div>
                                    <div class="text-right align-middle ">
                                        <h2 class=" font-bold text-gray-500">Highest Grade</h2>
                                        <p class="text-2xl font-bold text-gray-800">{{ analytics.topScore }} / {{
                                        analytics.totalNumOfQuestions }}</p>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 justify-center space-x-10">
                            <div class="mx-4">

                                <div class="flex flex-row justify-between  items-center text-center">
                                    <div class="text-left align-middle">
                                        <div class="w-12 h-12 bg-red-700 rounded-full flex-shrink-0"></div>
                                    </div>
                                    <div class="text-right align-middle ">
                                        <h2 class=" font-bold text-gray-500">Lowest Grade</h2>
                                        <p class="text-2xl font-bold text-gray-800">{{ analytics.leastScore }} / {{
                                        analytics.totalNumOfQuestions }}</p>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
              
                    <div class="flex grid grid-cols-3 mt-10">

                        <div v-for="testTaker in analytics.topTestTakers">
                            <div v-if="testTaker.exams.length > 0">

                                <NuxtLink :to="`/admin/testTakers/${testTaker.testTakerId}`">
                                    <div class="box rounded-md p-3 m-3 relative zoom-in h-48">

                                        <div class="mt-3 justify-between">

                                            <div class="font-bold text-2xl text-center my-2 ml-5 uppercase">{{ testTaker.testTakerName
                                            }}</div>
                                            <p class="text-center font-md p-1">
                                                Total Score : {{ testTaker.totalScore }} / {{ analytics.totalNumOfQuestions
                                                }}
                                            </p>
                                        </div>
                                        <div class="w-52 sm:w-auto mx-auto mt-8 h-full">
                                            <div v-for="exam in testTaker.exams">


                                                <div class="flex items-center m-1">
                                                    <div class="w-2 h-2 rounded-full mr-3" :class="`bg-primary`">
                                                    </div>
                                                    <span class="truncate">{{ exam.examName.length > 20 ?
                                                        exam.examName.slice(0.19) + '...' : exam.examName }}</span> <span
                                                        class="font-medium ml-auto">{{ exam.score }} / {{ exam.totQuestions
                                                        }}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>


                        </div>
                    </div>

                </div>
                <div v-else class="w-full text-center text-lg  mt-10 h-full">
                    No Exam Group Analytics yet
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import AdminTopBar from '@/components/TopBar.vue'
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
definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()
const route = useRoute();
const examGroupId = route.params.id as string;

const { data: analytics } = await useAsyncData(() => $client.analytics.getExamGroupAnalytics.query({ examGroupId }));

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>
<style scoped>
.middle {
    margin-left: 13vmax;
}
.w-full.overflow-y-auto {
  height: calc(100vh - 4rem - 3.5rem); /* Adjust the height according to your needs */
}
</style>