<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="analytics" />
            <div class="w-full mx-10">
                <div v-if="analytics">
                    <div class="container mx-auto py-8 align-middle justify-center items-center w-3/4 ">
                        <div class="flex flex-row">
                            <div class="w-4/12 p-6 align-middle">



                                <div class="align-middle">
                                    <a :href="`/admin/exams`">

                                        <div class="bg-white rounded-lg border-1 shadow-lg p-10 mt-5 hover:bg-gray-50 ">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="healthicons:i-exam-qualification-outline"
                                                        class="h-16 w-16  my-2 text-primary align-middle">
                                                    </Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-2xl font-bold mb-2 text-gray-600 text-center">Exams
                                                    </h2>
                                                    <p class="text-3xl font-bold text-gray-800">{{
                                                        analytics.totalExams }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>

                                    <a :href="`/admin/pools`">
                                        <div class="bg-white rounded-lg border-1 shadow-lg p-10 mt-5 hover:bg-gray-50 ">

                                            <div class="flex flex-row justify-between  items-center text-center">
                                                <div class="text-left align-middle">
                                                    <Icon name="solar:pie-chart-broken"
                                                        class="h-16 w-16  my-2 text-primary align-middle">
                                                    </Icon>
                                                </div>
                                                <div class="text-right align-middle ">
                                                    <h2 class="text-2xl font-bold mb-2 text-gray-600 text-center">Pools
                                                    </h2>
                                                    <p class="text-3xl font-bold text-gray-800">{{
                                                        analytics.totalPools }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </a>
                                </div>
                            </div>


                            <div class="w-8/12">


                                <a :href="`admin/contributors`" class="mt-4">
                                    <div class="bg-white rounded-lg shadow-lg p-6 mt-2 hover:bg-gray-50 h-96">
                                        <Doughnut :data="analytics.contributorDistribution.data"
                                            :options="analytics.contributorDistribution.options" />
                                    </div>
                                </a>

                            </div>
                        </div>

                        <a :href="`admin/examGroups`">
                            <div class="bg-white rounded-lg shadow-lg p-6 mt-5 hover:bg-gray-50 ">

                                <div class="mt-6 h-80">
                                    <Bar :data="analytics.examGroupDistribution.data"
                                        :options="analytics.examGroupDistribution.options" />
                                </div>
                            </div>
                        </a>

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


const { data: analytics } = await useAsyncData(() => $client.analytics.getDashboardAnalytics.query());

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>