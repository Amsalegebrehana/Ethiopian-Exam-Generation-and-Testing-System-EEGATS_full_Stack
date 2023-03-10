<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">
                
                
                <h2 class="intro-y text-lg font-medium mt-10">List of exams</h2>
                <h1>ExamGroupId: {{ $route.params.id }}</h1>
                    <div class="grid grid-cols-12 gap-6 mt-5">
                        <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                            <button class="btn btn-primary shadow-md mr-2">Create exam
                                <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                            </button>
        
                            <div class="hidden md:block mx-auto text-slate-500">
                                Showing 1 to 10 of {{ exams.length }} entries
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
                                        <th class="whitespace-nowrap">Exams</th>
                                        <th class="text-center whitespace-nowrap">Number of Questions</th>
                                        <th class="whitespace-nowrap">Status</th>
                                        <th class="whitespace-nowrap">Testing Date</th>
                                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr v-for="exam in exams" :key="exam.id" class="intro-x">
                                    <td class="w-10">
                                        <NuxtLink :to="`/admin/exams/${exam.id}`">
                                            <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                        </NuxtLink>
                                    </td>
                                    <td>
                                        <NuxtLink :to="`/admin/exams/${exam.id}`" class="font-medium whitespace-nowrap">{{
                                            exam.name.length > 40 ? exam.name.slice(0, 39) + "..." : exam.name
                                        }}</NuxtLink>
                                
                                    </td>
                                    <td class="text-center">{{ exam.numberOfQuestions }}</td>
                                    <td class="w-24">
                                        <div class="flex items-center justify-center" :class="{
                                            'text-success': exam.status === 'ACTIVE',
                                            'text-danger': exam.status === 'INACTIVE',
                                        }">
                                            <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                            {{ exam.status === 'ACTIVE' ? "Active" : "Inactive" }}
                                        </div>
                                    </td>
                                    <td class="">{{ exam.testingDate }}</td>
                                    <td class="table-report__action w-40">
                                        <div class="flex justify-center items-center">
                                            <a class="flex items-center mr-3" href="javascript:;">
                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon> Edit
                                            </a>
                                            <a class="flex items-center text-danger" href="javascript:;" @click="deleteConfirmationModal = true">
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
                    <!-- BEGIN: Delete Confirmation Modal -->
                    <!-- <Modal :show="deleteConfirmationModal" @hidden="deleteConfirmationModal = false">
                                    <ModalBody class="p-0">
                                        <div class="p-5 text-center">
                                            <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
                                            <div class="text-3xl mt-5">Are you sure?</div>
                                            <div class="text-slate-500 mt-2">
                                                Do you really want to delete these records? <br />This process cannot
                                                be undone.
                                            </div>
                                        </div>
                                        <div class="px-5 pb-8 text-center">
                                            <button type="button" @click="deleteConfirmationModal = false" class="btn btn-outline-secondary w-24 mr-1">
                                                Cancel
                                            </button>
                                            <button type="button" class="btn btn-danger w-24">Delete</button>
                                        </div>
                                    </ModalBody>
                                </Modal> -->
                </div>
            </div>
        </div>
</template>

<script>
definePageMeta({ middleware: 'is-admin' })
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
export default {
    components: { AdminSideBar, AdminTopBar },
    name: 'ExamGroupDeatil',
    data() {
        return {
            exams: [
                { "id": "1", "name": "Physics 1990 Ethiopian National Exam", "numberOfQuestions": 45, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" },
                { "id": "2", "name": "Chemistry 2000 Ethiopian National Exam", "numberOfQuestions": 80, "status": "INACTIVE", "testingDate": "01:00 PM Dec 12, 1990" },
                { "id": "3", "name": "Biology 2001 Ethiopian National Exam", "numberOfQuestions": 120, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" },
                { "id": "2", "name": "Chemistry 2010 Ethiopian National Exam", "numberOfQuestions": 80, "status": "ACTIVE", "testingDate": "10:00 AM Dec 12, 1990" }]
        }

    },
}
</script>