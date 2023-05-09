<script setup lang="ts" >
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';
definePageMeta({ middleware: 'is-admin' })
const route = useRoute();
const activeTab = ref(1);
const poolId = route.params.id as string;
const { $client } = useNuxtApp()
const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').email('Must be a valid email'));
const numberfieldSchema = toFieldValidator(zod.number().min(0));
const catID = "";
const page = ref(1);
const catPage = ref(1);
const searchText = ref('');
const searchTextCat = ref('');
const contributorEmail = ref('');
const { data:poolInfo} = await useAsyncData(() => $client.pool.getPool.query({ id: poolId!}));
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.pool.getPoolContributorsCount.query({poolId: poolId!}));
const {data: catCount, refresh: fetchCatCount} = await useAsyncData(()=> $client.category.getCategoryCount.query({poolId: poolId}));
const { data: contributors, refresh: fetchContributors, pending } = await useAsyncData(() => $client.pool.getPoolContributors.query({poolId:poolId, search: searchText.value !== '' ? searchText.value : undefined, skip: (page.value - 1) * 6 }), { watch: [page, searchText] });
const { data: categories, refresh: fetchCategories } = await useAsyncData(() => $client.category.getAllCategories.query({poolId:poolId, search: searchTextCat.value !== '' ? searchTextCat.value : undefined, skip: (catPage.value - 1) * 6 }), { watch: [catPage, searchTextCat] });


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

const paginateCat = async (newPage: number) => {
    catPage.value = newPage;
    isReloadingCat.value = true;
    try {
        await fetchCategories();
        await fetchCatCount();
    } finally {
        isReloadingCat.value = false
    }
}

const isReloading = ref(false);
const isLoading = ref(false);
const isReloadingCat = ref(false);
const isLoadingCat = ref(false);
const isInviteSuccess = ref(false);
const isInviteDup = ref(false);
const showInv = ref(true);
const showInviteModal = ref(false);
const showAssignModal = ref(false);
const showDeleteContModal = ref(false);
const showDeleteCatModal = ref(false);
const showEditModal = ref(false);
const showAddModal = ref(false);
let questionsAssigned = 0;
const contrInfo = ref({
    questionNumber: 0,
    id: '',
    name : ''
});

const catInfo = ref({
    id:"",
    name:"",
    numberofQuestions:0
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
    if(res == 'Already a member of this pool'){
        isInviteDup.value = true;
        contributorEmail.value = '';
    }
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


//TODO: Fix this
const handleAssignQuestions = async () => {
    isLoading.value = true;
    await $client.contributor.assignQuestion.mutate({id :contrInfo.value.id, catId: catID,questionsRemaining : contrInfo.value.questionNumber});
    isReloading.value = true;
    isLoading.value = false;
    showAssignModal.value = false;
    contrInfo.value.id = '';
    contrInfo.value.questionNumber = 0;
    await fetchContributors();
    await fetchCount();
    isReloading.value = false;
}

const toggleAddModal = () => {
    catInfo.value.id = '';
    catInfo.value.name = '';
    showAddModal.value = !showAddModal.value;
}
const handleAddCategory = async () => {
    isLoading.value = true;
    await $client.category.addCategory.mutate({name: catInfo.value.name, numOfQuestions: catInfo.value.numberofQuestions,poolId: poolId});
    isReloadingCat.value = true;
    isLoadingCat.value =false;
    showAddModal.value = false;
    catInfo.value.name = '';
    await fetchCategories();
    await fetchCatCount();
    isReloading.value = false;
}

const toggleEditModal = () => {
    catInfo.value.id = '';
    catInfo.value.name = '';
    showEditModal.value = !showEditModal.value;
}

const EditModal = async (catId : string, catName : string) => {

    catInfo.value.id = catId;
    catInfo.value.name = catName;
    showEditModal.value = !showEditModal.value;
   
}
const handleEditPool = async () => {
    isLoading.value = true;
    await $client.category.updateCategory.mutate(catInfo.value);
    isReloadingCat.value = true;
    isLoadingCat.value = false;
    showEditModal.value = false;
    catInfo.value.id = '';
    catInfo.value.name = '';
    await fetchCategories();
    await fetchCatCount();
    isReloading.value = false;
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

const DeleteContModal = async (contrId: string, contrName: string) => {

    contrInfo.value.id = contrId;
    contrInfo.value.name = contrName;
    showDeleteContModal.value = !showDeleteContModal.value;

}

const DeleteCatModal = async (catId: string, catName: string) => {

    catInfo.value.id = catId;
    catInfo.value.name = catName;
    showDeleteCatModal.value = !showDeleteCatModal.value;

}

const handleDeleteCategory= async () => {
    isLoading.value = true;
    await $client.category.deleteCategory.mutate({id :catInfo.value.id});
    isReloadingCat.value = true;
    isLoadingCat.value = false;
    showDeleteCatModal.value = false;
    catInfo.value.id = '';
    catInfo.value.name = '';
    await fetchCategories();
    await fetchCatCount();
    isReloading.value = false;
}

const handleDisableContributor = async () => {
    isLoading.value = true;
    await $client.contributor.disableContributor.mutate({id :contrInfo.value.id});
    isReloading.value = true;
    isLoading.value = false;
    showDeleteContModal.value = false;
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
        <h2 class="intro-y text-lg font-medium ">{{poolInfo?.name}}</h2>
      </div>

      <div class="mx-5 mt-5"> 
        
        <ul class="nav nav-link-tabs" role="tablist">
                    <li id="example-5-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2 "  @click="activeTab = 1" :class="{ 'active': activeTab === 1 }"  data-tw-toggle="pill" data-tw-target="#example-tab-5" type="button" role="tab" aria-controls="example-tab-5" aria-selected="true">
                            Categories
                        </button>
                    </li>
                    <li id="example-6-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2"  @click="activeTab = 2" :class="{ 'active': activeTab === 2 }" data-tw-toggle="pill" data-tw-target="#example-tab-6" type="button" role="tab" aria-controls="example-tab-6" aria-selected="true">
                            Contributors
                        </button>
                    </li>
            </ul>

            <div class="tab-content mt-5">

                <div id="example-tab-5" class="tab-pane leading-relaxed " role="tabpanel" aria-labelledby="example-5-tab" :class="{ 'active': activeTab === 1 }">
                            <div class="w-full mx-6">
            
                                <div class="grid grid-cols-12 gap-6 mt-5 ">
                                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                                       
<!--                           
                                        <div class="hidden md:block mx-auto text-slate-500">
                                            Showing 1 to 10 of {{ categories?.length }} entries
                                        </div> -->

                                        <button v-on:click="toggleAddModal()" class="btn btn-primary shadow-md mr-auto"
                                            data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">
                                                Add Category
                                            <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                                        </button>

                                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                            <div class="w-56 relative text-slate-500">
                                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." v-model="searchTextCat"/>
                                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
                            
                                            </div>
                                        </div>
                                         
                                    </div>
                                  
                                    <div v-if="isReloading" class="flex justify-center items-center">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6 "></Icon>
                                        </div>
                                        <div v-if="categories?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                                <p>No categories found</p>
                                            </div>
                                        

                                    <div v-else class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                        <div v-if="categories?.length !== 0">
                                        <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Name</th>
                                                    <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="cateogry in categories" :key="cateogry.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/exams/${cateogry.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/exams/${cateogry.id}`" class="font-medium whitespace-nowrap">{{
                                                        cateogry.name.length > 40 ? cateogry.name.slice(0,39) + "..." : cateogry.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ cateogry.numOfQuestions}}</td>
                             
                                                    <td class="table-report__action w-56">
                                                        <div class="flex justify-center items-center">
                                                            <a class="flex items-center mr-6" href="javascript:;" @click="EditModal(cateogry.id, cateogry.name)">
                                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4 mr-1"></Icon> Edit
                                                            </a>
                                                            <a class="flex items-center text-danger" href="javascript:;" @click="DeleteCatModal(cateogry.id, cateogry.name)">
                                                                <Icon name="fa6-regular:trash-can" class="w-4 h-4 mr-1"></Icon> Delete
                                                            </a>
                                                        </div>
                                                    </td>
                                                
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                <div class="flex flex-row mt-3">
                        <div class="md:block  text-slate-500">
                         Showing {{1 + (catPage-1)*6}} to {{ catPage*6 <catCount! ? catPage*6:catCount }} of {{catCount! }} entries
                        </div>
                                    <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                        <nav class="w-full sm:w-auto sm:mr-auto">
                                            <ul class="pagination">
                                                
                                                <li class="page-item">
                                                    <button class="page-link" v-on:click="paginateCat(catPage-1)" :disabled="catPage===1">
                                                        <div class="flex flex-row align-middle justify-center items-center  ">
                                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                            <span class="">Previous</span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li class="page-item">  
                                                    <button class="page-link" v-on:click="paginateCat(catPage+1)" :disabled="(catPage) * 6 >= catCount!">
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

            

        <div id="example-tab-5" class="tab-pane leading-relaxed " role="tabpanel" aria-labelledby="example-5-tab" :class="{ 'active': activeTab === 2 }">
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
                                        <td class="text-center">{{  contributor.reviewsMade}}</td>
                                 
                                        <td class="table-report__action w-56">
                                            <div class="flex justify-center items-center">
                                                <a class="flex items-center mr-6" href="javascript:;" @click="AssignModal(contributor.id, contributor.reviewsMade)">
                                                    <Icon name="material-symbols:assignment-add-outline" class="w-4 h-4 mr-1"></Icon> Assign
                                                </a>
                                                <a class="flex items-center text-danger" href="javascript:;" @click="DeleteContModal(contributor.id, contributor.name)">
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
                    <div v-if="isInviteDup && !showInv">
                    <div class="flex flex-row items-center space-x-4 mx-auto">
                        <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                        <p class=" font-bold text-lg text-center">Already a member of this pool!</p>
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
                                    <div class="flex flex-row align-middle">
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Category</p>
                                        <Form class="w-full">   
                                            <div v-if="categories">
                                                <DropDownSelect :optionslist="categories" v-model="catID" title="Choose Cateogry" class=""/>
                                            </div>
                                        </Form>
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
                                        
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Category Name</p>
                                     
                                            <Form class="w-full">
                                                <ErrorMessage name="addcatInfoName" class=" text-red-500" />
            <Field name="addcatInfoName" type="text" class="intro-x login__input form-control py-3 block"  
                                                    placeholder="Enter Category Name" v-model="catInfo.name" :rules="fieldSchema" />
          </Form>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleAddCategory()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading || catInfo.name.length < 2">
                                        <div v-if="isLoading|| pending">
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
                        <Field name="editpoolInfoName" type="text" class="intro-x login__input form-control py-3 block"  
                                    placeholder="Enter Pool Name" v-model="catInfo.name" :rules="fieldSchema" />
                            </Form>
                </div>
            </div>
            <!--footer-->
            <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                <button @click="handleEditPool()"
                    class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading || catInfo.name.length < 2">
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
                                <p class=" font-bold text-lg text-center">Are you sure you want to delete {{ catInfo.name }}'s category?'</p>
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                            <button @click="toggleDeleteCatModal()"
                                    class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                    :class="{'hidden': isLoading}" :disabled="isLoading">
                                    Cancel
                                </button>

                            <button @click="handleDeleteCategory()"
                                class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading">
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
                                            <p class=" font-bold text-lg text-center">Are you sure you want to disable {{ contrInfo.name }}'s contributor account?'</p>
                                        </div>
                                    </div>
                                    <!--footer-->
                                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                                        <button @click="toggleDeleteContModal()"
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
                        <div v-if="showDeleteContModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
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

