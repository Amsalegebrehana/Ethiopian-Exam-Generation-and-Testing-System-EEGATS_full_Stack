<script setup lang="ts">
import AdminTopBar from '@/components/TopBar.vue'
import AdminSideBar from '@/components/admin/AdminSideBar.vue'

import Modal from '@/components/Modal.vue'

definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()

const page = ref(1);
const searchPage = ref(1);
const searchText = ref('');
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.testtaker.getTestTakersCount.query({}),{ watch: [page, searchText] });
const { data: testTakers, refresh: fetchTestTakers, pending } = await useAsyncData(() => $client.testtaker.getTestTakers.query({ skip: (page.value - 1) * 6 }),{ watch: [page, searchText] });
const { data: searchcount, refresh: fetchSearchCount } = await useAsyncData(() => $client.testtaker.getTestTakersCount.query({ search: searchText.value !== '' ? searchText.value : undefined }), { watch: [searchPage, searchText] });
const { data: searchTestTakers, refresh: fetchSearchTestTakers, pending: pendingSearch } = await useAsyncData(() => $client.testtaker.getTestTakers.query({ search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6 }), { watch: [searchPage, searchText] });

const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchTestTakers();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchTestTakers();
        await fetchSearchCount();
    } finally {
        isReloading.value = false
    }
}
const showErrorModal = ref(false);
const isReloading = ref(false);
const showSuccessModal = ref(false);
const errorText = ref('');


const resetSearch = () => {
    if (searchText.value === "") {
        searchPage.value = 1;
        page.value = 1;
    }
}

const toggleErrorModal = () => {
    showErrorModal.value = !showErrorModal.value;
}
const toggleSuccessModal = () => {
    showSuccessModal.value = !showSuccessModal.value;
}

const showResetPasswordModal = ref(false);
const isLoadingResetPassword = ref(false);
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

<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="testtakers" />
            <div class="w-full mx-6">

                <h2 class="intro-y text-lg font-medium mt-10">List of Test Takers</h2>

                <div class="my-5 w-full">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">

                        <div class=" ml-auto mt-3 sm:mt-0 ">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..."
                                    v-model="searchText" @change="resetSearch" />
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>

                            </div>
                        </div>
                    </div>
                    <div class="w-full mt-10">

                        <div v-if="searchText != ''">

                            <div class="intro-y col-span-12 overflow-auto lg:overflow-visible w-full">
                                <div v-if="searchTestTakers?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No test takers found</p>
                                </div>
                                <div v-if="searchTestTakers?.length !== 0">

                                       
                                    <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Name</th>
                                                    <th class="text-center whitespace-nowrap">Admission number</th>
                                                    <th class="text-center whitespace-nowrap">Exam Group</th>
                                                    <th></th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                    
                                                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="student in searchTestTakers" :key="student.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/testtakers/${student.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/testtakers/${student.id}`" class="font-medium whitespace-nowrap">{{
                                                        student.name.length > 40 ? student.name.slice(0,39) + "..." : student.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ student.username}}</td>
                                                    <td class="text-center">{{ student.examGroup.name.length > 40 ? student.examGroup.name.slice(0,39)  + "..." : student.examGroup.name}}</td>
                                                    
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
                                                                <a class="flex items-center mr-6 text-primary" :href="`/admin/testtakers/${student.id}`">
                                                                    <Icon name="tabler:device-analytics"
                                                                        class="w-4 h-4 mr-1"></Icon> View Details
                                                                </a>
                                                               
                                                              
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
                                    <div class="flex flex-row mt-3">
                                        <div class="md:block  text-slate-500">

                                        </div>
                                        <div
                                            class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                            <nav class="w-full sm:w-auto sm:mr-auto">
                                                <ul class="pagination">

                                                    <li class="page-item">
                                                        <button class="page-link" v-on:click="paginateSearch(searchPage - 1)"
                                                            :disabled="searchPage === 1">
                                                            <div
                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                                                </Icon>
                                                                <span class="">Previous</span>
                                                            </div>
                                                        </button>
                                                    </li>
                                                    <li class="page-item">
                                                        <button class="page-link" v-on:click="paginateSearch(searchPage + 1)"
                                                            :disabled="(searchPage) * 6 >= searchcount!">
                                                            <div
                                                                class="flex flex-row align-middle justify-center items-center">
                                                                <span>Next</span>
                                                                <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle">
                                                                </Icon>
                                                            </div>
                                                        </button>
                                                    </li>


                                                </ul>
                                            </nav>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                <div v-if="testTakers?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No test takers found</p>
                                </div>
                                <div v-if="testTakers?.length !== 0">

                                   
                                    <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Name</th>
                                                    <th class="text-center whitespace-nowrap">Admission number</th>
                                                    <th class="text-center whitespace-nowrap">Exam Group</th>

                                                    <th></th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                    
                                                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="student in testTakers" :key="student.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/testtakers/${student.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/testtakers/${student.id}`" class="font-medium whitespace-nowrap">{{
                                                        student.name.length > 40 ? student.name.slice(0,39) + "..." : student.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ student.username}}</td>
                                                    <td class="text-center">{{ student.examGroup.name.length > 40 ? student.examGroup.name.slice(0,39)  + "..."  : student.examGroup.name}}</td>
                                                    <td class="w-16">
                                                            <div v-if="student.failedAttempts >= 3" class="mx-auto">
                                                                <div
                                                                    class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                                    <p>Locked</p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                    <td class="table-report__action w-96">
                                                            <div class="flex justify-center items-centerm mr-6">
                                                                
                                                          <a class="flex items-center mr-6 text-primary" :href="`/admin/testtakers/${student.id}`">
                                                                    <Icon name="tabler:device-analytics"
                                                                        class="w-4 h-4 mr-1"></Icon> View Details
                                                                </a>
                                                               
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
                                    <div class="flex flex-row mt-3">
                                        <div class="md:block  text-slate-500">

                                        </div>
                                        <div
                                            class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                            <nav class="w-full sm:w-auto sm:mr-auto">
                                                <ul class="pagination">

                                                    <li class="page-item">
                                                        <button class="page-link" v-on:click="paginate(page - 1)"
                                                            :disabled="page === 1">
                                                            <div
                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                                                </Icon>
                                                                <span class="">Previous</span>
                                                            </div>
                                                        </button>
                                                    </li>
                                                    <li class="page-item">
                                                        <button class="page-link" v-on:click="paginate(page + 1)"
                                                            :disabled="(page) * 6 >= count!">
                                                            <div
                                                                class="flex flex-row align-middle justify-center items-center">
                                                                <span>Next</span>
                                                                <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle">
                                                                </Icon>
                                                            </div>
                                                        </button>
                                                    </li>


                                                </ul>
                                            </nav>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>




                </div>

           

              
                <div v-if="isReloading"
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                    <div class="relative  my-6 mx-auto max-w-10xl">
                        <!--content-->
                        <div class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                            <!--header-->
                            <div class="flex items-start justify-between p-5 rounded-t">
                            <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                            <!-- <button
                                                class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button" v-on:click="toggleDeleteModal()">
                                                <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                            </button> -->
                        </div>
                        <!--body-->
                        <div class="relative p-6 flex-auto">


                            <div class="flex flex-row items-center space-x-4 mx-auto">
                                <Icon name="eos-icons:bubble-loading" class="w-20 h-20 text-primary"></Icon>

                            </div>
                        </div>
                        <!--footer-->

                    </div>
                </div>
            </div>
            <div v-if="isReloading" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
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

            <Modal type="success" :show="showSuccessModal" :toggle="toggleSuccessModal" message="Success!" />
            <Modal type="error" :show="showErrorModal" :toggle="toggleErrorModal" :message="errorText" />
        </div>

    </div>
</div></template>