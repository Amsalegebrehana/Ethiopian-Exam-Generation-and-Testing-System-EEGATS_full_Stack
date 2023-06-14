

<template>
    <div>
    <AdminTopBar role="admin" />
    <div class="flex">

        <AdminSideBar pageName="examgroups" />
        <div class="w-full mx-6 mt-24">


            <h2 class="intro-y text-lg font-medium mt-10">List of Exam Groups</h2>
    
            <div class="grid grid-cols-12 gap-6 mt-5">
                <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                    <button  v-on:click="toggleAddModal()" class="btn btn-primary shadow-md mr-auto" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">Create Exam Group
                        <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                    </button>
                
                    
                    <div class=" ml-auto mt-3 sm:mt-0 ">
                        <div class="w-56 relative text-slate-500">
                            <input type="text" class="form-control w-56 box pr-10" placeholder="Search..."  v-model="searchText"/>
                            <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" ></Icon>
                        
                        </div>
                    </div>
                </div>
          
                <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                      <div v-if="examGroup?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No exam groups found</p>
                                </div>
                            <div v-if="examGroup?.length !== 0">
                        
                    <table class="table table-report -mt-2">
                        <thead>
                            <tr>
                                <th class="whitespace-nowrap"></th>
                                <th class="whitespace-nowrap">EXAM GROUP NAME</th>
                                <th class="text-center whitespace-nowrap">Number of Exams</th>
                                <th class="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                       

                          
                            <tbody>
                                    <tr v-for="exgrp in examGroup" :key="exgrp.id" class="intro-x">
                                        <td class="w-10" >
                                            <NuxtLink :to="`/admin/examgroups/${exgrp.id}`">
                                                <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>
                                            </NuxtLink>
                                        </td>
                                        <td  > 
                                            <NuxtLink :to="`/admin/examgroups/${exgrp.id}`" class="font-medium whitespace-nowrap">
                                            {{
                                                 
                                                exgrp.name.length > 40 ? exgrp.name.slice(0,39) + "..." : exgrp.name
                                            }}
                                            </NuxtLink>
                                       
                                        </td>
                                        <td class="text-center">{{ exgrp._count['Exam'] }}</td>
                                 
                                        <td class="table-report__action w-96">
                                            <div class="flex justify-center items-center">
                                                <a class="flex items-center mr-6 text-primary" :href="`/admin/examGroups/${exgrp.id}`">
                                                                    <Icon name="tabler:device-analytics"
                                                                        class="w-4 h-4 mr-1"></Icon> View Details
                                                                </a>
                                                <button class="text-success flex items-center mr-6"  @click="EditModal(exgrp.id, exgrp.name)">
                                                    <Icon name="material-symbols:edit-outline" class="w-4 h-4 mr-1"> </Icon> Edit
                                                </button>
                                               
                                                <button  class="flex items-center " :class="exgrp._count['Exam'] !== 0? ' text-white': 'text-danger'" :disabled="exgrp._count['Exam'] !== 0"  @click="DeleteModal(exgrp.id, exgrp.name)">
                                                    <Icon name="fa6-regular:trash-can" class="w-4 h-4"></Icon> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex flex-row mt-3">
                <div class="md:block  text-slate-500">
                   
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
                                        
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Exam Group Name</p>
                                     
                                            <Form class="w-full">
                                                <ErrorMessage name="addExamGroupInfoName" class=" text-red-500" />
            <Field name="addExamGroupInfoName" type="text" class="intro-x login__input form-control py-3 block"  
                                                    placeholder="Enter Exam Group Name" v-model="examGroupInfo.name" :rules="fieldSchema" />
          </Form>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleAddExamGroup()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading || examGroupInfo.name.length < 2">
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
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Exam Group Name</p>
                                          <Form class="w-full">
                                                    <ErrorMessage name="editExamGroupInfoName" class=" text-red-500" />
                <Field name="editExamGroupInfoName" type="text" class="intro-x login__input form-control py-3 block"  
                                                        placeholder="Enter Pool Name" v-model="examGroupInfo.name" :rules="fieldSchema" />
              </Form>
                                      
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                                    <button @click="handleEditExamGroup()"
                                        class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center" :disabled="isLoading || examGroupInfo.name.length < 2">
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
                                            <p class=" font-bold text-lg text-center">Are you sure you want to delete exam group "{{ examGroupInfo.name }}"</p>
                                        </div>
                                    </div>
                                    <!--footer-->
                                    <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b space-x-6">
                                        <button @click="toggleDeleteModal()"
                                               class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                               :class="{'hidden': isLoading}" :disabled="isLoading">
                                              Cancel
                                           </button>

                                        <button @click="handleDeleteExamGroup()"
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
                            <Modal type="success" :show="examGroupCreated"  message="Exam Group successfully created!"/>
                           
            
                    </div>

            </div>
        </div>

</template>
<script setup lang="ts">

import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import Modal from '~~/components/Modal.vue';
import * as zod from 'zod';

definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()
const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').min(2, 'Minimum of 2 characters required'));
const page = ref(1);
const searchText  = ref('');
const {data: count, refresh:fetchCount} = await useAsyncData( ()=> $client.examGroup.getExamGroupCount.query());
const {data: examGroup, refresh:fetchExamGroups, pending} = await useAsyncData(()=> $client.examGroup.getExamGroups.query({search: searchText.value !== '' ? searchText.value : undefined, skip : (page.value - 1) * 6}), {watch: [page, searchText]});
const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchExamGroups();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}

//  exam group created modal
const examGroupCreated = ref(false);
const returnedErrorMessage = ref('');

const isReloading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const isLoading = ref(false);
const examGroupInfo = ref({
    name: '',
    id: ''
});
const toggleAddModal = () => {
    examGroupInfo.value.id = '';
    examGroupInfo.value.name = '';
    showAddModal.value = !showAddModal.value;
}
const handleAddExamGroup = async () => {

    isLoading.value = true;
    try{

        await $client.examGroup.addExamGroup.mutate({name : examGroupInfo.value.name});
        isReloading.value = true;
        isLoading.value =false;
        showAddModal.value = false;
        examGroupInfo.value.name = '';
        await fetchExamGroups();
        await fetchCount();
        isReloading.value = false;
        examGroupCreated.value = true;
    }
    catch(err:any){
        returnedErrorMessage.value = err.message;
    }
    finally{
        isLoading.value = false;
        // wait for 3 seconds and then set examGroupCreated to false
        setTimeout(() => {
            examGroupCreated.value = false;
        }, 2000);
        
    }
}
const toggleEditModal = () => {
    examGroupInfo.value.id = '';
    examGroupInfo.value.name = '';
    showEditModal.value = !showEditModal.value;
}

const EditModal = async (examGroupId : string, examGroupName : string) => {

    examGroupInfo.value.id = examGroupId;
    examGroupInfo.value.name = examGroupName;
    showEditModal.value = !showEditModal.value;
   
}
const handleEditExamGroup = async () => {
    isLoading.value = true;
    await $client.examGroup.updateExamGroup.mutate(examGroupInfo.value);
    isReloading.value = true;
    isLoading.value = false;
    showEditModal.value = false;
    examGroupInfo.value.id = '';
    examGroupInfo.value.name = '';
    await fetchExamGroups();
    await fetchCount();
    isReloading.value = false;
}
const toggleDeleteModal = () => {
    examGroupInfo.value.id = '';
    examGroupInfo.value.name = '';
    showDeleteModal.value = !showDeleteModal.value;
}

const DeleteModal = async (examGroupId: string, examGroupName: string) => {

    examGroupInfo.value.id = examGroupId;
    examGroupInfo.value.name = examGroupName;
    showDeleteModal.value = !showDeleteModal.value;

}
const handleDeleteExamGroup = async () => {

    isLoading.value = true;
    await $client.examGroup.deleteExamGroup.mutate({id :examGroupInfo.value.id});
    isReloading.value = true;
    isLoading.value = false;
    showDeleteModal.value = false;
    examGroupInfo.value.id = '';
    examGroupInfo.value.name = '';
    await fetchExamGroups();
    await fetchCount();
    isReloading.value = false;
}

</script>