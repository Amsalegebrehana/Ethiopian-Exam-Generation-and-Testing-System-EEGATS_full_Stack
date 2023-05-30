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
const contrId = useRoute().query.contrId as string;
const poolId = useRoute().params.id as string;
const { $client } = useNuxtApp();
const analytics = await $client.analytics.getContributorAnalytics.query({ contrId });
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="pools" />
            <div class="w-full mx-6">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/admin/pools/${poolId}`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-bold mb-4">Assign Contributor</h2>
                </div>

                <div class="flex flex-row space-x-4">
                    <div class="w-7/12 bg-green-200 h-96">

                    </div>
                    <div class="w-5/12" v-if="analytics">
                        <h1 class="text-center text-4xl font-bold">{{ analytics.contributorName }}</h1>
                        <h6 class="text-center text-lg">{{ analytics.poolName }}</h6>
                        <div class="bg-white rounded-lg shadow-lg p-6 mt-4">
                            <h2 class="text-2xl font-bold mb-4 text-gray-600">Questions</h2>
                          
                            <div class="grid grid-cols-2 gap-2 mt-4">
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:message-question-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Total Questions</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.totalQuestionsCreated }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="material-symbols:pending-actions-sharp"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Questions Assigned</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.totalAssignedQuestions }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                              
                                
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 w-9/12 items-center mx-auto">
                                
                                <div class="mt-4 ">
                                    <Doughnut :data="analytics.statusDistribution.data"
                                        :options="analytics.statusDistribution.options" />
                                </div>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 mt-5">
                                
                                <div class="mt-6">
                                    <Bar :data="analytics.catDistribution.data"
                                        :options="analytics.catDistribution.options" />
                                </div>
                            </div>

                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 mt-4">
                            <h2 class="text-2xl font-bold mb-4 text-gray-600">Reviews</h2>
                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:comment-text-multiple-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Reviews Made</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.submittedReviews }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="material-symbols:pending-actions-sharp"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Pending Reviews</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{
                                                    analytics.totalReviewsAssigned }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:check-decagram-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Approval Rate</h2>
                                                <p class="text-2xl font-bold text-gray-800" v-if="analytics.approvingRate">
                                                    {{
                                                        analytics.approvingRate.toFixed(2) }}%</p>
                                                <p v-else>-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>