<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })
//TODO :form validation and upload widget fixing
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const { $client } = useNuxtApp()
const supabaseUrl = "https://ixzzkpsnlfushkyptszh.supabase.co";

const route = useRoute();
const contrId = route.params.id as string;
const { data: categories, pending } = await useAsyncData(() => $client.contributor.getAssignedCategories.query({ contrId }));
const questionInfo = ref({
    title: '',
    titleImage: '',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
    choiceFour: '',
    choiceOneImage: '',
    choiceTwoImage: '',
    choiceThreeImage: '',
    choiceFourImage: '',
    categoryId: ''
})
const isSubmitLoading = ref(false);
const isSaveLoading = ref(false);
const isModalVisible = ref(false);
const correctAnswer = ref('');
const step = ref(1);
const nextStep = () => {
    step.value++;
}
const prevStep = () => {
    step.value--;
}
const handleSave = async () => {
    isSaveLoading.value = true;
    const question = await $client.question.addQuestion.mutate({
        questionTitle: questionInfo.value.title,
        questionImage: questionInfo.value.titleImage,
        choiceOneTitle: questionInfo.value.choiceOne,
        choiceTwoTitle: questionInfo.value.choiceTwo,
        choiceThreeTitle: questionInfo.value.choiceThree,
        choiceFourTitle: questionInfo.value.choiceFour,
        choiceOneImage: questionInfo.value.choiceOneImage,
        choiceTwoImage: questionInfo.value.choiceTwoImage,
        choiceThreeImage: questionInfo.value.choiceThreeImage,
        choiceFourImage: questionInfo.value.choiceFourImage,
        correctChoice: correctAnswer.value,
        catId: questionInfo.value.categoryId,
        contrId: contrId
    })
    isSaveLoading.value = false;
    isModalVisible.value = true;
}

const handleSubmit = async () => {
    isSubmitLoading.value = true;
    const question = await $client.question.addQuestion.mutate({
        questionTitle: questionInfo.value.title,
        questionImage: questionInfo.value.titleImage,
        choiceOneTitle: questionInfo.value.choiceOne,
        choiceTwoTitle: questionInfo.value.choiceTwo,
        choiceThreeTitle: questionInfo.value.choiceThree,
        choiceFourTitle: questionInfo.value.choiceFour,
        choiceOneImage: questionInfo.value.choiceOneImage,
        choiceTwoImage: questionInfo.value.choiceTwoImage,
        choiceThreeImage: questionInfo.value.choiceThreeImage,
        choiceFourImage: questionInfo.value.choiceFourImage,
        correctChoice: correctAnswer.value,
        catId: questionInfo.value.categoryId,
        contrId: contrId
    })
    await $client.question.submitQuestion.mutate(question!.id);
    isSubmitLoading.value = false;
    isModalVisible.value = true;
}

const reload = () => {
    location.reload();
}

const getSrc = (filepath: string) => {
    return supabaseUrl + '/storage/v1/object/public/eegts-images/' + filepath
}

</script>

<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div class="flex">

            <ContributorSideBar pageName="questions" :contrId="contrId" />
            <div v-if="isModalVisible"
                class="absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
                <div class="py-5 px-3 flex-col bg-white rounded-xl">
                    <div
                        class="px-3 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[37em] max-w-[37em] flex h-[17vh] opacity-100 gap-4">
                        <div class="px-3 flex-col">
                            <Icon name="eva:checkmark-square-outline" class="w-12 h-12 text-green-600"></Icon>
                            <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                                Success!
                            </DialogTitle>
                            <p v-if="true" class="py-2 text-lg text-gray-500">
                                Your question is currently being reviewed. You can add more questions
                                or go back to view all the questions you've added so far.
                            </p>
                            <p v-else class="py-3 text-lg text-black-500">
                                Your work has been saved as a draft and is now accessible from your "Questions" tab.
                            </p>
                            <div class="sm:flex sm:flex-row-reverse gap-3">
                                <button @click="reload" class="btn btn-primary">
                                    Add Question
                                </button>
                                <NuxtLink :to="`/contributor/${contrId}/questions/`"
                                    class="font-medium whitespace-nowrap">
                                    <button @click="" class="btn btn-primary">
                                        View Questions
                                    </button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-10/12 mx-6 ">

                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/contributor/${contrId}/questions`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-medium ">Add Question</h2>

                </div>
                <!-- BEGIN: Form Layout -->
                <div class=" rounded-md mt-5 p-5 ">

                    <div
                        class="mx-auto relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
                        <div class="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                            <span class="w-10 h-10 rounded-full btn" :class="{
                                    'btn btn-primary': step === 1,
                                    'text-slate-500 bg-slate-100': step !== 1
                                }">1</span>
                            <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                                :class="{ 'font-medium': step === 1 }">
                                Create Question
                            </div>
                        </div>
                        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                            <span class="w-10 h-10 rounded-full btn" :class="{
                                    'btn btn-primary': step >= 2 && step <= 5,
                                    'text-slate-500 bg-slate-100': step < 2 || step > 5
                                }">
                                2
                            </span>
                            <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                                :class="{ 'font-medium': step >= 2 || step <= 5 }">
                                Add Choices
                            </div>
                        </div>
                        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                            <span class="w-10 h-10 rounded-full btn" :class="{
                                    'btn btn-primary': step === 6,
                                    'text-slate-500 bg-slate-100': step !== 6
                                }">
                                3
                            </span>
                            <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                                :class="{ 'font-medium': step === 6 }">
                                Select Correct Answer
                            </div>
                        </div>

                    </div>



                    <div class="mt-10 py-5 px-5">
                        <div v-if="step === 1">
                            <div v-if="pending" class=" text-center mt-20">
                                Loading...
                            </div>
                            <div v-else>


                                <div v-if="categories">

                                    <div class="flex flex-row w-4/6 my-4 mb-6 ">
                                        <label for="horizontal-form-1" class="my-auto w-1/6  font-medium text-base">Select
                                            Category</label>
                                        <div class="flex flex-row rounded-md border">
                                            <div
                                                class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                                <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                            </div>


                                            <DropDownSelect :optionslist="categories" v-model="questionInfo.categoryId"
                                                title="Select Category" class="" />
                                        </div>
                                    </div>


                                    <div class="font-medium text-base">Enter the question below</div>

                                    <div class="py-3  ">
                                        <client-only>

                                            <Tiptap v-model="questionInfo.title" class="w-screen " />

                                        </client-only>
                                    </div>

                                    <UploadImagewidget v-model:path="questionInfo.titleImage" class="px-2" />
                                    <div class="py-2 ml-auto w-1/12 mr-40">

                                        <button @click="nextStep" class="btn btn-primary"
                                            :disabled="!((questionInfo.title.length > 10 || questionInfo.titleImage.length > 1) && questionInfo.categoryId)">
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div v-else class=" text-center mt-20">
                                    Error Loading...
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 2">
                            <div>
                                <div class="py-3 inline-block">
                                    <h2 class="font-bold text-lg">Choice One</h2>
                                    <client-only>
                                        <Tiptap v-model="questionInfo.choiceOne" class="w-screen " />
                                    </client-only>
                                </div>
                                <UploadImagewidget v-model:path="questionInfo.choiceOneImage" class="px-2" />
                            </div>

                            <div class="flex flex-row mt-5 w-10/12">

                                <button @click="prevStep" class="btn btn-primary">Previous</button>
                                <div v-if="questionInfo.choiceOne.length > 6 || questionInfo.choiceOneImage.length > 1"
                                    class="py-2 ml-auto w-1/12">
                                    <button @click="nextStep" class="btn btn-primary">Next</button>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 3">

                            <div>
                                <div class="inline-block py-3">
                                    <h2 class="font-bold text-lg">Choice Two</h2>
                                    <client-only>
                                        <Tiptap v-model="questionInfo.choiceTwo" class="w-screen " />
                                    </client-only>
                                </div>
                                <UploadImagewidget v-model:path="questionInfo.choiceTwoImage" class="px-2" />
                            </div>

                            <div class="flex flex-row mt-5 w-10/12">

                                <button @click="prevStep" class="btn btn-primary">Previous</button>
                                <div v-if="questionInfo.choiceTwo.length > 6 || questionInfo.choiceTwoImage.length > 1"
                                    class="py-2 ml-auto w-1/12">
                                    <button @click="nextStep" class="btn btn-primary">Next</button>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 4">

                            <div>
                                <div class="inline-block py-3">
                                    <h2 class="font-bold text-lg">Choice Three</h2>
                                    <client-only>
                                        <Tiptap v-model="questionInfo.choiceThree" class="w-screen" />
                                    </client-only>
                                </div>
                                <UploadImagewidget v-model:path="questionInfo.choiceThreeImage" class="px-2" />
                            </div>

                            <div class="flex flex-row mt-5 w-10/12">

                                <button @click="prevStep" class="btn btn-primary">Previous</button>
                                <div v-if="questionInfo.choiceThree.length > 6 || questionInfo.choiceThreeImage.length > 1"
                                    class="py-2 ml-auto w-1/12">
                                    <button @click="nextStep" class="btn btn-primary">Next</button>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 5">

                            <div>
                                <div class=" inline-block py-3">
                                    <h2 class="font-bold text-lg">Choice Four</h2>
                                    <client-only>
                                        <Tiptap v-model="questionInfo.choiceFour" class="w-screen" />
                                    </client-only>
                                </div>
                                <UploadImagewidget v-model:path="questionInfo.choiceFourImage" class="px-2" />
                            </div>
                            <div class="flex flex-row mt-5 w-10/12">

                                <button @click="prevStep" class="btn btn-primary">Previous</button>
                                <div v-if="questionInfo.choiceFour.length > 6 || questionInfo.choiceFourImage.length > 1"
                                    class="py-2 ml-auto w-1/12">
                                    <button @click="nextStep" class="btn btn-primary">Next</button>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 6">

                            <h1 class="font-bold text-xl">Select the correct answer</h1>
                            <h2 class="font-bold text-lg">Question</h2>
                            <div>
                                <div v-html="questionInfo.title" class="p-2"></div>
                                <img v-if="questionInfo.titleImage" :src=getSrc(questionInfo.titleImage)
                                    style="width: 10em; height: 10em;" />
                            </div>

                            <div class="py-2">
                                <div class="flex flex-row align-middle my-4">
                                    <input id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceOne">
                                    <label class="pl-2 " for="radio_1">


                                        <div v-html="questionInfo.choiceOne" class="px-2"></div>
                                        <img v-if="questionInfo.choiceOneImage" :src=getSrc(questionInfo.choiceOneImage)
                                            style="width: 10em; height: 10em;" />

                                    </label>
                                </div>
                                <div class="flex flex-row align-middle my-4">
                                    <input id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceTwo">
                                    <label class="pl-2 " for="radio_1">


                                        <div v-html="questionInfo.choiceTwo" class="px-2"></div>
                                        <img v-if="questionInfo.choiceTwoImage" :src=getSrc(questionInfo.choiceTwoImage)
                                            style="width: 10em; height: 10em;" />

                                    </label>
                                </div>
                                <div class="flex flex-row align-middle my-4">
                                    <input id="radio_1" type="radio" name="radio" v-model="correctAnswer"
                                        value="choiceThree">
                                    <label class="pl-2 " for="radio_1">


                                        <div v-html="questionInfo.choiceThree" class="px-2"></div>
                                        <img v-if="questionInfo.choiceThreeImage" :src=getSrc(questionInfo.choiceThreeImage)
                                            style="width: 10em; height: 10em;" />

                                    </label>
                                </div>
                                <div class="flex flex-row align-middle my-4">
                                    <input id="radio_1" type="radio" name="radio" v-model="correctAnswer"
                                        value="choiceFour">
                                    <label class="pl-2 " for="radio_1">
                                        <div v-html="questionInfo.choiceFour" class="px-2"></div>
                                        <img v-if="questionInfo.choiceFourImage" :src=getSrc(questionInfo.choiceFourImage)
                                            style="width: 10em; height: 10em;" />

                                    </label>
                                </div>

                            </div>


                            <div class="flex justify-between">
                                <button @click="prevStep" class="flex-start btn btn-primary"
                                    :disabled="isSubmitLoading || isSaveLoading">
                                    Previous
                                </button>
                                <div v-if="correctAnswer.length > 2" class="flex-end flex gap-4">
                                    <button @click="handleSave()" class="btn btn-primary" :disabled="isSubmitLoading || isSaveLoading">
                                        <div v-if="isSaveLoading">
                                            <Icon name="eos-icons:bubble-loading" class="w-20 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Save as draft
                                        </div>
                                    </button>
                                    <button @click="handleSubmit()" class="btn btn-primary" :disabled="isSubmitLoading || isSaveLoading">
                                        <div v-if="isSubmitLoading">
                                            <Icon name="eos-icons:bubble-loading" class="w-20 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Submit
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- <CaeherEditor v-model="data" /> -->

                </div>
                <!-- END: Form Layout -->
            </div>
        </div>
    </div>
</template>

