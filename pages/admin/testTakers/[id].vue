<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="testtakers" />
            <div class="w-full mx-6">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/admin/testtakers`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-bold mb-4">Test Taker Results</h2>
                </div>
                <div class="container mx-auto py-8">
                    <div v-if="testTakerResults">
                        <div class="space-y-4 mb-2 sticky p-5 rounded-md mx-10 ">

                            <h1 class="text-4xl text-primary font-semibold mb-4 "> {{
                                testTakerResults.username }}</h1>
                                <h4 class="font-bold text-lg">
                                    Total : {{ testTakerResults.totalMarks}} / {{ testTakerResults.totalNumOfQuestions}}
                                </h4>

                           


                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="result in testTakerResults.result" :key="result.id"
                                class="bg-gray-50  shadow-lg rounded-md p-4 m-4">
                                <div class="flex ">


                                    <div class="flex flex-col items-start align-middle  w-6/12 my-auto mx-6">
                                        <h2 class="text-2xl font-semibold mb-2">{{ result.name }}</h2>
                                        <h6 class="text-lg  mb-5 text-gray-700">{{ result.pool }}</h6>
                                        <div class="flex flex-wrap mb-4">
                                            <div class="flex flex-row space-x-10 mb-4  ">

                                                <div class="flex items-center">
                                                    <div class="w-12 h-12 bg-gray-500 rounded-full flex-shrink-0"></div>
                                                    <div class="ml-2">
                                                        <p class="text-gray-600">Grade</p>
                                                        <p class="text-lg font-semibold">{{ result.grade}} / {{ result.numOfQuestions }}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <p class="text-gray-600">Test Time</p>
                                                        <p class="text-lg font-semibold">{{ result.testTime }} / {{
                                                            result.testDuration }} mins</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>



                                    <div class="my-2 h-72">
                                        <div v-if="result.chartData">
                                            <Doughnut :data="result.chartData.data" :options="result.chartData.options" />
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>


                    </div>
                    <div v-else class="w-full text-center text-lg mt-10 h-full">
                        No Exam Analytics yet
                    </div>
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
const testTakerId = route.params.id as string;

const { data: testTakerResults } = await useAsyncData(() => $client.analytics.getTestTakerResults.query({ testTakerId }));

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>
