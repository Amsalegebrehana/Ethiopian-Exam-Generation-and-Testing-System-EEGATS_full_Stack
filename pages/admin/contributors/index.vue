
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="contributors" />
            <div class="w-full mx-6 mt-24">

                <h2 class="intro-y text-lg font-medium mt-10">List of Contributors</h2>
                <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                                       
                                        <div class=" ml-auto mt-3 sm:mt-0 ">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10"
                                                    placeholder="Search..." v-model="searchTextContr" @change="resetSearch" />
                                                <Icon name="carbon:search"
                                                    class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>

                                            </div>
                                        </div>
                                    </div>
                <div class="w-full mt-10">

                    <div v-if="searchTextContr != ''">

                        <div class="intro-y col-span-12 overflow-auto lg:overflow-visible w-full">
                            <div v-if="searchContributors?.length == 0" class="w-full text-center text-lg mt-10 h-full">
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

                                        <tr v-for="contributor in searchContributors" :key="contributor.id" class="intro-x">
                                            <td class="w-10">
                                                <NuxtLink
                                                    :to="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`">
                                                    <Icon name="akar-icons:people-group" class="w-6 h-6">
                                                    </Icon>
                                                </NuxtLink>

                                            </td>
                                            <td>
                                                <NuxtLink
                                                    :to="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`"
                                                    class="font-medium whitespace-nowrap">{{
                                                        contributor.name.length > 40 ? contributor.name.slice(0, 39) +
                                                    "..." : contributor.name
                                                    }}</NuxtLink>

                                            </td>
                                            <td class="text-center">{{ contributor.email }}
                                            </td>
                                            <td class="text-center">{{ contributor.reviewsMade }}</td>
                                            <td class="w-16">
                                                <div v-if="contributor.failedAttempts >= 3" class="mx-auto">
                                                    <div
                                                        class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                        <p>Locked</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="table-report__action w-96">
                                                <div class="flex justify-center items-center">
                                                    <a class="flex items-center mr-6 text-primary"
                                                        :href="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`">
                                                        <Icon name="material-symbols:assignment-add-outline"
                                                            class="w-4 h-4 mr-1"></Icon> Assign
                                                    </a>
                                                    <a class="flex items-center mr-6" href="javascript:;"
                                                        @click="ResetPasswordModal(contributor.id)">
                                                        <Icon name="material-symbols:key-rounded" class="w-4 h-4 mr-1">
                                                        </Icon> Reset Password
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
                                                        v-on:click="paginateSearchContr(searchPageContr - 1)"
                                                        :disabled="searchPageContr === 1">
                                                        <div
                                                            class="flex flex-row align-middle justify-center items-center  ">
                                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                                            </Icon>
                                                            <span class="">Previous</span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li class="page-item">
                                                    <button class="page-link"
                                                        v-on:click="paginateSearchContr(searchPageContr + 1)"
                                                        :disabled="(searchPageContr) * 6 >= searchCountContr!">
                                                        <div class="flex flex-row align-middle justify-center items-center">
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
                            <div v-if="contributors?.length == 0" class="w-full text-center text-lg mt-10 h-full">
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

                                        <tr v-for="contributor in contributors" :key="contributor.id" class="intro-x">
                                            <td class="w-10">
                                                <NuxtLink
                                                    :to="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`">
                                                    <Icon name="akar-icons:people-group" class="w-6 h-6">
                                                    </Icon>
                                                </NuxtLink>

                                            </td>
                                            <td>
                                                <NuxtLink
                                                    :to="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`"
                                                    class="font-medium whitespace-nowrap">{{
                                                        contributor.name.length > 40 ? contributor.name.slice(0, 39) +
                                                    "..." : contributor.name
                                                    }}</NuxtLink>

                                            </td>
                                            <td class="text-center">{{ contributor.email }}
                                            </td>
                                            <td class="text-center">{{ contributor.reviewsMade }}</td>
                                            <td class="w-16">
                                                <div v-if="contributor.failedAttempts >= 3" class="mx-auto">
                                                    <div
                                                        class="bg-red-500 text-white px-2 py-1 rounded-xl text-center w-16">
                                                        <p>Locked</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="table-report__action w-96">
                                                <div class="flex justify-center items-center">
                                                    <a class="flex items-center mr-6 text-primary"
                                                        :href="`/admin/pools/${contributor.poolId}/assign-contributor?contrId=${contributor.id}`">
                                                        <Icon name="material-symbols:assignment-add-outline"
                                                            class="w-4 h-4 mr-1"></Icon> Assign
                                                    </a>
                                                    <a class="flex items-center mr-6" href="javascript:;"
                                                        @click="ResetPasswordModal(contributor.id)">
                                                        <Icon name="material-symbols:key-rounded" class="w-4 h-4 mr-1">
                                                        </Icon> Reset Password
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
                                                    <button class="page-link" v-on:click="paginateContr(pageContr - 1)"
                                                        :disabled="pageContr === 1">
                                                        <div
                                                            class="flex flex-row align-middle justify-center items-center  ">
                                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                                            </Icon>
                                                            <span class="">Previous</span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li class="page-item">
                                                    <button class="page-link" v-on:click="paginateContr(pageContr + 1)"
                                                        :disabled="(pageContr) * 6 >= countContr!">
                                                        <div class="flex flex-row align-middle justify-center items-center">
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
    <div v-if="showResetPasswordModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import AdminTopBar from '~~/components/TopBar.vue';
const { $client } = useNuxtApp()
const pageContr = ref(1);
const searchPageContr = ref(1);
const searchTextContr = ref('');
const isReloading = ref(false);
const { data: countContr, refresh: fetchCountContr } = await useAsyncData(() => $client.contributor.getAllContributorsCount.query({}), { watch: [pageContr, searchTextContr] });
const { data: contributors, refresh: fetchContributors } = await useAsyncData(() => $client.contributor.getAllContributors.query({ skip: (pageContr.value - 1) * 6 }), { watch: [pageContr, searchTextContr] });
const { data: searchCountContr, refresh: fetchSearchCountContr } = await useAsyncData(() => $client.contributor.getAllContributorsCount.query({ search: searchTextContr.value !== '' ? searchTextContr.value : undefined }), { watch: [searchPageContr, searchTextContr] });
const { data: searchContributors, refresh: fetchSearchContributors } = await useAsyncData(() => $client.contributor.getAllContributors.query({ search: searchTextContr.value !== '' ? searchTextContr.value : undefined, skip: (searchPageContr.value - 1) * 6 }), { watch: [searchPageContr, searchTextContr] });

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
    if (searchTextContr.value === "") {
        searchPageContr.value = 1;
        pageContr.value = 1;
    }
}
const isLoadingResetPassword = ref(false);
const newPassword = ref('');
const showResetPasswordModal = ref(false);
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

</script>