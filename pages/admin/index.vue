<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="analytics" />
            <div class=" content middle  justify-center mx-auto mt-24">
                <div class="my-5 w-full">
                <div class="">
                    <div class="col-span-12 2xl:col-span-9">
                    <div v-if="analytics"  class="grid grid-cols-12 gap-6">
                     <!-- BEGIN: General Report -->
                        <div class="col-span-12 mt-8">
                                    <div class="intro-y flex items-center h-10">
                                        <h2 class="text-lg font-medium truncate mr-5">
                                            General Report
                                        </h2>
                                        <a href="" class="ml-auto flex items-center text-primary"> <i data-lucide="refresh-ccw" class="w-4 h-4 mr-3"></i> Reload Data </a>
                                    </div>
                                    <div class="grid grid-cols-12 gap-6 mt-5">
                                        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                            <div class="report-box zoom-in">
                                                <div class="box p-5">
                                                    <div class="flex">
                                                        <i data-lucide="shopping-cart" class="report-box__icon text-primary"></i> 
                                                        <div class="ml-auto">
                                                           
                                                            <Icon name="solar:pie-chart-broken"
                                                                class=" w-16 h-10  my-2 text-primary ">
                                                            </Icon>
                                                         </div>
                                                    </div>
                                                    <div class="text-3xl font-medium leading-8 mt-6">{{
                                                                analytics.totalPools }}</div>
                                                    <div class="text-base text-slate-500 mt-1">Total Pools</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                            <div class="report-box zoom-in">
                                                <div class="box p-5">
                                                    <div class="flex">
                                                        <i data-lucide="credit-card" class="report-box__icon text-pending"></i> 
                                                        <div class="ml-auto">
                                                            <Icon name="healthicons:i-exam-qualification-outline"
                                                                class=" w-16 h-10  my-2 text-primary ">
                                                            </Icon>
                                                         </div>
                                                    </div>
                                                    <div class="text-3xl font-medium leading-8 mt-6">{{ analytics.totalExams}}</div>
                                                    <div class="text-base text-slate-500 mt-1">Total Exams</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                            <div class="report-box zoom-in">
                                                <div class="box p-5">
                                                    <div class="flex">
                                                        <i data-lucide="monitor" class="report-box__icon text-warning"></i> 
                                                        <div class="ml-auto">
                                                           
                                                           <Icon name="solar:pie-chart-broken"
                                                               class=" w-16 h-10  my-2 text-primary ">
                                                           </Icon>
                                                        </div>
                                                    </div>
                                                    <div class="text-3xl font-medium leading-8 mt-6">10</div>
                                                    <div class="text-base text-slate-500 mt-1">Total Contributors</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                            <div class="report-box zoom-in">
                                                <div class="box p-5">
                                                    <div class="flex">
                                                        <i data-lucide="user" class="report-box__icon text-success"></i> 
                                                        <div class="ml-auto">
                                                           
                                                           <Icon name="solar:pie-chart-broken"
                                                               class=" w-16 h-10  my-2 text-primary ">
                                                           </Icon>
                                                        </div>
                                                    </div>
                                                    <div class="text-3xl font-medium leading-8 mt-6">5</div>
                                                    <div class="text-base text-slate-500 mt-1">Total Exam Groups</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </div>
                        <!-- END: General Report -->
                       <!-- BEGIN: General Report -->
                       <div class="col-span-12 mt-8">
                                    <div class="intro-y flex items-center h-10">
                                        <h2 class="text-lg font-medium truncate mr-5">
                                            Distribution
                                        </h2>
                                        <a href="" class="ml-auto flex items-center text-primary"> <i data-lucide="refresh-ccw" class="w-4 h-4 mr-3"></i> Reload Data </a>
                                    </div>
                                    <div class="grid grid-cols-12 gap-6 mt-5">
                                        
                                       
                                        <div class="col-span-12 col-span-6  intro-y">
                                            <div class=" zoom-in">
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
                                        <div class="col-span-12 col-span-6 intro-y">
                                            <div class=" zoom-in">
                                                <a :href="`admin/contributors`" class="mt-4">
                                            <div class="bg-white rounded-lg shadow-lg p-6 mt-2 hover:bg-gray-50 h-96">
                                                <Doughnut :data="analytics.contributorDistribution.data"
                                                    :options="analytics.contributorDistribution.options" />
                                            </div>
                                        </a>

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

<style scoped>
.middle {
    margin-left: 11vmax;
}
.w-full.overflow-y-auto {
  height: calc(100vh - 4rem - 3.5rem); /* Adjust the height according to your needs */
}
</style>