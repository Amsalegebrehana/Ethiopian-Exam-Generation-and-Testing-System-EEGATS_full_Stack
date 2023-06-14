<script setup lang="ts">
import AdminTopBar from '@/components/TopBar.vue'
import AdminSideBar from '@/components/admin/AdminSideBar.vue'
import { Pool } from '.prisma/client';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import Modal from '@/components/Modal.vue'
import * as zod from 'zod';
import { type } from 'os';
definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()
const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').min(2, 'Minimum of 2 characters required'));
const page = ref(1);
const searchPage = ref(1);
const searchText = ref('');
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.pool.getPoolsCount.query({}),{ watch: [page, searchText] });
const { data: pools, refresh: fetchPools, pending } = await useAsyncData(() => $client.pool.getPools.query({ skip: (page.value - 1) * 6 }),{ watch: [page, searchText] });
const { data: searchcount, refresh: fetchSearchCount } = await useAsyncData(() => $client.pool.getPoolsCount.query({ search: searchText.value !== '' ? searchText.value : undefined }), { watch: [searchPage, searchText] });
const { data: searchPools, refresh: fetchSearchPools, pending: pendingSearch } = await useAsyncData(() => $client.pool.getPools.query({ search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6 }), { watch: [searchPage, searchText] });

const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchPools();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchPools();
        await fetchSearchCount();
    } finally {
        isReloading.value = false
    }
}
const showErrorModal = ref(false);
const isReloading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const isLoading = ref(false);
const errorText = ref('');
const poolInfo = ref({
    name: '',
    id: ''
});

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
const toggleAddModal = () => {
    poolInfo.value.id = '';
    poolInfo.value.name = '';
    showAddModal.value = !showAddModal.value;
}
const handleAddPool = async () => {
    isLoading.value = true;
    try {
        const pool = await $client.pool.addPool.mutate({ name: poolInfo.value.name });
        if (pool) {
            isReloading.value = true;
            isLoading.value = false;
            showAddModal.value = false;
            poolInfo.value.name = '';
            await fetchPools();
            await fetchCount();
            isReloading.value = false;
        }
    } catch (e: any) {
        isLoading.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }

}
const toggleEditModal = () => {
    poolInfo.value.id = '';
    poolInfo.value.name = '';
    showEditModal.value = !showEditModal.value;
}

const EditModal = async (poolId: string, poolName: string) => {

    poolInfo.value.id = poolId;
    poolInfo.value.name = poolName;
    showEditModal.value = !showEditModal.value;

}
const handleEditPool = async () => {
    isLoading.value = true;
    try {
        const pool = await $client.pool.updatePool.mutate(poolInfo.value);
        if (pool) {
            isReloading.value = true;
            isLoading.value = false;
            showEditModal.value = false;
            poolInfo.value.name = '';
            await fetchPools();
            await fetchCount();
            isReloading.value = false;
        }
    } catch (e: any) {
        isLoading.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }
}
const toggleDeleteModal = () => {
    poolInfo.value.id = '';
    poolInfo.value.name = '';
    showDeleteModal.value = !showDeleteModal.value;
}

const DeleteModal = async (poolId: string, poolName: string) => {

    poolInfo.value.id = poolId;
    poolInfo.value.name = poolName;
    showDeleteModal.value = !showDeleteModal.value;

}
const handleDeletePool = async () => {

    isLoading.value = true;
    try {
        const res = await $client.pool.deletePool.mutate({ id: poolInfo.value.id });
        if (res === 'Can\'t delete pool.') {
            errorText.value = "You can't delete with a pool active questions or contributors!";
            showErrorModal.value = true;
        }
        isReloading.value = true;
        isLoading.value = false;
        showDeleteModal.value = false;
        poolInfo.value.id = '';
        poolInfo.value.name = '';
        await fetchPools();
        await fetchCount();
        isReloading.value = false;
    } catch (e: any) {
        isLoading.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }

}
</script>

<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="pools" />
            <div class="w-full mx-6">

                <h2 class="intro-y text-lg font-medium mt-10">List of Pools</h2>

                <div class="my-5 w-full">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                        <button v-on:click="toggleAddModal()" class="btn btn-primary shadow-md mr-auto"
                            data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">Create Pool
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>


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
                                <div v-if="searchPools?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No pools found</p>
                                </div>
                                <div v-if="searchPools?.length !== 0">

                                    <table class="table table-report -mt-2">
                                        <thead>
                                            <tr>
                                                <th class="whitespace-nowrap"></th>
                                                <th class="whitespace-nowrap">POOL NAME</th>
                                                <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                                            </tr>
                                        </thead>



                                        <tbody>
                                            <tr v-for="pool in searchPools" :key="pool.id" class="intro-x">
                                                <td class="w-10">
                                                    <NuxtLink :to="`/admin/pools/${pool.id}`">
                                                        <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>
                                                    </NuxtLink>
                                                </td>
                                                <td>
                                                    <NuxtLink :to="`/admin/pools/${pool.id}`"
                                                        class="font-medium whitespace-nowrap">{{
                                                            pool.name.length > 40 ? pool.name.substring(0,40) + '...' : pool.name
                                                        }}</NuxtLink>

                                                </td>
                                                <td class="text-center">{{ pool._count.Questions }}</td>

                                                <td class="table-report__action w-96">
                                                    <div class="flex justify-center items-center">
                                                        <a class="flex items-center mr-6 text-primary" :href="`/admin/pools/${pool.id}`">
                                                                    <Icon name="tabler:device-analytics"
                                                                        class="w-4 h-4 mr-1"></Icon> View Details
                                                                </a>
                                                      
                                                        <a class="flex items-center mr-6 text-success" href="javascript:;"
                                                            @click="EditModal(pool.id, pool.name)">
                                                            <Icon name="material-symbols:edit-outline" class="w-4 h-4"></Icon> Edit
                                                        </a>
                                                        <a class="flex items-center text-danger" href="javascript:;"
                                                            @click="DeleteModal(pool.id, pool.name)">
                                                            <Icon name="fa6-regular:trash-can" class="w-4 h-4 mr-1"></Icon>
                                                            Delete
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
                                <div v-if="pools?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No pools found</p>
                                </div>
                                <div v-if="pools?.length !== 0">

                                    <table class="table table-report -mt-2">
                                        <thead>
                                            <tr>
                                                <th class="whitespace-nowrap"></th>
                                                <th class="whitespace-nowrap">POOL NAME</th>
                                                <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                                            </tr>
                                        </thead>



                                        <tbody>
                                            <tr v-for="pool in pools" :key="pool.id" class="intro-x">
                                                <td class="w-10">
                                                    <NuxtLink :to="`/admin/pools/${pool.id}`">
                                                        <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>
                                                    </NuxtLink>
                                                </td>
                                                <td>
                                                    <NuxtLink :to="`/admin/pools/${pool.id}`"
                                                        class="font-medium whitespace-nowrap">{{
                                                             pool.name.length > 60 ? pool.name.substring(0,60) + '...' : pool.name
                                                        }}</NuxtLink>

                                                </td>
                                                <td class="text-center">{{ pool._count.Questions }}</td>

                                                <td class="table-report__action w-96">
                                                    <div class="flex justify-center items-center">
                                                        <a class="flex items-center mr-6 text-primary" :href="`/admin/pools/${pool.id}`">
                                                                    <Icon name="tabler:device-analytics"
                                                                        class="w-4 h-4 mr-1"></Icon> View Details
                                                                </a>
                                                      
                                                        <a class="flex items-center mr-6 text-success" href="javascript:;"
                                                            @click="EditModal(pool.id, pool.name)">
                                                            <Icon name="material-symbols:edit-outline" class="w-4 h-4"></Icon> Edit
                                                        </a>
                                                        <a class="flex items-center text-danger" href="javascript:;"
                                                            @click="DeleteModal(pool.id, pool.name)">
                                                            <Icon name="fa6-regular:trash-can" class="w-4 h-4 mr-1"></Icon>
                                                            Delete
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

                <div>

                    <div v-if="showAddModal"
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
                                        type="button" v-on:click="toggleAddModal()">
                                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">

                                    <div class="flex flex-row align-middle mt-2">

                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Question pool Name</p>

                                        <Form class="w-full">
                                            <ErrorMessage name="addpoolInfoName" class=" text-red-500" />
                                            <Field name="addpoolInfoName" type="text"
                                                class="intro-x login__input form-control py-3 block"
                                                placeholder="Enter Pool Name" v-model="poolInfo.name"
                                                :rules="fieldSchema" />
                                        </Form>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleAddPool()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                        :disabled="isLoading || poolInfo.name.length < 2">
                                        <div v-if="isLoading || pending">
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
                    <div v-if="showAddModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
                <div>

                    <div v-if="showEditModal"
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
                                        type="button" v-on:click="toggleEditModal()">
                                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                    <div class="flex flex-row align-middle">
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Question pool Name</p>
                                        <Form class="w-full">
                                            <ErrorMessage name="editpoolInfoName" class=" text-red-500" />
                                            <Field name="editpoolInfoName" type="text"
                                                class="intro-x login__input form-control py-3 block"
                                                placeholder="Enter Pool Name" v-model="poolInfo.name"
                                                :rules="fieldSchema" />
                                        </Form>
                                        <!-- <input type="text" class="intro-x login__input form-control py-3 px-4 block"
                                            placeholder="Enter Pool Name" v-model="poolInfo.name"> -->
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleEditPool()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                        :disabled="isLoading || poolInfo.name.length < 2">
                                        <div v-if="isLoading || pending">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Update
                                        </div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="showEditModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>


                <div v-if="showDeleteModal"
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
                                    type="button" v-on:click="toggleDeleteModal()">
                                    <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                </button>
                            </div>
                            <!--body-->
                            <div class="relative p-6 flex-auto">

                                <div class="flex flex-row items-center space-x-4 mx-auto">
                                    <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                                    <p class=" font-bold text-lg text-center">Are you sure you want to delete pool "{{
                                        poolInfo.name }}"</p>
                                </div>
                            </div>
                            <!--footer-->
                            <div
                                class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                                <button @click="toggleDeleteModal()"
                                    class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                    :class="{ 'hidden': isLoading }" :disabled="isLoading">
                                    Cancel
                                </button>

                                <button @click="handleDeletePool()"
                                    class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                    :disabled="isLoading">
                                    <div v-if="isLoading || pending">
                                        <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                    </div>
                                    <div v-else>
                                        Delete
                                    </div>
                                </button>



                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showDeleteModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
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

            <Modal type="success" :show="showSuccessModal" :toggle="toggleSuccessModal" message="Success!" />
            <Modal type="error" :show="showErrorModal" :toggle="toggleErrorModal" :message="errorText" />
        </div>

    </div>
</div></template>