<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex"> 

            <AdminSideBar pageName="examgroups"/>
            <div class="w-full mx-6">
            
            
                <h2 class="intro-y text-lg font-medium mt-10">Exam Groups</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                        <button v-on:click="toggleModal()" class="btn btn-primary shadow-md mr-2">Create Exam Group
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
            
                        <div class="hidden md:block mx-auto text-slate-500">
                            Showing 1 to 10 of {{ examgroups.length }} entries
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
                                    <th class="whitespace-nowrap">Exam Group Name</th>
                                    <th class="text-center whitespace-nowrap">Number of Exams</th>
                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="exgrp in examgroups" :key="exgrp.id" class="intro-x">
                                    <td class="w-10">
                                        <NuxtLink :to="`/admin/examgroups/${exgrp.id}`">
                                        <Icon name="material-symbols:folder" class="w-6 h-6"></Icon>
                                    </NuxtLink>
                                    </td>
                                <td>
                                        <NuxtLink :to="`/admin/examgroups/${exgrp.id}`" class="font-medium whitespace-nowrap" >
                                       {{
                                            exgrp.name
                                        }}
            
        </NuxtLink>
                                    </td>
                                    <td class="text-center">{{ exgrp.numberOfExams }}</td>
                            
                                    <td class="table-report__action w-56">
                                        <div class="flex justify-center items-center">
                                            <a class="flex items-center mr-3" href="javascript:;">
                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon> Edit
                                            </a>
                                            <a class="flex items-center text-danger" href="javascript:;"
                                                @click="deleteConfirmationModal = true">
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
                </div>
              
                <div>
                
                    <div v-if="showModal"
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
                                        type="button" v-on:click="toggleModal()">
                                        <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                    <div class="flex flex-row align-middle">
                                        <p class="w-8/12 align-middle my-auto font-bold text-lg">Exam Group Name</p>
                                        <input type="text" class="intro-x login__input form-control py-3 px-4 block"
                                            placeholder="Enter Exam Group Name" v-model="examGroupInfo.name">
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">
                
                                    <button @click="addExamGroup" class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center">
                                        Add
                                    </button>
                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
definePageMeta({ middleware: 'is-admin' })
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
export default {
    components: {AdminSideBar, AdminTopBar},
    name: 'ExamGroups',
    data() {
        return{
            examgroups: [{ "id": "1", "name": "1990 Ethiopian National Exam", "numberOfExams": 9 }, { "id": "2", "name": "2000 Ethiopian National Exam", "numberOfExams": 9 }, { "id": "3", "name": "2001 Ethiopian National Exam", "numberOfExams": 9 }],
            showModal: false,
            examGroupInfo: {
                name: '',
            },
        }

    },
    methods: {
        toggleModal: function () {
            this.showModal = !this.showModal;
        },
        addExamGroup() {
            //TODO : form validation 
            console.log(this.examGroupInfo);
            this.showModal = false;
        }
    }
}
</script>