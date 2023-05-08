<template>
    <div>
        <AdminTopBar role="admin"/>
        <div class="flex"> 

            <AdminSideBar pageName="exams"/>
            <div class="w-full mx-6">
            
            
                <h2 class="intro-y text-lg font-medium mt-10">List of exams</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                        <NuxtLink :to="`/admin/create-exam`">
                        <button class="btn btn-primary shadow-md mr-2">Create exam
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                        </NuxtLink>
                        <div class="hidden md:block mx-auto text-slate-500">
                            Showing 1 to 10 of {{ exams.length }} entries
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." />
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
            
                            </div>
                        </div>
                    </div>
                     <!-- BEGIN: Data List -->
                     <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                        <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Exams</th>
                                                    <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                    <th class="whitespace-nowrap">Status</th>
                                                    <th class="whitespace-nowrap">Testing Date</th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="exam in exams" :key="exam.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/exams/${exam.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/exams/${exam.id}`" class="font-medium whitespace-nowrap">{{
                                                            exam.name.length > 40 ? exam.name.slice(0,39) + "..." : exam.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ exam.numberOfQuestions }}</td>
                                                    <td class="w-24">
                                                                <div class="flex items-center justify-center" :class="{
                                                                    'text-success': exam.status === 'generated',
                                                                    'text-danger': exam.status === 'published',
                                                                }">
                                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                                    {{ exam.status === 'generated' ? "generated" : "published" }}
                                                                </div>
                                                            </td>
                                                            <td class="">{{ exam.testingDate }}</td>
                                                    <td class="table-report__action w-40">
                                                        <div class="flex justify-center items-center">
                                                            <a class="flex items-center mr-3" href="javascript:;">
                                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon> Edit
                                                            </a>
                                                            <a class="flex items-center text-danger" href="javascript:;"
                                                                >
                                                                <Icon name="fa6-regular:trash-can" class="w-4 h-4"></Icon> Delete
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- END: Data List -->
                    <!-- BEGIN: Pagination -->
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                        <nav class="w-full sm:w-auto sm:mr-auto">
                            <ul class="pagination">
                                <li class="page-item">
                                    <a class="page-link" href="#">
                                        <Icon name="mdi:chevron-double-left" class="h-4 w-4"></Icon>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">
                                        <Icon name="mdi:chevron-left" class="h-4 w-4"></Icon>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">...</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">1</a>
                                </li>
                                <li class="page-item active">
                                    <a class="page-link" href="#">2</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">3</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">...</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">
                                        <Icon name="mdi:chevron-right" class="h-4 w-4"></Icon>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">
                                        <Icon name="mdi:chevron-double-right" class="h-4 w-4"></Icon>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <select class="w-20 form-select box mt-3 sm:mt-0">
                            <option>10</option>
                            <option>25</option>
                            <option>35</option>
                            <option>50</option>
                        </select>
                    </div>
                    <!-- END: Pagination -->
                </div>
               
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();

const exams = await $client.exam.getExams.query({skip:0 });


</script>