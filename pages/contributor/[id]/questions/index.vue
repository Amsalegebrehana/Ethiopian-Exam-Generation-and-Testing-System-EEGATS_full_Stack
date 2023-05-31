<script setup lang="ts">
import { ref } from 'vue';
import { Category, QuestionStatus } from "@prisma/client";
import ViewQuestion from "@/components/ViewQuestion.vue";
import "vue3-circle-progress/dist/circle-progress.css";

definePageMeta({ middleware: 'is-contributor' })
const { $client } = useNuxtApp()

const modalVisible = ref(false);
const submitWarningVisible = ref(false);
const showCatagoriesVisible = ref(false);
const deleteWarningVisible = ref(false);
const isDeleteLoading = ref(false);
const isSubmitLoading = ref(false);
const isReloading = ref(false);
const selectedQuestion = ref();
const questionToDelete = ref();
const questionToSubmit = ref();
const page = ref(1);
const searchPage = ref(1);
const searchText = ref('');

const route = useRoute();
const contrId = route.params.id as string;



const { data: isAssigned } = await useAsyncData(() => $client.contributor.checkifAssigned.query({ contrId }));
const { data: categories } = await useAsyncData(() => $client.contributor.getRemainingQuestionsByCategories.query({ contrId }));
const questionsRemaining = categories.value == null? 0 : categories.value.reduce((sum, category) => sum + category.questionsRemaining, 0);
const { data: count, refresh: fetchQuestionsCount } = await useAsyncData(() => $client.contributor.getContributorDraftCount.query(contrId));
const { data: questions, refresh: fetchQuestions, pending} = await useAsyncData(() => $client.contributor.getContributorQuestions.query({contrId: contrId, skip: (page.value - 1) * 6}),
      { watch: [page, searchText]} );
const { data: searchCount, refresh: fetchSearchCount } = await useAsyncData(() => $client.contributor.searchQuestionsCount.query({ search: searchText.value !== '' ? searchText.value : undefined }), { watch: [searchPage, searchText] });
const { data: searchQuestions, refresh: fetchSearchQuestions, pending: pendingSearch } = await useAsyncData(() => $client.contributor.searchQuestions.query({ search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6 }),
    { watch: [page, searchText] });
const { data: canAddQuestion } = await useAsyncData(async () => {
    const contrCount = await $client.contributor.getCountOfContributors.query();
    return contrCount > 2;
    });
const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchQuestions();
        await fetchQuestionsCount();
    } finally {
        isReloading.value = false
    }
}

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchQuestions();
        await fetchSearchCount();
    } finally {
        isReloading.value = false;
    }
}

async function toggleModal(question: Object) {
    selectedQuestion.value = await $client.question.getQuestion.query(question.id);
    modalVisible.value = !modalVisible.value;
}

const toggleDeleteWarning = (questionId?: string) => {
    questionToDelete.value = questionId;
    deleteWarningVisible.value = !deleteWarningVisible.value;
}
const toggleSubmitWarning = (questionId?: string) => {
    questionToSubmit.value = questionId;
    submitWarningVisible.value = !submitWarningVisible.value;
}
const toggleShowCategory = () => {
    showCatagoriesVisible.value = !showCatagoriesVisible.value
}

async function onDelete() {
    isDeleteLoading.value = !isDeleteLoading.value;
    const deleteQuestion = await $client.question.deleteQuestion.mutate(questionToDelete.value);
    isDeleteLoading.value = !isDeleteLoading.value;
    toggleDeleteWarning();
    window.location.reload()
}

async function onSubmit() {
    isSubmitLoading.value = !isSubmitLoading.value;
    const submitQuestion = await $client.question.submitQuestion.mutate(questionToSubmit.value);
    isSubmitLoading.value = !isSubmitLoading.value;
    toggleSubmitWarning();
    window.location.reload()
}

async function onViewMore() {
    showCatagoriesVisible.value = !showCatagoriesVisible.value
}
</script>



<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div v-if="modalVisible">
            <ViewQuestion :question="selectedQuestion" />
        </div>
        <!-- Begin Add Question -->
        <div class="text-lg fixed z-[100] bottom-16 right-10 md:block mx-auto text-slate-500">
            <NuxtLink :to="`/contributor/${contrId}/create-question`">
                <button class="btn btn-primary shadow-md mr-2" :disable="!isAssigned || canAddQuestion!">
                    Add question
                    <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                </button>
            </NuxtLink>
        </div>
        <!-- End Add Question -->
        <div v-if="deleteWarningVisible"
            class="text-xl absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
            <div class="py-5 px-3 flex-col bg-white rounded-xl">
                <div
                    class="px-3 bg-white text-lg rounded-xl sm:min-w-[100%] lg:min-w-[37em] max-w-[37em] flex h-[12vh] opacity-100 gap-4">
                    <div class="px-3 flex-col">
                        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                            Are you sure you want to delete this question?
                        </DialogTitle>
                        <p class="py-3 text-sm text-gray-500"> All associated
                            data including question prompt, choices, images, and review will be permanently lost. This
                            action cannot be undone. </p>
                        <div class="flex justify-center items-center">
                        </div>
                        <div class="sm:flex sm:flex-row-reverse gap-3">
                            <svg v-if="isDeleteLoading" aria-hidden="true"
                                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                viewBox="0 0 100 101" fill="none">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                            <button v-else @click="onDelete"
                                class="inline-flex text-sm font-semibold justify-center rounded-md px-3 py-2 bg-red-700 hover:bg-red-600 text-white">
                                Delete
                            </button>
                            <button type="button" @click="toggleDeleteWarning()"
                                class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="submitWarningVisible"
            class="text-xl absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
            <div class="py-5 px-3 flex-col bg-white rounded-xl">
                <div
                    class="px-3 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[37em] max-w-[37em] flex h-[12vh] opacity-100 gap-4">
                    <div class="px-3 flex-col">
                        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                            Are you sure you want to submit this draft?
                        </DialogTitle>
                        <p class="py-3 text-sm text-gray-500"> You cannot edit your work once you have submited it. Please
                            make sure the question and its choices are up to standards. </p>
                        <div class="flex justify-center items-center">
                        </div>
                        <div class="sm:flex sm:flex-row-reverse gap-3">
                            <svg v-if="isSubmitLoading" aria-hidden="true"
                                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                                viewBox="0 0 100 101" fill="none">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                            <button v-else @click="onSubmit"
                                class="inline-flex text-sm font-semibold justify-center rounded-md px-3 py-2 bg-green-700 hover:bg-green-600 text-white">
                                Submit
                            </button>
                            <button type="button" @click="toggleSubmitWarning()"
                                class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showCatagoriesVisible"
            class="text-xl absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
            <div class="py-5 px-3 flex-col bg-white rounded-xl">
                <div class="flex-col px-3 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[37em] max-w-[37em] h-[50vh] opacity-100 gap-4">
                    <div class="p-4 flex justify-between w-[100%]">
                        <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                            Remaining Questions by Category
                        </DialogTitle>
                        <button @click="toggleShowCategory" class="float-right px-1">
                            <Icon name="eva:close-outline" class="w-8 h-8 text-red-600"></Icon>
                        </button>
                    </div>
                    <ul v-if="categories" class="w-[96%] h-[83%] p-4 divide-y overflow-auto">
                        <li v-for="category in categories" class="pb-3 sm:pb-4">
                            <div class="flex justify-between items-center space-x-4 py-4">
                                <div class="w-20">
                                    <p class="text-lg font-medium text-gray-900 truncate">
                                    {{ category!.name }}
                                    </p>
                                </div>
                                <div class="px-5 self-end float-right text-lg inline-flex items-center font-semibold text-gray-900">
                                    {{ category!.questionsRemaining }}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex h-100vh">
            <ContributorSideBar pageName="questions" :contrId="contrId" />
            <div class="w-full mx-6">

                <h2 class="intro-y text-lg font-medium mt-10">List of Questions</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap justify-between items-center mt-2">
                        <div class="flex gap-5">
                            <span class="intro-y text-lg font-medium pt-7 pr-5">
                                {{ questionsRemaining }} questions remaining
                                <button @click="onViewMore">
                                    <icon name="material-symbols:more-up" class="mx-2 w-7 h-7 text-blue-700"></icon>
                                </button>
                            </span>
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." v-model="searchText"/>
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                                </Icon>
                            </div>
                        </div>
                    </div>

                    <!-- BEGIN: Data List -->
                    <div v-if="searchText == ''" class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table class="table table-report mt-2">
                            <thead>
                                <tr class="text-lg">
                                    <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap">Question</th>
                                    <th class="text-center whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody v-if="questions !== null" class="text-lg">
                                <tr v-for="question in questions" :key="question.id" class="intro-x">
                                    <!-- Question Icon -->
                                    <td class="w-10">
                                        <button @click="toggleModal(question)">
                                            <Icon name="uiw:question-circle-o" class="w-6 h-6"></Icon>
                                        </button>
                                    </td>
                                    <!-- Question Title -->
                                    <td>
                                        <button
                                            v-html="question.title.length < 130 ? question.title : question.title.slice(0, 120) + ` ...`"
                                            @click="toggleModal(question)" />
                                    </td>
                                    <!-- Actions -->
                                    <td class="table-report__action w-66">
                                        <div class="flex justify-center items-center">
                                            <NuxtLink :to="`/contributor/${contrId}/questions/${question.id}/EditQuestion`"
                                                class="font-medium whitespace-nowrap">
                                                <a class="flex items-center mr-3" href="javascript:;">
                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                    <p class="px-1"> Edit </p>
                                                </a>
                                            </NuxtLink>
                                            <a class="flex items-center text-danger mr-3" href="javascript:;">
                                                <button @click="toggleDeleteWarning(question.id)" class="text-red-600">
                                                    <Icon name="fa6-regular:trash-can" class="w-4 h-4"></Icon> Delete
                                                </button>
                                            </a>
                                            <button @click="toggleSubmitWarning(question.id)"
                                                class="flex items-center text-green-600" href="javascript:;">
                                                <Icon name="eva:checkmark-outline" class="w-8 h-8 text-green-600"></Icon>
                                                Submit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <div v-else>
                                No questions found
                            </div>
                        </table>

                    </div>
                    <div v-else class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table class="table table-report mt-2">
                            <thead>
                                <tr class="text-lg">
                                    <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap">Question</th>
                                    <th class="text-center whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody v-if="questions !== null" class="text-lg">
                                <tr v-for="question in searchQuestions" :key="question.id" class="intro-x">
                                    <!-- Question Icon -->
                                    <td class="w-10">
                                        <button @click="toggleModal(question)">
                                            <Icon name="uiw:question-circle-o" class="w-6 h-6"></Icon>
                                        </button>
                                    </td>
                                    <!-- Question Title -->
                                    <td>
                                        <button
                                            v-html="question.title.length < 130 ? question.title : question.title.slice(0, 120) + ` ...`"
                                            @click="toggleModal(question)" />
                                    </td>
                                    <!-- Actions -->
                                    <td class="table-report__action w-66">
                                        <div class="flex justify-center items-center">
                                            <NuxtLink :to="`/contributor/${contrId}/questions/${question.id}/EditQuestion`"
                                                class="font-medium whitespace-nowrap">
                                                <a class="flex items-center mr-3" href="javascript:;">
                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                    <p class="px-1"> Edit </p>
                                                </a>
                                            </NuxtLink>
                                            <a class="flex items-center text-danger mr-3" href="javascript:;">
                                                <button @click="toggleDeleteWarning(question.id)" class="text-red-600">
                                                    <Icon name="fa6-regular:trash-can" class="w-4 h-4"></Icon> Delete
                                                </button>
                                            </a>
                                            <button @click="toggleSubmitWarning(question.id)"
                                                class="flex items-center text-green-600" href="javascript:;">
                                                <Icon name="eva:checkmark-outline" class="w-8 h-8 text-green-600"></Icon>
                                                Submit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <div v-else>
                                No questions found
                            </div>
                        </table>

                    </div>
                    
                    <!-- END: Data List -->
                    <!-- BEGIN: Pagination -->
                    <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                        <nav class="w-full sm:w-auto sm:mr-auto">
                            <ul v-if="searchText != ''" class="pagination">
                                <li class="page-item">
                                    <button class="page-link" v-on:click="paginateSearch(searchPage - 1)" :disabled="searchPage === 1">
                                        <div class="flex flex-row align-middle justify-center items-center  ">
                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                            </Icon>
                                            <span class="">Previous</span>
                                        </div>
                                    </button>
                                </li>
                                <li class="page-item">
                                    <button class="page-link" v-on:click="paginateSearch(searchPage + 1)"
                                        :disabled="(searchPage) * 6 >= searchCount!">
                                        <div class="flex flex-row align-middle justify-center items-center">
                                            <span>Next</span>
                                            <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle">
                                            </Icon>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                            <ul v-else class="pagination">
                                <li class="page-item">
                                    <button class="page-link" v-on:click="paginate(page - 1)" :disabled="page === 1">
                                        <div class="flex flex-row align-middle justify-center items-center  ">
                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                                            </Icon>
                                            <span class="">Previous</span>
                                        </div>
                                    </button>
                                </li>
                                <li class="page-item">
                                    <button class="page-link" v-on:click="paginate(page + 1)"
                                        :disabled="(page) * 6 >= count!">
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
                    <!-- END: Pagination -->
                </div>


            </div>
        </div>
    </div>
</template>
