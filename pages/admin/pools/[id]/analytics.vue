<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="pools" />
            <div class="w-full mx-6 mt-24">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/admin/pools/${poolId}`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-bold mb-4">Pool Analytics</h2>
                </div>
    <div v-if="poolAnalytics">

     

        <div class="container mx-auto py-8 align-middle justify-center items-center ">
           
            <h1 class="text-3xl font-bold">{{ poolAnalytics.poolName }} Pool</h1>

            <div class="mt-8 grid grid-cols-2 gap-6  shadow-lg">
                <div>
                <div class="grid grid-cols-3 gap-6">
                <!-- Question Count Card -->
                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                    <div class="mx-4">

                        <div class="flex flex-row justify-between  space-x-6  items-center text-center">
                            <div class="text-left align-middle">
                                <Icon name="mdi:message-question-outline" class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                            </div>
                            <div class="text-right align-middle ">
                                <h2 class="text-lg font-bold text-gray-500">Questions</h2>
                                <p class="text-3xl font-bold text-gray-800">{{ poolAnalytics.totalApprovedQuestions }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                    <div class="mx-4">

                        <div class="flex flex-row justify-between space-x-6  items-center text-center">
                            <div class="text-left align-middle">
                                <Icon name="healthicons:i-exam-qualification-outline" class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                            </div>
                            <div class="text-right align-middle ">
                                <h2 class="text-lg font-bold text-gray-500">Exams</h2>
                                <p class="text-3xl font-bold text-gray-800">{{ poolAnalytics.examCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                    <div class="mx-4">

                        <div class="flex flex-row justify-between space-x-6  items-center text-center">
                            <div class="text-left align-middle">
                                <Icon name="akar-icons:people-group" class="h-12 w-12  my-2 text-primary align-middle"></Icon>
                            </div>
                            <div class="text-right align-middle ">
                                <h2 class="text-lg font-bold text-gray-500">Contributors</h2>
                                <p class="text-3xl font-bold text-gray-800">{{ poolAnalytics.contributorCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="bg-white rounded-lg shadow-lg p-6 mt-2">
                  
                    <div class="mt-4">
                        <Doughnut :data="poolAnalytics.statusDistribution.data"
                            :options="poolAnalytics.statusDistribution.options" />
                    </div>
                </div>
</div>

            <div class="align-middle items-center  my-auto h-full justify-center">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-2xl font-bold mb-4 text-gray-600">Top Contributors</h3>
                    <div class="space-y-4">
                        <table class="w-full">
                            <thead>
                                <tr>
                                    <th class="text-left text-lg pb-2">Contributor</th>
                                    <th class="text-right text-lg">Contribution</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(contributor, index) in poolAnalytics.topContributors" :key="index">
                                    <td class="text-left pb-4">{{ contributor.contributorName }}</td>
                                    <td class="text-right">
                                        
                                        <div class="relative h-2 bg-gray-200 rounded">
                                            <div class="absolute top-0 left-0 h-2 rounded"
                                                :style="{ width: contributor.contributionPercentage + '%' }">
                                                <div class="h-2 rounded"
                                                    :class="{ 'bg-blue-500': poolAnalytics.topContributors.length > 0 && index === 0, 
                                                    'bg-yellow-500': poolAnalytics.topContributors.length > 1 && index === 1, 
                                                    'bg-pink-500': poolAnalytics.topContributors.length > 2 && index === 2 }">
                                                </div>
                                            </div>
                                        </div>
                                        <span class="text-gray-700">{{ contributor.contributionPercentage.toFixed(2)
                                        }}%</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- Top Categories Table -->
                <div class="bg-white rounded-lg shadow-lg p-6 mt-4">
                    <h2 class="text-2xl font-bold mb-4 text-gray-600">Top Categories</h2>
                    <table class="mt-4 w-full">
                        <thead>
                            <tr>
                                <th class="text-left font-bold text-gray-700 text-lg pb-2">Category</th>
                                <th class="text-right font-bold text-gray-700 text-lg">Questions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(category, index) in poolAnalytics.topCategories" :key="index" class="my-1">
                                <td class="text-left py-1">{{ category.categoryName }}</td>
                                <td class="text-right">{{ category.totalQuestions }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bg-white rounded-lg shadow-lg p-6 mt-5">
                   
                    <div class="mt-6">
                        <Bar :data="poolAnalytics.catDistribution.data" :options="poolAnalytics.catDistribution.options" />
                    </div>
                </div>

               
            </div>
               
            </div>

          
        </div>



    </div>
    <div v-else class="w-full text-center text-lg mt-10 h-full">
        No Pool Analytics yet
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
const poolId = route.params.id as string;

const { data: poolAnalytics } = await useAsyncData(() => $client.analytics.getPoolAnalytics.query({ poolId }));

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>