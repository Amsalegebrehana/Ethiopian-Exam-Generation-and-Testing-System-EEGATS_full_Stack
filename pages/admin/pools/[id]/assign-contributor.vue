<script setup lang="ts">
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import { Chart, registerables } from 'chart.js';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
const contrId = useRoute().query.contrId as string;
const poolId = useRoute().params.id as string;
const { $client } = useNuxtApp();
const { data: analytics, refresh: fetchAnalytics } = await useAsyncData(() => $client.analytics.getContributorAnalytics.query({ contrId }));
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const isLoading = ref(false);
const isReloading = ref(false);
const contrInfo = ref({
    questionNumber: 0,
    id: '',
    name: ''
});
const catID = ref("");
const page = ref(1);
const searchPage = ref(1);
const searchText = ref('');
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.contributor.getAssignmentCount.query({ contrId }), { watch: [page, searchText] });
const { data: catAssignments, refresh: fetchCatAssignments, pending } = await useAsyncData(() => $client.contributor.getCategoryAssignments.query({ skip: (page.value - 1) * 6, contrId }), { watch: [page, searchText] });
const { data: searchCount, refresh: fetchSearchCount } = await useAsyncData(() => $client.contributor.getAssignmentCount.query({ search: searchText.value !== '' ? searchText.value : undefined, contrId }), { watch: [searchPage, searchText] });
const { data: searchCatAssignments, refresh: fetchSearchCatAssignments, pending: pendingSearch } = await useAsyncData(() => $client.contributor.getCategoryAssignments.query({ search: searchText.value !== '' ? searchText.value : undefined, contrId, skip: (searchPage.value - 1) * 6 }), { watch: [searchPage, searchText] });

const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchCatAssignments();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchCatAssignments();
        await fetchSearchCount();
    } finally {
        isReloading.value = false
    }
}

const resetSearch = () => {
    if (searchText.value === "") {
        searchPage.value = 1;
        page.value = 1;
    }
}

const { data: categoriesNow, refresh: fetchCategoriesNow } = await useAsyncData(() => $client.contributor.getAllCategoryForAssignment.query({ contrId }));

const showAssignModal = ref(false);
const toggleAssignModal = () => {
    contrInfo.value.id = '';
    contrInfo.value.questionNumber = 0;
    showAssignModal.value = !showAssignModal.value;
}

const AssignModal = async () => {
    contrInfo.value.id = contrId;
    contrInfo.value.questionNumber = 0;
    if (categoriesNow) {
        showAssignModal.value = !showAssignModal.value;
    }

}
//TODO: Fix this
const handleAssignQuestions = async () => {
    isLoading.value = true;
    await $client.contributor.assignQuestion.mutate({ contrId, catId: catID.value, questionsRemaining: contrInfo.value.questionNumber, poolId: poolId });
    isReloading.value = true;
    isLoading.value = false;
    showAssignModal.value = false;
    contrInfo.value.id = '';
    contrInfo.value.questionNumber = 0;
    resetSearch();
    await fetchCatAssignments();
    await fetchCategoriesNow();
    await fetchCount();
    await fetchAnalytics();
    isReloading.value = false;
    catID.value = "";

}

watch(catID, (newId: string, oldId: string) => {
    if (categoriesNow.value) {
        categoriesNow.value.filter(category => {
            console.log("inside", category.id);
            if (category.id === catID.value) {
                contrInfo.value.questionNumber = category.contributorAssignments[0] ? category.contributorAssignments[0].questionsRemaining : 0
            }
        })
    }


})
</script>
<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="pools" />
            <div class="w-full mx-6 mt-24">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/admin/pools/${poolId}`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-bold mb-4">Assign Contributor</h2>
                </div>
                  <div class="flex flex-row space-x-4">
                    <div class="w-8/12 mr-10 ">



                        <div class="my-5 w-full">
                            <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                                <button v-on:click="AssignModal()" class="btn btn-primary shadow-md mr-auto"
                                    data-modal-target="authentication-modal" data-modal-toggle="authentication-modal">
                                    Assign
                                    <Icon name="fluent:people-add-20-filled" class="w-6 h-6 ml-2 text-white"></Icon>
                                </button>


                                <div class=" ml-auto mt-3 sm:mt-0 ">
                                    <div class="w-56 relative text-slate-500">
                                        <input type="text" class="form-control w-56 box pr-10" placeholder="Search..."
                                            v-model="searchText" @change="resetSearch" />
                                        <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                                        </Icon>

                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-10">

                                <div v-if="searchText != ''">

                                    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible w-full">
                                        <div v-if="searchCatAssignments?.length == 0"
                                            class="w-full text-center text-lg mt-10 h-full">
                                            <p>No Categories found</p>
                                        </div>
                                        <div v-if="searchCatAssignments?.length !== 0">

                                            <table class="table table-report -mt-2">
                                                <thead>
                                                    <tr>
                                                        <th class="whitespace-nowrap"></th>
                                                        <th class="whitespace-nowrap">CATEGORY</th>
                                                        <th class="text-center whitespace-nowrap">Questions Assigned</th>
                                                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                    </tr>
                                                </thead>



                                                <tbody>
                                                    <tr v-for="cat in searchCatAssignments" :key="cat.id" class="intro-x">
                                                        <td class="w-10">

                                                            <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>

                                                        </td>
                                                        <td>
                                                            <div class="font-medium whitespace-nowrap">{{
                                                                cat.name.length > 40 ? cat.name.substring(0, 40) + '...' :
                                                                cat.name
                                                            }}</div>

                                                        </td>
                                                        <td class="text-center">{{ cat.contributorAssignments.length > 0 ?
                                                            cat.contributorAssignments[0].questionsRemaining : 0 }}</td>

                                                        <td class="table-report__action w-56">
                                                            <div class="flex justify-center items-center">
                                                                <button class="text-success flex items-center mr-3" @click="() => {
                                                                    catID = cat.id;
                                                                    AssignModal()

                                                                }">
                                                                    <Icon name="material-symbols:edit-outline"
                                                                        class="w-4 h-4"></Icon> Edit
                                                                </button>

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
                                                                    v-on:click="paginateSearch(searchPage - 1)"
                                                                    :disabled="searchPage === 1">
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
                                                                    v-on:click="paginateSearch(searchPage + 1)"
                                                                    :disabled="(searchPage) * 6 >= searchCount!">
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
                                        <div v-if="catAssignments?.length == 0"
                                            class="w-full text-center text-lg mt-10 h-full">
                                            <p>No Categories found</p>
                                        </div>
                                        <div v-if="catAssignments?.length !== 0">

                                            <table class="table table-report -mt-2">
                                                <thead>
                                                    <tr>
                                                        <th class="whitespace-nowrap"></th>
                                                        <th class="whitespace-nowrap">CATEGORY</th>
                                                        <th class="text-center whitespace-nowrap">Questions Assigned</th>
                                                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                    </tr>
                                                </thead>



                                                <tbody>
                                                    <tr v-for="cat in catAssignments" :key="cat.id" class="intro-x">
                                                        <td class="w-10">

                                                            <Icon name="ri:pie-chart-2-fill" class="w-6 h-6"></Icon>

                                                        </td>
                                                        <td>
                                                            <div class="font-medium whitespace-nowrap">{{
                                                                cat.name.length > 40 ? cat.name.substring(0, 40) + '...' :
                                                                cat.name
                                                            }}</div>

                                                        </td>
                                                        <td class="text-center">{{ cat.contributorAssignments.length > 0 ?
                                                            cat.contributorAssignments[0].questionsRemaining : 0 }}</td>

                                                        <td class="table-report__action w-56">
                                                            <div class="flex justify-center items-center">
                                                                <button class="text-success flex items-center mr-3" @click="() => {
                                                                    catID = cat.id;
                                                                    AssignModal()

                                                                }">
                                                                    <Icon name="material-symbols:edit-outline"
                                                                        class="w-4 h-4"></Icon> Edit
                                                                </button>

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
                                                                        <Icon name="mdi:chevron-left"
                                                                            class="h-4 w-4 align-middle">
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
                    
                    <div class="w-4/12" v-if="analytics">
                        <h1 class="text-center text-4xl font-bold">{{ analytics.contributorName }}</h1>
                        <h6 class="text-center text-lg">{{ analytics.poolName }}</h6>
                        <div class="bg-white rounded-lg shadow-lg p-6 mt-4">
                            <h2 class="text-2xl font-bold mb-4 text-gray-600">Questions</h2>

                            <div class="grid grid-cols-2 gap-2 mt-4">
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:message-question-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Total Questions</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{
                                                    analytics.totalQuestionsCreated }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="material-symbols:pending-actions-sharp"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Questions Assigned</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{
                                                    analytics.totalAssignedQuestions }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>


                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
                            <h2 class="text-2xl font-bold mb-4 text-gray-600">Reviews</h2>
                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:comment-text-multiple-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Reviews Made</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{ analytics.submittedReviews }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="material-symbols:pending-actions-sharp"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Pending Reviews</h2>
                                                <p class="text-3xl font-bold text-gray-800">{{
                                                    analytics.totalReviewsAssigned }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="bg-white rounded-lg shadow-lg p-6 justify-center">
                                    <div class="">

                                        <div class="flex flex-row justify-between  items-center text-center">
                                            <div class="text-left align-middle">
                                                <Icon name="mdi:check-decagram-outline"
                                                    class="h-10 w-10  my-2 text-primary align-middle"></Icon>
                                            </div>
                                            <div class="text-right align-middle ">
                                                <h2 class="text-md font-bold text-gray-500">Approval Rate</h2>
                                                <p class="text-2xl font-bold text-gray-800" v-if="analytics.approvingRate">
                                                    {{
                                                        analytics.approvingRate.toFixed(2) }}%</p>
                                                <p v-else>-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>


                <div v-if="analytics"
                    class=" bg-white rounded-lg shadow-lg p-6 items-center mt-10 mx-auto flex flex-row justify-between w-11/12 space-x-20 ">
                    <div class="w-4/12">

                        <Doughnut :data="analytics.statusDistribution.data" :options="analytics.statusDistribution.options" />
                    </div>
                    <div class="w-8/12 items-center">

                        <Bar :data="analytics.catDistribution.data" :options="analytics.catDistribution.options" />
                    </div>
                </div>
               
            </div>


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
                    <div class="relative p-6 flex-auto justify-content-center">
                        <div class="flex flex-row ">
                            <div class="mx-auto">
                                <div v-if="categoriesNow" class="flex flex-row  mt-3 ">
                                    <label for="horizontal-form-1" class="my-auto w-2/6 font-medium">Category</label>
                                    <div class="flex flex-row rounded-md border ml-4">
                                        <div
                                            class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                            <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                        </div>
                                        <DropDownSelect :optionslist="categoriesNow" v-model="catID" title="Choose Cateogry"
                                            id="cat" aria-required="true" class="" />
                                    </div>
                                </div>
                                <div class="flex flex-row mt-3">
                                    <label for="horizontal-form-1" class="my-auto w-2/6 font-medium">Number of
                                        Questions</label>
                                    <div class="flex flex-row rounded-md border ml-5 w-1/2">
                                        <div
                                            class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                            <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                                        </div>
                                        <input name="editQuestionNumber" type="number" class="w-full px-5 "
                                            v-model="contrInfo.questionNumber" min="0" id="ques" />
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                    <!--footer-->
                    <div v-if="catID == ''">
                        <p class="text-red-600 text-center py-5 text-lg">Please choose the category before assigning!</p>
                    </div>
                    <div v-else>
                        <div class="flex items-center justify-center p-6 border-solid border-slate-200 rounded-b">

                            <button @click="handleAssignQuestions()"
                                class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center"
                                :disabled="isReloading">
                                <div v-if="isLoading">
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
        </div>
        <div v-if="showAssignModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>