<template>
     <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            
            <AdminSideBar pageName="examgroups" />
            <div class="w-full mx-6">
                <div class="mx-5">
                    <h2 class="intro-y text-lg font-medium mt-10">{{ examGroup.name }}</h2>
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
                                           
                                       </div> 
                                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." />
                                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
                            
                                            </div>
                                        </div>
                                         
                                    </div>
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center justify-end mt-2">
                                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                            <div class="w-56 relative text-slate-500">
                                                <button @click="exportTableData()" class="btn btn-success text-white shadow-md mr-2">Export Table Data</button>
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
                                                    <th></th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                    
                                                
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
                                                    <td class="w-16">
                                                            <div v-if="student.failedAttempts >= 3" class="mx-auto">
                                                                <div
                                                                    class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                                    <p>Locked</p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                    <td class="table-report__action w-96">
                                                            <div class="flex justify-center items-center">
                                                               
                                                                <a class="flex items-center mr-6" href="javascript:;"
                                                                    @click="ResetPasswordModal(student.id)">
                                                                    <Icon name="material-symbols:key-rounded"
                                                                        class="w-4 h-4 mr-1"></Icon> Reset Password
                                                                </a>
                                                              
                                                            </div>
                                                        </td>
                                                
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                                    
                                       <div class="hidden md:block mx-auto text-slate-500">
                                           Showing 1 to 10 of {{ testTakers.length }} entries
                                       </div>   
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
                            
                            <ExamsList :examGroupId ="examGroupId"/>
                        </div>
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
                    <div v-if="showResetPasswordModal"
                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                    <!--content-->
                    <div
                        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <!--header-->
                        <div class="flex items-start justify-between p-5 border-solid border-slate-200 rounded-t">
                            <!-- <h3 class="text-3xl font-semibold">
                    Modal Title
                </h3> -->
                            <button
                                class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button" v-on:click="toggleResetPasswordModal()" :disabled="isLoadingResetPassword">
                                <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                            </button>
                        </div>
                        <!--body-->
                        <div class="relative p-6 flex-auto">
                            <div class="align-middle justify-center items-center w-full text-center">
                                <div v-if="isLoadingResetPassword">
                                    <p class="text-2xl font-bold">
                                        Resetting password
                                    </p>
                                    <Icon name="eos-icons:bubble-loading" class="w-10 h-10 text-primary m-3"></Icon>
                                </div>
                                <div v-else>
                                    <div class="flex flex-row align-middle">
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">New Password</p>
                                        <div class="input-group mt-2  w-96">
                                            <input class="form-control bg-slate-100 p-2" id="copyInput"
                                                :value="newPassword" />

                                            <button @click="copy()" class="input-group-text">
                                                <Icon v-if="isCopied" name="lucide:copy-check" class="w-6 h-6 text-primary">
                                                </Icon>
                                                <Icon v-else name="lucide:copy" class="w-6 h-6 text-slate-500"></Icon>
                                            </button>

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showResetPasswordModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
            <Modal type="error" :show="showErrorModal" :toggle="toggleErrorModal" :message="errorText" />
        </div>

</template>

<script setup lang="ts">

import AdminTopBar from '~~/components/TopBar.vue';
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

import ExamsList from '~~/components/admin/ExamsList.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();
const activeTab = ref(1);
const showAddModal = ref(false);
const isLoading = ref(false);
const isReloading = ref(false);
const isLoadingResetPassword = ref(false);
const showResetPasswordModal = ref(false);
const filepath = ref('');
const page = ref(1);
const searchText = ref('');

const route = useRoute()
const examGroupId = route.params.id as string;

const searchPage = ref(1)
// get exam group data
const examGroup = await $client.examGroup.getExamGroup.query({ id: examGroupId });
// get exam data

const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.review.getReviewsCount.query({ reviewerId: contrId }));
const { data: reviews, refresh: fetchReviews, pending } = await useAsyncData(() => $client.review.getReviews.query({ reviewerId: contrId, skip: (page.value - 1) * 6 }), { watch: [page, searchText] });

const { data: searchCount, refresh: fetchSearchCount } = await useAsyncData(() => $client.review.getReviewsCount.query({ reviewerId: contrId, search: searchText.value !== '' ? searchText.value : undefined }), { watch: [searchPage, searchText] });
const { data: searchReviews, refresh: fetchSearchReviews, pending: pendingSearch } = await useAsyncData(() => $client.review.getReviews.query({ reviewerId: contrId, search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6 }),
  { watch: [page, searchText] });

const paginate = async (newPage: number) => {
  page.value = newPage;
  isReloading.value = true;
  try {
    await fetchReviews();
    await fetchCount();
  } finally {
    isReloading.value = false
  }
}


const toggleAddModal = () => {
   
    showAddModal.value = !showAddModal.value;
}
let testTakers: string | any[] = [];

const rows = [['Name', 'Admission Number']]; // add header row

const getTestTakers = async () => {
  testTakers = await $client.examGroup.getExamGroupTestTakers.query({ id: examGroupId });
    if (testTakers) {

             testTakers.forEach((student: { name: string; username: string; }) => { 
            rows.push([student.name, student.username]); // add data rows
        });
      }
      
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
const exportTableData = async() => {
      
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((row) => row.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'table-data.csv');
      document.body.appendChild(link);
      link.click();
};
const handleDelete = async (id: string) => {
    const response = await $client.examGroup.deleteExamGroup.mutate({ id: id });
    if (response) {
        isReloading.value = true;
    }
}

const exams = await $client.exam.getExamsByExamGroup.query({skip:0, id: examGroupId });

const showErrorModal = ref(false);
const errorText = ref('');
const toggleErrorModal = () => {
    showErrorModal.value = !showErrorModal.value;
}
const toggleResetPasswordModal = () => {
    showResetPasswordModal.value = !showResetPasswordModal.value;
}

const ResetPasswordModal = async (contrId: string) => {
    isLoadingResetPassword.value = true;
    showResetPasswordModal.value = !showResetPasswordModal.value;
    try {
        const pass = await $client.testtaker.adminResetPassword.mutate({ id: contrId });
        newPassword.value = pass;
        isLoadingResetPassword.value = false;
    } catch (error) {
        isLoadingResetPassword.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }
}
const isCopied = ref(false);
const newPassword = ref('');
const copy = () => {
    const copyText = document.getElementById("copyInput") as HTMLInputElement;
    const textToCopy = copyText.value;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            isCopied.value = true;
            setTimeout(() => {
                isCopied.value = false;
            }, 3000);
        })
        .catch((error) => {
            console.error('Failed to copy text:', error);
        });
}


</script>