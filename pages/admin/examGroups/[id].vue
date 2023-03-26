<template>
     <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">
                <div class="mx-5">
                    <h2 class="intro-y text-lg font-medium mt-10">1990 Ethiopian National Exam</h2>
                </div>

                <div class="mx-5 mt-5">               
                  <ul class="nav nav-link-tabs" role="tablist">
                    <li id="example-5-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2 "  @click="activeTab = 1" :class="{ 'active': activeTab === 1 }"  data-tw-toggle="pill" data-tw-target="#example-tab-5" type="button" role="tab" aria-controls="example-tab-5" aria-selected="true">
                            Test Takers List
                        </button>
                    </li>
                    <li id="example-6-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2"  @click="activeTab = 2" :class="{ 'active': activeTab === 2 }" data-tw-toggle="pill" data-tw-target="#example-tab-6" type="button" role="tab" aria-controls="example-tab-6" aria-selected="true">
                            Exams List
                        </button>
                    </li>
                </ul>
                    <div class="tab-content mt-5">
                        <div id="example-tab-5" class="tab-pane leading-relaxed " role="tabpanel" aria-labelledby="example-5-tab" :class="{ 'active': activeTab === 1 }">
                            <div class="w-full mx-6">
            
            
                                <h2 class="intro-y text-lg font-medium mt-10">List of test takers</h2>
                                <div class="grid grid-cols-12 gap-6 mt-5 ">
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                                       
                                        <button  v-on:click="toggleAddModal()"  class="btn btn-primary shadow-md mr-2">Generate credintials
                                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                                        </button>
                          
                                        <div class="hidden md:block mx-auto text-slate-500">
                                            Showing 1 to 10 of {{ testTakers.length }} entries
                                        </div>
                                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." />
                                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
                            
                                            </div>
                                        </div>
                                         
                                    </div>
                                    <div v-if="isReloading" class="flex justify-center items-center">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6 "></Icon>
                                        </div>
                                    <div v-else class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                        
                                        <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Name</th>
                                                    <th class="text-center whitespace-nowrap">Admission number</th>
                                                    
                                                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="student in testTakers" :key="student.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/exams/${student.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/exams/${student.id}`" class="font-medium whitespace-nowrap">{{
                                                        student.name.length > 40 ? student.name.slice(0,39) + "..." : student.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ student.username}}</td>
                             
                                                
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
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
                        <div id="example-tab-6" class="tab-pane leading-relaxed" role="tabpanel" aria-labelledby="example-6-tab" :class="{ 'active': activeTab === 2 }">
                            
                            <div class="grid grid-cols-12 gap-6 mt-5">
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                                      
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
                                                                    'text-success': exam.status === 'ACTIVE',
                                                                    'text-danger': exam.status === 'INACTIVE',
                                                                }">
                                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                                    {{ exam.status === 'ACTIVE' ? "Active" : "Inactive" }}
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
                                </div> </div>
                    </div>
                                    
                </div>           
            </div>
            </div>
            <!-- csv file add modal -->
            <div v-if="showAddModal"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                            <!--content-->
                            <div
                                class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-solid border-slate-200 rounded-t">
                                  
                                    <button
                                        class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="toggleAddModal()">
                                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                
                                    <div class="flex flex-row align-middle mt-2" >
                                        
                                        <p class="w-8/12 align-middle my-auto font-bold text-md">Upload CSV file</p>
                                        
                                      
                                        <Uploadfile v-model:path="filepath" />
                                        {{  filepath }}
                                            </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleAddPool()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading">
                                        <div v-if="isLoading">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Add
                                        </div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
        </div>

</template>

<script setup lang="ts">

import { TestTakers } from '.prisma/client';
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();
const activeTab = ref(1);
const showAddModal = ref(false);
const isLoading = ref(false);
const isReloading = ref(false);

const filepath = ref('');

const route = useRoute()
const examGroupId = route.params.id as string;
const toggleAddModal = () => {
   
    showAddModal.value = !showAddModal.value;
}
let testTakers: string | any[] = [];

const getTestTakers = async () => {
  testTakers = await $client.examGroup.getExamGroupTestTakers.query({ id: examGroupId });

}

const handleAddPool = async () => {
  isLoading.value = true;

  const inputPath = 'https://ixzzkpsnlfushkyptszh.supabase.co/storage/v1/object/public/eegts-files/' + `${filepath.value}`
  await $client.examGroup.generateCredentials.mutate({ examGroupId: examGroupId, inputPath: inputPath });

  isLoading.value = false;
  showAddModal.value = false;
  isReloading.value = true;

  // Refresh testTakers list after adding pool
  testTakers = await $client.examGroup.getExamGroupTestTakers.query({ id: examGroupId });

  isReloading.value = false;
};

getTestTakers();

const handleDelete = async (id: string) => {
    const response = await $client.examGroup.deleteExamGroup.mutate({ id: id });
    if (response) {
        isReloading.value = true;
    }
}
const exams =  [
                { "id": "1", "name": "Physics 1990 Ethiopian National Exam", "numberOfQuestions": 45, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" }, 
                { "id": "2", "name": "Chemistry 2000 Ethiopian National Exam", "numberOfQuestions": 80, "status": "INACTIVE", "testingDate": "01:00 PM Dec 12, 1990" }, 
                { "id": "3", "name": "Biology 2001 Ethiopian National Exam", "numberOfQuestions": 120, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" },
                { "id": "2", "name": "Chemistry 2010 Ethiopian National Exam", "numberOfQuestions": 80, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" }
            ]

 

</script>