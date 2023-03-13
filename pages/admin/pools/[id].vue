<script setup lang="ts" >
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';
definePageMeta({ middleware: 'is-admin' })
const route = useRoute();
const poolId = route.params.id as string;
const { $client } = useNuxtApp()
const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').email('Must be a valid email'));
const page = ref(1);
const searchText = ref('');
const contributorEmail = ref('');
// const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.pool.getPoolsCount.query());
// const { data: pools, refresh: fetchPools, pending } = await useAsyncData(() => $client.pool.getPools.query({ search: searchText.value !== '' ? searchText.value : undefined, skip: (page.value - 1) * 6 }), { watch: [page, searchText] });

// const paginate = async (newPage: number) => {
//     page.value = newPage;
//     isReloading.value = true;
//     try {
//         await fetchPools();
//         await fetchCount();
//     } finally {
//         isReloading.value = false
//     }
// }
const isReloading = ref(false);
const isLoading = ref(false);
const isInviteSuccess = ref(false);
const showInv = ref(true);
const showInviteModal = ref(false);
const toggleInviteModal = () => {
    contributorEmail.value = '';
    showInv.value = true;
    showInviteModal.value = !showInviteModal.value;
}
const handleInviteContributor = async () => {
    isLoading.value = true;
    const res = await $client.contributor.inviteContributor.mutate({ email: contributorEmail.value, poolId: poolId! });
    isLoading.value = false;
    showInv.value = false;
    if (res === true) {
        isInviteSuccess.value = true;
        contributorEmail.value = '';
    }
}
</script>
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">

                <h1>PoolId: {{ poolId }}</h1>
                <h2>Pool detail page</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                        <button v-on:click="toggleInviteModal()" class="btn btn-primary shadow-md mr-auto"
                            data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">Invite
                            Contributor
                            <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>

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
                    <div v-if="!isInviteSuccess && !showInv">
                        <div class="flex flex-row items-center space-x-4 mx-auto">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-lg text-center">Failed to send invite, please try again</p>
                        </div>
                    </div>
                    <!--body-->
                    <div class="relative p-6 flex-auto">
                        <div v-if="showInv">

                            <div class="flex flex-row align-middle mt-2">

                                <p class="w-8/12 align-middle my-auto font-bold text-lg">Contributor's Email</p>

                                <Form class="w-full">
                                    <ErrorMessage name="addpoolInfoName" class=" text-red-500" />
                                    <Field name="addpoolInfoName" type="text"
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
        <div v-if="showInviteModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</div></template>

