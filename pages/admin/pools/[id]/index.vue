<script setup lang="ts" >
import AdminTopBar from '~~/components/TopBar.vue';
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import Loading from "~~/components/Loading.vue";
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { Category, ContributorAssignment } from '@prisma/client';
definePageMeta({ middleware: 'is-admin' })
const route = useRoute();
const activeTab = ref(1);
const poolId = route.params.id as string;
const { $client } = useNuxtApp()
const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').email("Must be a valid email"));
const contributorEmail = ref("");

const newPassword = ref('');
const contrInfo = ref({
    questionNumber: 0,
    id: '',
    name: '',
    isActive : true
});
const catInfo = ref({
    id: "",
    name: "",
    numberofQuestions: 0
});
const { data: poolInfo } = await useAsyncData(() => $client.pool.getPool.query({ id: poolId! }));

const pageCat = ref(1);
const searchPageCat = ref(1);
const searchTextCat = ref('');

const { data: countCat, refresh: fetchCountCat } = await useAsyncData(() => $client.category.getCategoryCount.query({ poolId }), { watch: [pageCat, searchTextCat] });
const { data: categories, refresh: fetchCategories, pending } = await useAsyncData(() => $client.category.getAllCategories.query({ skip: (pageCat.value - 1) * 6, poolId }), { watch: [pageCat, searchTextCat] });
const { data: searchCountCat, refresh: fetchSearchCountCat } = await useAsyncData(() => $client.category.getCategoryCount.query({ search: searchTextCat.value !== '' ? searchTextCat.value : undefined, poolId }), { watch: [searchPageCat, searchTextCat] });
const { data: searchCategories, refresh: fetchSearchCategories, pending: pendingSearch } = await useAsyncData(() => $client.category.getAllCategories.query({ search: searchTextCat.value !== '' ? searchTextCat.value : undefined, poolId, skip: (searchPageCat.value - 1) * 6 }), { watch: [searchPageCat, searchTextCat] });

const paginateCat = async (newPage: number) => {
    pageCat.value = newPage;
    isReloading.value = true;
    try {
        await fetchCategories();
        await fetchCountCat();
    } finally {
        isReloading.value = false
    }
}

const paginateSearchCat = async (newPage: number) => {
    searchPageCat.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchCategories();
        await fetchSearchCountCat();
    } finally {
        isReloading.value = false
    }
}

const pageContr = ref(1);
const searchPageContr = ref(1);
const searchTextContr = ref('');

const { data: countContr, refresh: fetchCountContr } = await useAsyncData(() => $client.pool.getPoolContributorsCount.query({ poolId }), { watch: [pageContr, searchTextContr] });
const { data: contributors, refresh: fetchContributors } = await useAsyncData(() => $client.pool.getPoolContributors.query({ skip: (pageContr.value - 1) * 6, poolId }), { watch: [pageContr, searchTextContr] });
const { data: searchCountContr, refresh: fetchSearchCountContr } = await useAsyncData(() => $client.pool.getPoolContributorsCount.query({ search: searchTextContr.value !== '' ? searchTextContr.value : undefined, poolId }), { watch: [searchPageContr, searchTextContr] });
const { data: searchContributors, refresh: fetchSearchContributors } = await useAsyncData(() => $client.pool.getPoolContributors.query({ search: searchTextContr.value !== '' ? searchTextContr.value : undefined, poolId, skip: (searchPageContr.value - 1) * 6 }), { watch: [searchPageContr, searchTextContr] });

const paginateContr = async (newPage: number) => {
    pageContr.value = newPage;
    isReloading.value = true;
    try {
        await fetchContributors();
        await fetchCountContr();
    } finally {
        isReloading.value = false
    }
}

const paginateSearchContr = async (newPage: number) => {
    searchPageContr.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchContributors();
        await fetchSearchCountContr();
    } finally {
        isReloading.value = false
    }
}

const resetSearch = () => {
    if (searchTextCat.value === "") {
        searchPageCat.value = 1;
        pageCat.value = 1;
    }
    if (searchTextContr.value === "") {
        searchPageContr.value = 1;
        pageContr.value = 1;
    }
}

const isContModal = ref(false);
const isReloading = ref(false);
const isLoading = ref(false);
const isReloadingCat = ref(false);
const isLoadingCat = ref(false);
const isInviteSuccess = ref(false);
const isInviteDup = ref(false);
const isEmailInvalid = ref(false);
const isAssignedtoAnotherPool = ref(false);
const isLoadingResetPassword = ref(false);
const showInv = ref(true);
const showInviteModal = ref(false);

const showResetPasswordModal = ref(false);
const showDeleteContModal = ref(false);
const showDeleteCatModal = ref(false);
const showEditModal = ref(false);
const showAddModal = ref(false);


const toggleInviteModal = () => {
    contributorEmail.value = '';
    showInv.value = true;
    showInviteModal.value = !showInviteModal.value;
}

const handleInviteContributor = async () => {
    isLoading.value = true;
    try {
        const res = await $client.contributor.inviteContributor.mutate({ email: contributorEmail.value, poolId: poolId! });
        isLoading.value = false;
        showInv.value = false;
        isEmailInvalid.value = false;
        isInviteDup.value = false;
        isInviteSuccess.value = true;
    } catch (e: any) {
        showInv.value = false;
        if (e.message == "Invalid Email!") {
            isEmailInvalid.value = true;
            contributorEmail.value = "";
        }
        if (e.message == 'Already a member of this pool') {
            isInviteDup.value = true;
            contributorEmail.value = '';
        }
        if(e.message == "Already assigned"){
            isAssignedtoAnotherPool.value = true;
            contributorEmail.value = "";
        }
        if (e.message === true) {
            isInviteSuccess.value = false;
            contributorEmail.value = '';
        }
        isLoading.value = false;
        
    }
}
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
        const pass = await $client.contributor.adminResetPassword.mutate({ id: contrId });
        newPassword.value = pass;
        isLoadingResetPassword.value = false;
    } catch (error) {
        isLoadingResetPassword.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }
}
const isCopied = ref(false);
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




const toggleAddModal = () => {
    catInfo.value.id = '';
    catInfo.value.name = '';
    showAddModal.value = !showAddModal.value;
}
const handleAddCategory = async () => {
    isLoadingCat.value = true;
    try {
        const category = await $client.category.addCategory.mutate({ name: catInfo.value.name, numOfQuestions: catInfo.value.numberofQuestions, poolId: poolId });
        if (category) {
            isReloadingCat.value = true;
            isLoadingCat.value = false;
            showAddModal.value = false;
            catInfo.value.name = '';
            await fetchCategories();
            await fetchCountCat();
            isReloadingCat.value = false;
        }
    } catch (e: any) {
        isLoadingCat.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }

}

const toggleEditModal = () => {
    catInfo.value.id = '';
    catInfo.value.name = '';
    showEditModal.value = !showEditModal.value;
}

const EditModal = async (catId: string, catName: string) => {

    catInfo.value.id = catId;
    catInfo.value.name = catName;
    showEditModal.value = !showEditModal.value;

}
const handleEditPool = async () => {
  
    isLoadingCat.value = true;
    try {
        const category = await $client.category.updateCategory.mutate(catInfo.value);
        if (category) {
            isReloadingCat.value = true;
            isLoadingCat.value = false;
            showEditModal.value = false;
            catInfo.value.id = '';
            await fetchCategories();
            await fetchCountCat();
            catInfo.value.name = '';
            isReloadingCat.value = false;
        }
    } catch (e: any) {
        isLoadingCat.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
    }


}


const toggleDeleteContModal = () => {
    contrInfo.value.id = '';
    contrInfo.value.name = '';
    showDeleteContModal.value = !showDeleteContModal.value;
}

const toggleDeleteCatModal = () => {
    catInfo.value.id = '';
    catInfo.value.name = '';
    showDeleteCatModal.value = !showDeleteCatModal.value;
}

const DeleteContModal = async (contrId: string, contrName: string, isActive:boolean) => {

    contrInfo.value.id = contrId;
    contrInfo.value.name = contrName;
    contrInfo.value.isActive = isActive;
    showDeleteContModal.value = !showDeleteContModal.value;

}

const DeleteCatModal = async (catId: string, catName: string) => {

    catInfo.value.id = catId;
    catInfo.value.name = catName;
    showDeleteCatModal.value = !showDeleteCatModal.value;

}

const handleDeleteCategory = async () => {
    isLoadingCat.value = true;
    try {
        const res = await $client.category.deleteCategory.mutate({ id: catInfo.value.id });
        if (res === 'Can\'t delete category.') {
            errorText.value = "You can't delete a category with active questions!";
            showErrorModal.value = true;
            setTimeout(() => {
                showErrorModal.value = false;
            }, 2000);
        }
        isReloadingCat.value = true;
        isLoadingCat.value = false;
        showDeleteCatModal.value = false;
        catInfo.value.id = '';
        catInfo.value.name = '';
        await fetchCategories();
        await fetchCountCat();
        isReloadingCat.value = false;
    } catch (e: any) {
        isLoadingCat.value = false;
        errorText.value = "Failed. Please check your internet and try again later.";
        showErrorModal.value = true;
        setTimeout(() => {
            showErrorModal.value = false;
        }, 2000);
    }

}

const handleDisableContributor = async () => {
    isLoading.value = true;
    await $client.contributor.disableContributor.mutate({ id: contrInfo.value.id });
    isReloading.value = true;
    isLoading.value = false;
    showDeleteContModal.value = false;
    contrInfo.value.id = '';
    contrInfo.value.name = '';
    await fetchContributors();
    await fetchCountContr();
    isReloading.value = false;
}





</script>
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex" :class="{'fixed w-full' : showAddModal || showDeleteCatModal || showDeleteContModal || showEditModal || showErrorModal || showInviteModal}">

            <AdminSideBar pageName="pools" />
            <div class="w-full mx-6 content middle mt-20 ">
                <div class="flex flex-row w-full align-middle justify-between  mt-10">
                    <div class="justify-start flex flex-row">

                        <NuxtLink :to="`/admin/pools`">
                            <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                        </NuxtLink>
                        <h2 class="intro-y text-lg font-medium ">{{ poolInfo?.name }}</h2>
                    </div>


                    <div class="flex flex-row justify-end">
                        <a class="btn btn-primary shadow-md mt-5 mr-4 text-white"
                            :href="`/admin/pools/${poolId}/analytics`">Analytics
                            <Icon name="tabler:device-analytics" class="w-6 h-6 ml-2 text-white"></Icon>
                        </a>

                    </div>
                </div>

                <div class="mx-5 mt-5">

                    <ul class="nav nav-link-tabs" role="tablist">
                        <li id="example-5-tab" class="nav-item flex-1" role="presentation">
                            <button class="nav-link w-full py-2 text-gray-200 " @click="activeTab = 1"
                                :class="{ 'active text-xl': activeTab === 1 }" data-tw-toggle="pill"
                                data-tw-target="#example-tab-5" type="button" role="tab" aria-controls="example-tab-5"
                                aria-selected="true">
                                Categories
                            </button>
                        </li>
                        <li id="example-6-tab" class="nav-item flex-1" role="presentation">
                            <button class="nav-link w-full py-2" @click="activeTab = 2"
                                :class="{ 'active text-xl': activeTab === 2 }" data-tw-toggle="pill"
                                data-tw-target="#example-tab-6" type="button" role="tab" aria-controls="example-tab-6"
                                aria-selected="true">
                                Contributors
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content mt-5">

                        <div id="example-tab-5" class="tab-pane leading-relaxed " role="tabpanel"
                            aria-labelledby="example-5-tab" :class="{ 'active': activeTab === 1 }">
                            <div class="w-full mx-6">
                                <div class="my-5 w-full">
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                                        <button v-on:click="toggleAddModal()" class="btn btn-primary shadow-md mr-auto"
                                            data-modal-target="authentication-modal"
                                            data-modal-toggle="authentication-modal">
                                            Add Category
                                            <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                                        </button>


                                        <div class=" ml-auto mt-3 sm:mt-0 ">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10"
                                                    placeholder="Search..." v-model="searchTextCat" @change="resetSearch" />
                                                <Icon name="carbon:search"
                                                    class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                                                </Icon>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-full mt-10">

                                        <div v-if="searchTextCat != ''">

                                            <div class="intro-y col-span-12 overflow-auto lg:overflow-visible w-full">
                                                <div v-if="searchCategories?.length == 0"
                                                    class="w-full text-center text-lg mt-10 h-full">
                                                    <p>No Categories found</p>
                                                </div>
                                                <div v-if="searchCategories?.length !== 0">

                                                    <table class="table table-report -mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th class="whitespace-nowrap"></th>
                                                                <th class="whitespace-nowrap">Name</th>
                                                                <th class="text-center whitespace-nowrap">Number of
                                                                    Questions</th>
                                                                <th class="text-center whitespace-nowrap">ACTIONS</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="cateogry in searchCategories" :key="cateogry.id"
                                                                class="intro-x">
                                                                <td class="w-10">

                                                                    <Icon name="iconoir:page" class="w-6 h-6"></Icon>

                                                                </td>
                                                                <td class="font-medium whitespace-nowrap">{{
                                                                    cateogry.name.length > 40 ? cateogry.name.slice(0, 39) +
                                                                "..." : cateogry.name
                                                                }}

                                                                </td>
                                                                <td class="text-center">{{ cateogry.numOfQuestions }}</td>

                                                                <td class="table-report__action w-56 ">
                                                                    <div class="flex justify-center space-x-4 items-center">
                                                                        <button class="text-success flex items-center mr-3"
                                                                            @click="EditModal(cateogry.id, cateogry.name)">
                                                                            <Icon name="material-symbols:edit-outline"
                                                                                class="w-4 h-4"></Icon> Edit
                                                                        </button>


                                                                        <a class="flex items-center text-danger"
                                                                            href="javascript:;"
                                                                            @click="DeleteCatModal(cateogry.id, cateogry.name)">
                                                                            <Icon name="fa6-regular:trash-can"
                                                                                class="w-4 h-4 mr-1">
                                                                            </Icon> Delete
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
                                                                        <button class="page-link"
                                                                            v-on:click="paginateSearchCat(searchPageCat - 1)"
                                                                            :disabled="searchPageCat === 1">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                                <Icon name="mdi:chevron-left"
                                                                                    class="h-4 w-4 align-middle">
                                                                                </Icon>
                                                                                <span class="">Previous</span>
                                                                            </div>
                                                                        </button>
                                                                    </li>
                                                                    <li class="page-item">
                                                                        <button class="page-link"
                                                                            v-on:click="paginateSearchCat(searchPageCat + 1)"
                                                                            :disabled="(searchPageCat) * 6 >= searchCountCat!">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center">
                                                                                <span>Next</span>
                                                                                <Icon name="mdi:chevron-right"
                                                                                    class="h-4 w-4 align-middle">
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
                                                <div v-if="categories?.length == 0"
                                                    class="w-full text-center text-lg mt-10 h-full">
                                                    <p>No Categories found</p>
                                                </div>
                                                <div v-if="categories?.length !== 0">

                                                    <table class="table table-report -mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th class="whitespace-nowrap"></th>
                                                                <th class="whitespace-nowrap">Name</th>
                                                                <th class="text-center whitespace-nowrap">Number of
                                                                    Questions</th>
                                                                <th class="text-center whitespace-nowrap">ACTIONS</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="cateogry in categories" :key="cateogry.id"
                                                                class="intro-x">
                                                                <td class="w-10">

                                                                    <Icon name="iconoir:page" class="w-6 h-6"></Icon>

                                                                </td>
                                                                <td class="font-medium whitespace-nowrap">{{
                                                                    cateogry.name.length > 40 ? cateogry.name.slice(0, 39) +
                                                                "..." : cateogry.name
                                                                }}

                                                                </td>
                                                                <td class="text-center">{{ cateogry.numOfQuestions }}</td>

                                                                <td class="table-report__action w-56 ">
                                                                    <div class="flex justify-center space-x-4 items-center">
                                                                        <button class="text-success flex items-center mr-3"
                                                                            @click="EditModal(cateogry.id, cateogry.name)">
                                                                            <Icon name="material-symbols:edit-outline"
                                                                                class="w-4 h-4"></Icon> Edit
                                                                        </button>


                                                                        <a class="flex items-center text-danger"
                                                                            href="javascript:;"
                                                                            @click="DeleteCatModal(cateogry.id, cateogry.name)">
                                                                            <Icon name="fa6-regular:trash-can"
                                                                                class="w-4 h-4 mr-1">
                                                                            </Icon> Delete
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
                                                                        <button class="page-link"
                                                                            v-on:click="paginateCat(pageCat - 1)"
                                                                            :disabled="pageCat === 1">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                                <Icon name="mdi:chevron-left"
                                                                                    class="h-4 w-4 align-middle">
                                                                                </Icon>
                                                                                <span class="">Previous</span>
                                                                            </div>
                                                                        </button>
                                                                    </li>
                                                                    <li class="page-item">
                                                                        <button class="page-link"
                                                                            v-on:click="paginateCat(pageCat + 1)"
                                                                            :disabled="(pageCat) * 6 >= countCat!">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center">
                                                                                <span>Next</span>
                                                                                <Icon name="mdi:chevron-right"
                                                                                    class="h-4 w-4 align-middle">
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

                            </div>

                        </div>




                        <div id="example-tab-5" class="tab-pane leading-relaxed p-2" role="tabpanel"
                            aria-labelledby="example-5-tab" :class="{ 'active': activeTab === 2 }">
                            <div class="w-full mx-6">
                                <div class="my-5 w-full">
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                                        <button v-on:click="toggleInviteModal()" class="btn btn-primary shadow-md mr-auto"
                                            data-modal-target="authentication-modal"
                                            data-modal-toggle="authentication-modal">Invite
                                            <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                                        </button>


                                        <div class=" ml-auto mt-3 sm:mt-0 ">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10"
                                                    placeholder="Search..." v-model="searchTextContr"
                                                    @change="resetSearch" />
                                                <Icon name="carbon:search"
                                                    class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="w-full mt-10">

                                        <div v-if="searchTextContr != ''">

                                            <div class="intro-y col-span-12 overflow-auto lg:overflow-visible w-full">
                                                <div v-if="searchContributors?.length == 0"
                                                    class="w-full text-center text-lg mt-10 h-full">
                                                    <p>No Contributors found</p>
                                                </div>
                                                <div v-if="searchContributors?.length !== 0">

                                                    <table class="table table-report -mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th class="whitespace-nowrap"></th>
                                                                <th class="whitespace-nowrap">NAME</th>
                                                                <th class="text-center whitespace-nowrap">E-mail</th>
                                                                <th class="text-center whitespace-nowrap">Questions Assigned
                                                                </th>
                                                                <th class="whitespace-nowrap"> </th>
                                                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr>

                                                            </tr>

                                                            <tr v-for="contributor in searchContributors"
                                                                :key="contributor.id" class="intro-x">
                                                                <td class="w-10">
                                                                    <NuxtLink
                                                                        :to="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`">
                                                                        <Icon name="akar-icons:people-group"
                                                                            class="w-6 h-6">
                                                                        </Icon>
                                                                    </NuxtLink>

                                                                </td>
                                                                <td>
                                                                    <NuxtLink
                                                                        :to="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`"
                                                                        class="font-medium whitespace-nowrap">{{
                                                                            contributor.name.length > 40 ?
                                                                            contributor.name.slice(0, 39) +
                                                                            "..." : contributor.name
                                                                        }}</NuxtLink>

                                                                </td>
                                                                <td class="text-center">{{ contributor.email }}
                                                                </td>
                                                                <td class="text-center">{{ contributor.reviewsMade }}</td>
                                                                <td class="w-16">
                                                                    <div v-if="contributor.failedAttempts >= 3"
                                                                        class="mx-auto">
                                                                        <div
                                                                            class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                                            <p>Locked</p>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td class="table-report__action w-96">
                                                                    <div class="flex justify-center items-center">
                                                                        <a class="flex items-center mr-6 text-primary"
                                                                            :href="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`">
                                                                            <Icon
                                                                                name="material-symbols:assignment-add-outline"
                                                                                class="w-4 h-4 mr-1"></Icon> Assign
                                                                        </a>
                                                                        <a class="flex items-center mr-6"
                                                                            href="javascript:;"
                                                                            @click="ResetPasswordModal(contributor.id)">
                                                                            <Icon name="material-symbols:key-rounded"
                                                                                class="w-4 h-4 mr-1"></Icon> Reset Password
                                                                        </a>
                                                                        <div v-if="contributor.isActive">

                                                                            <a class="flex items-center text-danger"
                                                                                href="javascript:;"
                                                                                @click="DeleteContModal(contributor.id, contributor.name, contributor.isActive)">
                                                                                <Icon name="fluent-mdl2:cancel"
                                                                                    class="w-4 h-4 mr-1">
                                                                                </Icon> Disable
                                                                            </a>
                                                                        </div>
                                                                        <div v-else>
                                                                            <a class="flex items-center text-success"
                                                                                href="javascript:;"
                                                                                @click="DeleteContModal(contributor.id, contributor.name, contributor.isActive)">
                                                                                <Icon name="fluent:checkmark-20-filled"
                                                                                    class="w-4 h-4 mr-1">
                                                                                </Icon> Enable
                                                                            </a>
                                                                        </div>
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
                                                                        <button class="page-link"
                                                                            v-on:click="paginateSearchContr(searchPageContr - 1)"
                                                                            :disabled="searchPageContr === 1">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                                <Icon name="mdi:chevron-left"
                                                                                    class="h-4 w-4 align-middle">
                                                                                </Icon>
                                                                                <span class="">Previous</span>
                                                                            </div>
                                                                        </button>
                                                                    </li>
                                                                    <li class="page-item">
                                                                        <button class="page-link"
                                                                            v-on:click="paginateSearchContr(searchPageContr + 1)"
                                                                            :disabled="(searchPageContr) * 6 >= searchCountContr!">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center">
                                                                                <span>Next</span>
                                                                                <Icon name="mdi:chevron-right"
                                                                                    class="h-4 w-4 align-middle">
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
                                                <div v-if="contributors?.length == 0"
                                                    class="w-full text-center text-lg mt-10 h-full">
                                                    <p>No contributors found</p>
                                                </div>
                                                <div v-if="contributors?.length !== 0">

                                                    <table class="table table-report -mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th class="whitespace-nowrap"></th>
                                                                <th class="whitespace-nowrap">NAME</th>
                                                                <th class="text-center whitespace-nowrap">E-mail</th>
                                                                <th class="text-center whitespace-nowrap">Questions Assigned
                                                                </th>
                                                                <th class="whitespace-nowrap"> </th>
                                                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr>

                                                            </tr>

                                                            <tr v-for="contributor in contributors" :key="contributor.id"
                                                                class="intro-x">
                                                                <td class="w-10">
                                                                    <NuxtLink
                                                                        :to="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`">
                                                                        <Icon name="akar-icons:people-group"
                                                                            class="w-6 h-6">
                                                                        </Icon>
                                                                    </NuxtLink>

                                                                </td>
                                                                <td>
                                                                    <NuxtLink
                                                                        :to="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`"
                                                                        class="font-medium whitespace-nowrap">{{
                                                                            contributor.name.length > 40 ?
                                                                            contributor.name.slice(0, 39) +
                                                                            "..." : contributor.name
                                                                        }}</NuxtLink>

                                                                </td>
                                                                <td class="text-center">{{ contributor.email }}
                                                                </td>
                                                                <td class="text-center">{{ contributor.reviewsMade }}</td>
                                                                <td class="w-16">
                                                                    <div v-if="contributor.failedAttempts >= 3"
                                                                        class="mx-auto">
                                                                        <div
                                                                            class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                                            <p>Locked</p>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td class="table-report__action w-96">
                                                                    <div class="flex justify-center items-center">
                                                                        <a class="flex items-center mr-6 text-primary"
                                                                            :href="`/admin/pools/${poolId}/assign-contributor?contrId=${contributor.id}`">
                                                                            <Icon
                                                                                name="material-symbols:assignment-add-outline"
                                                                                class="w-4 h-4 mr-1"></Icon> Assign
                                                                        </a>
                                                                        <a class="flex items-center mr-6"
                                                                            href="javascript:;"
                                                                            @click="ResetPasswordModal(contributor.id)">
                                                                            <Icon name="material-symbols:key-rounded"
                                                                                class="w-4 h-4 mr-1"></Icon> Reset Password
                                                                        </a>
                                                                        <div v-if="contributor.isActive">

                                                                            <a class="flex items-center text-danger"
                                                                                href="javascript:;"
                                                                                @click="DeleteContModal(contributor.id, contributor.name, contributor.isActive)">
                                                                                <Icon name="fluent-mdl2:cancel"
                                                                                    class="w-4 h-4 mr-1">
                                                                                </Icon> Disable
                                                                            </a>
                                                                        </div>
                                                                        <div v-else>
                                                                            <a class="flex items-center text-success"
                                                                                href="javascript:;"
                                                                                @click="DeleteContModal(contributor.id, contributor.name, contributor.isActive)">
                                                                                <Icon name="fluent:checkmark-20-filled"
                                                                                    class="w-4 h-4 mr-1">
                                                                                </Icon> Enable
                                                                            </a>
                                                                        </div>
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
                                                                        <button class="page-link"
                                                                            v-on:click="paginateContr(pageContr - 1)"
                                                                            :disabled="pageContr === 1">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center  ">
                                                                                <Icon name="mdi:chevron-left"
                                                                                    class="h-4 w-4 align-middle">
                                                                                </Icon>
                                                                                <span class="">Previous</span>
                                                                            </div>
                                                                        </button>
                                                                    </li>
                                                                    <li class="page-item">
                                                                        <button class="page-link"
                                                                            v-on:click="paginateContr(pageContr + 1)"
                                                                            :disabled="(pageContr) * 6 >= countContr!">
                                                                            <div
                                                                                class="flex flex-row align-middle justify-center items-center">
                                                                                <span>Next</span>
                                                                                <Icon name="mdi:chevron-right"
                                                                                    class="h-4 w-4 align-middle">
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

                            </div>


                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>

   
    <div v-if="showInviteModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
        <div v-if="showInviteModal"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center">
                    <!--header-->
                    <div class="flex items-end ml-auto justify-between p-5 border-solid border-slate-200 rounded-t">
                        <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                        <button
                            class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="toggleInviteModal()">
                            <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                        </button>
                    </div>
                    <div v-if="isInviteSuccess && !showInv">

                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="clarity:success-standard-line" class="w-20 h-20 text-green-600"></Icon>
                            <p class=" font-bold text-lg text-center">Invite successfully sent!</p>
                        </div>
                    </div>
                    <div v-if="isInviteDup && !showInv">
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-lg text-center">Already a member of this pool! Please try again with another email.</p>
                        </div>
                    </div>

                    <div v-else-if="isEmailInvalid && !showInv">
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-lg text-center">Invalid Email! Please try again.</p>
                        </div>
                    </div>

                    <div v-else-if="isAssignedtoAnotherPool && !showInv">
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-lg text-center">Already a member of another pool!</p>
                        </div>
                    </div>
                    <!--body-->
                    <div class="relative p-6 flex-auto">
                        <div v-if="showInv">

                            <div class="flex flex-row align-middle mt-2">

                                <p class="w-8/12 align-middle my-auto font-bold text-lg">Contributor's Email</p>

                                <Form class="w-full">
                                    <ErrorMessage name="addContributor" class=" text-red-500" />
                                    <Field name="addContributor" type="text"
                                        class="intro-x login__input form-control py-3 block"
                                        placeholder="Enter Contributor's Email" v-model="contributorEmail"
                                        :rules="fieldSchema" />

                                </Form>
                            </div>
                        </div>
                        <!--footer-->
                    </div>
                    <div v-if="showInv">
                        <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b ">

                            <button @click="handleInviteContributor()"
                                class="bg-primary rounded-xl  text-white py-3 px-4 text-center"
                                :disabled="isLoading || contributorEmail === ''">
                                <div v-if="isLoading">
                                    <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                </div>
                                <div v-else>
                                    Invite
                                </div>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
 </div>



        <div v-if="showAddModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
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

                            <p class="w-8/12 align-middle my-auto font-bold text-lg">Category Name</p>

                            <Form class="w-full">
                                <ErrorMessage name="addcatInfoName" class=" text-red-500" />
                                <Field name="addcatInfoName" type="text"
                                    class="intro-x login__input form-control py-3 block" placeholder="Enter Category Name"
                                    v-model="catInfo.name" />
                            </Form>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                        <button @click="handleAddCategory()"
                            class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                            :disabled="isLoadingCat || catInfo.name.length < 2">
                            <div v-if="isLoadingCat || pending">
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

        <div v-if="showEditModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
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
                            <p class="w-8/12 align-middle my-auto font-bold text-lg">Category Name</p>
                            <Form class="w-full">
                                <ErrorMessage name="editpoolInfoName" class=" text-red-500" />
                                <Field name="editpoolInfoName" type="text"
                                    class="intro-x login__input form-control py-3 block" placeholder="Enter Pool Name"
                                    v-model="catInfo.name" />
                            </Form>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                        <button @click="handleEditPool()"
                            class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                            :disabled="isLoadingCat || catInfo.name.length < 2">
                            <div v-if="isLoadingCat || pending">
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
    </div>
    <div v-if="showDeleteCatModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
    <div v-if="showDeleteCatModal"
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
                        type="button" v-on:click="toggleDeleteCatModal()">
                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                    </button>
                </div>
                <!--body-->
                <div class="relative p-6 flex-auto">

                    <div class="flex flex-row items-center space-x-4 mx-auto">
                        <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                        <p class=" font-bold text-lg text-center">Are you sure you want to delete {{ catInfo.name
                        }}'s category?'</p>
                    </div>
                </div>
                <!--footer-->
                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                    <button @click="toggleDeleteCatModal()"
                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                        :class="{ 'hidden': isLoading }" :disabled="isLoading">
                        Cancel
                    </button>

                    <button @click="handleDeleteCategory()"
                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoadingCat">
                        <div v-if="isLoadingCat || pending">
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
</div>
    <div v-if="showDeleteContModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
        <div v-if="showDeleteContModal"
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
                            type="button" v-on:click="toggleDeleteContModal()">
                            <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                        </button>
                    </div>
                    <!--body-->
                    <div class="relative p-6 flex-auto">

                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-lg text-center">Are you sure you want to {{contrInfo.isActive ? 'disable' : 'enable'}} {{ contrInfo.name
                            }}'s contributor account?'</p>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                        <button @click="toggleDeleteContModal()"
                            class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                            :class="{ 'hidden': isLoading }" :disabled="isLoading">
                            Cancel
                        </button>

                        <button @click="handleDisableContributor()"
                            class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading">
                            <div v-if="isLoading || pending">
                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                            </div>
                            <div v-else>
                                {{contrInfo.isActive ? 'Disable' : 'Enable'}}
                            </div>
                        </button>



                    </div>
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="isReloading || isContModal" />
    <div v-if="showResetPasswordModal" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
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
                                        <input class="form-control bg-slate-100 p-2" id="copyInput" :value="newPassword" />

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
    </div>
    <Modal type="error" :show="showErrorModal" :toggle="toggleErrorModal" :message="errorText" />
</template>

<style scoped>
.middle {
    margin-left: 13vmax;
}

.w-full.overflow-y-auto {
    height: calc(100vh - 4rem - 3.5rem);
    /* Adjust the height according to your needs */
}</style>