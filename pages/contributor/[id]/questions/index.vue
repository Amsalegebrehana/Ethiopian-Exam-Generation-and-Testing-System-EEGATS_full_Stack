<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })
const { $client } = useNuxtApp()

const route = useRoute ();
const contrId = route.params.id as string;
const {data: isAssigned } = await useAsyncData( ()=> $client.contributor.checkifAssigned.query({contrId }));

const questions =  [
                { "id": "1", "name": "At which of the following times is The graph shows the rates of res ", "status": "ACTIVE" }, 
                { "id": "2", "name": "which of the correctly identifies which of the correctly identifies", "status": "INACTIVE" }, 
                { "id": "3", "name": "Lysosomes are involved in the which of the correctly identifies", "status": "ACTIVE" }] ;



</script>
<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div class="flex">

            <ContributorSideBar pageName="questions" :contrId="contrId"/>
            <div class="w-full mx-6">
    
                <h2 class="intro-y text-lg font-medium mt-10">List of Questions</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                        <NuxtLink :to="`/contributor/${contrId}/create-question`">
                        <button  class="btn btn-primary shadow-md mr-2"  :disabled="!isAssigned">Add question
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                        </NuxtLink>
                        <div class="hidden md:block mx-auto text-slate-500">
                            Showing 1 to 10 of {{ questions?.length }} entries
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." />
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                                </Icon>

                            </div>
                        </div>
                    </div>
                    <!-- BEGIN: Data List -->
                    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap">Question</th>
                                    <th class="text-center whitespace-nowrap">Status</th>
                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                            </thead>
                            <div v-if="questions!== null">
                                <tbody>
                                    <tr v-for="question in questions" :key="question.id" class="intro-x">
                                        <td class="w-10">
                                            <NuxtLink :to="`/contributor/questions/${question.id}`">
                                                <Icon name="uiw:question-circle-o" class="w-6 h-6"></Icon>
                                            </NuxtLink>
                                        </td>
                                        <td>
                                            <NuxtLink :to="`/contributor/${contrId}/questions/${question.id}`"
                                                class="font-medium whitespace-nowrap">
                                                {{
        question.name.length > 40 ? question.name.slice(0, 39) + "..." : question.name
                                                }}
    
                                            </NuxtLink>
                                        </td>
                                        <td class="w-24">
                                            <div class="flex items-center justify-center" :class="{
                                                'text-success': question.status === 'ACTIVE',
                                                'text-danger': question.status === 'INACTIVE',
                                            }">
                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                {{ question.status === 'ACTIVE' ? "Active" : "Inactive" }}
                                            </div>
                                        </td>
    
                                        <td class="table-report__action w-56">
                                            <div class="flex justify-center items-center">
                                                <a class="flex items-center mr-3" href="javascript:;">
                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon> Edit
                                                </a>
                                                <a class="flex items-center text-danger" href="javascript:;"
                                                  >
                                                    <Icon name="fa6-regular:trash-can" class="w-4 h-4"></Icon> Delete
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </div>
                            <div v-else>
                                No questions found
                            </div>
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

           
            </div>
        </div>
    </div>
</template>


