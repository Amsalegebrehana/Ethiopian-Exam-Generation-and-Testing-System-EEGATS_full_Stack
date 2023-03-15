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
const numberfieldSchema = toFieldValidator(zod.number().min(0));
const page = ref(1);
const searchText = ref('');
const contributorEmail = ref('');
const { data:poolInfo} = await useAsyncData(() => $client.pool.getPool.query({ id: poolId!}));
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.pool.getPoolContributorsCount.query({poolId: poolId!}));
const { data: contributors, refresh: fetchContributors, pending } = await useAsyncData(() => $client.pool.getPoolContributors.query({poolId:poolId, search: searchText.value !== '' ? searchText.value : undefined, skip: (page.value - 1) * 6 }), { watch: [page, searchText] });

const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchContributors();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}
const isReloading = ref(false);
const isLoading = ref(false);
const isInviteSuccess = ref(false);
const showInv = ref(true);
const showInviteModal = ref(false);
const showAssignModal = ref(false);
const showDeleteModal = ref(false);
const contrInfo = ref({
    questionNumber: 0,
    id: '',
    name : ''
});
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

const toggleAssignModal = () => {
    contrInfo.value.id = '';
    contrInfo.value.questionNumber = 0;
    showAssignModal.value = !showAssignModal.value;
}

const AssignModal = async (contrId : string, noOfQuestions : number) => {

    contrInfo.value.id = contrId;
    contrInfo.value.questionNumber = noOfQuestions;
    showAssignModal.value = !showAssignModal.value;
   
}
const handleAssignQuestions = async () => {
    isLoading.value = true;
    await $client.contributor.assignQuestion.mutate({id :contrInfo.value.id, numberofQuestions : contrInfo.value.questionNumber});
    isReloading.value = true;
    isLoading.value = false;
    showAssignModal.value = false;
    contrInfo.value.id = '';
    contrInfo.value.questionNumber = 0;
    await fetchContributors();
    await fetchCount();
    isReloading.value = false;
}
const toggleDeleteModal = () => {
    contrInfo.value.id = '';
    contrInfo.value.name = '';
    showDeleteModal.value = !showDeleteModal.value;
}

const DeleteModal = async (contrId: string, contrName: string) => {

    contrInfo.value.id = contrId;
    contrInfo.value.name = contrName;
    showDeleteModal.value = !showDeleteModal.value;

}
const handleDisableContributor = async () => {
    isLoading.value = true;
    await $client.contributor.disableContributor.mutate({id :contrInfo.value.id});
    isReloading.value = true;
    isLoading.value = false;
    showDeleteModal.value = false;
    contrInfo.value.id = '';
    contrInfo.value.name = '';
    await fetchContributors();
    await fetchCount();
    isReloading.value = false;
}
</script>
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">
                <div class="flex flex-row  align-middle mt-10"> 
        <NuxtLink :to="`/admin/pools`">
        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
        </NuxtLink>
        <h2 class="intro-y text-lg font-medium ">{{poolInfo?.name}} : Contributors</h2>
      </div>

                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                        <button v-on:click="toggleInviteModal()" class="btn btn-primary shadow-md mr-auto"
                            data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">Invite
                            Contributor
                            <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                        <div class=" ml-auto mt-3 sm:mt-0 ">
                        <div class="w-56 relative text-slate-500">
                            <input type="text" class="form-control w-56 box pr-10" placeholder="Search..."  v-model="searchText"/>
                            <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" ></Icon>
                        
                        </div>
                    </div>
                    </div>
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
                                <th class="text-center whitespace-nowrap">Questions Assigned</th>
                                <th class="text-center whitespace-nowrap">Reviews Assigned</th>
                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                       

                          
                            <tbody>
                                    <tr v-for="contributor in contributors" :key="contributor.id" class="intro-x">
                                        <td class="w-10">
                                             
                                            <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>
                                         
                                        </td>
                                        <td>
                                            <span class="font-medium whitespace-nowrap">{{
                                                contributor.name
                                            }}</span>
                                       
                                        </td>
                                        <td class="text-center">{{ contributor.email }}</td>
                                        <td class="text-center">{{ contributor.questionsRemaining }}</td>
                                        <td class="text-center">{{ contributor.reviewsRemaining }}</td>
                                 
                                        <td class="table-report__action w-56">
                                            <div class="flex justify-center items-center">
                                                <a class="flex items-center mr-6" href="javascript:;" @click="AssignModal(contributor.id, contributor.questionsRemaining)">
                                                    <Icon name="material-symbols:assignment-add-outline" class="w-4 h-4 mr-1"></Icon> Assign
                                                </a>
                                                <a class="flex items-center text-danger" href="javascript:;" @click="DeleteModal(contributor.id, contributor.name)">
                                                    <Icon name="fluent-mdl2:cancel" class="w-4 h-4 mr-1"></Icon> Remove
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex flex-row mt-3">
                <div class="md:block  text-slate-500">
                   
                         Showing {{1 + (page-1)*6}} to {{ page*6 <count! ? page*6:count }} of {{count! }} entries
                                    </div>
                                    <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                        <nav class="w-full sm:w-auto sm:mr-auto">
                                            <ul class="pagination">
                                                
                                                <li class="page-item">
                                                    <button class="page-link" v-on:click="paginate(page-1)" :disabled="page===1">
                                                        <div class="flex flex-row align-middle justify-center items-center  ">
                                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                            <span class="">Previous</span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li class="page-item">  
                                                    <button class="page-link" v-on:click="paginate(page+1)" :disabled="(page) * 6 >= count!">
                                                        <div class="flex flex-row align-middle justify-center items-center">
                                                                <span>Next</span>
                                                                <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle"></Icon>
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
</div>
<div v-if="showAssignModal"
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
                                        type="button" v-on:click="toggleAssignModal()">
                                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                    <div class="flex flex-row align-middle">
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Number of Questions</p>
                                          <Form class="w-full">
                                                    
                <input name="editpoolInfoName" type="number" class="intro-x login__input form-control py-3 block"  
                                                        placeholder="Enter Pool Name" v-model="contrInfo.questionNumber"  min="0"/>
              </Form>
                                        <!-- <input type="text" class="intro-x login__input form-control py-3 px-4 block"
                                            placeholder="Enter Pool Name" v-model="poolInfo.name"> -->
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleAssignQuestions()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading ">
                                        <div v-if="isLoading || pending">
                                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                            </div>
                                            <div v-else>
                                                Assign
                                            </div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="showAssignModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
              

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
                                            <p class=" font-bold text-lg text-center">Are you sure you want to disable {{ contrInfo.name }}'s contributor account?'</p>
                                        </div>
                                    </div>
                                    <!--footer-->
                                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                                        <button @click="toggleDeleteModal()"
                                               class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                               :class="{'hidden': isLoading}" :disabled="isLoading">
                                              Cancel
                                           </button>

                                        <button @click="handleDisableContributor()"
                                            class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading">
                                           <div v-if="isLoading || pending">
                                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                            </div>
                                            <div v-else>
                                                Disable
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
                                    <div
                                        class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
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
</template>

