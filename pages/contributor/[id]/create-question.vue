<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })
//TODO :form validation and upload widget fixing
const { $client } = useNuxtApp()
const supabaseUrl = "https://ixzzkpsnlfushkyptszh.supabase.co";

const route = useRoute ();
const contrId = route.params.id as string;
const {data: categories, pending} = await useAsyncData( ()=> $client.contributor.getAssignedCategories.query({contrId }));
const questionInfo = ref({
    title: '',
    titleImage : 'df',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
    choiceFour: '',
    choiceOneImage : '',
    choiceTwoImage : '',
    choiceThreeImage : '',
    choiceFourImage : '',
    categoryId: ''
})
const isLoading = ref(false);
const correctAnswer = ref('');
const step = ref(1);
const nextStep = () => {
  step.value++;
}
const prevStep = () => {
  step.value--;
}
const handlesubmit = async () =>{
    isLoading.value = true;
    await $client.question.addQuestion.mutate({
        questionTitle: questionInfo.value.title,
        questionImage : questionInfo.value.titleImage,
        choiceOneTitle: questionInfo.value.choiceOne,
        choiceTwoTitle: questionInfo.value.choiceTwo,
        choiceThreeTitle: questionInfo.value.choiceThree,
        choiceFourTitle: questionInfo.value.choiceFour,
        choiceOneImage : questionInfo.value.choiceOneImage,
        choiceTwoImage : questionInfo.value.choiceTwoImage,
        choiceThreeImage : questionInfo.value.choiceThreeImage,
        choiceFourImage : questionInfo.value.choiceFourImage,
        correctChoice: correctAnswer.value,
        catId: questionInfo.value.categoryId,
        contrId: contrId
    })
    isLoading.value = false;
    navigateTo(`/contributor/${contrId}/questions`)


}
const getSrc = (filepath : string)=>{
    return supabaseUrl + '/storage/v1/object/public/eegts-images/' +filepath
}

</script>

<template>
    <div>
        <TopBar role="contributor" />
        <div class="flex">
    
            <ContributorSideBar pageName="questions" />
            <div class="w-10/12 mx-6 ">
    
    <div class="flex flex-row  align-middle mt-10"> 
        <NuxtLink :to="`/contributor/${contrId}/questions`">
        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
        </NuxtLink>
        <h2 class="intro-y text-lg font-medium ">Add Question</h2>
      </div>
                <!-- BEGIN: Form Layout -->
            <div class=" rounded-md mt-5 p-5 ">
  
                <div class="mx-auto relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
                     <div class="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                    <span class="w-10 h-10 rounded-full btn" :class="{ 
                               'btn btn-primary': step === 1, 
                   'text-slate-500 bg-slate-100' : step !== 1
                        }">1</span>
                    <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                        :class="{'font-medium': step === 1}">
                        Create Question
                    </div>
                </div>
                <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                    <span class="w-10 h-10 rounded-full btn" :class="{ 
                               'btn btn-primary': step === 2, 
                   'text-slate-500 bg-slate-100' : step !== 2
                        }">
                        2
                    </span>
                    <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                        :class="{'font-medium': step === 2}">
                        Add Choices
                    </div>
                </div>
                <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                    <span class="w-10 h-10 rounded-full btn" :class="{ 
                               'btn btn-primary': step === 3, 
                   'text-slate-500 bg-slate-100' : step !== 3
                        }">
                        3
                    </span>
                    <div class=" text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"
                        :class="{'font-medium': step === 3}">
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
                            <label for="horizontal-form-1" class="my-auto w-1/6  font-medium text-base">Select Category</label>
                            <div class="flex flex-row rounded-md border">
                                <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                </div>
                            
                            
                                <DropDownSelect :optionslist="categories" v-model="questionInfo.categoryId" title="Select Category" class="" />
                            </div>
                        </div>

       
        <div class="font-medium text-base">Enter the question below</div>
    
    <div class="py-3  ">
        <client-only>
          
            <Tiptap v-model="questionInfo.title" class="w-screen " />
       
    </client-only>
</div>

<UploadImagewidget v-model:path="questionInfo.titleImage"  class="px-2" />
       <div class="py-2 ml-auto w-1/12 mr-40">

           <button @click="nextStep" class="btn btn-primary" :disabled="!(questionInfo.title.length>10 && questionInfo.categoryId)">Next</button>
       </div>
    </div><div v-else class=" text-center mt-20">
        Error Loading...
    </div>
</div>
    </div>
    <div v-else-if="step === 2" >
            <div class="py-3 inline-block">
                <h2 class="font-bold text-lg">Choice One</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceOne" class="w-screen " />
                </client-only>
            </div>
            <UploadImagewidget v-model:path="questionInfo.choiceOneImage" class="px-2" />
             <div class="pt-8 inline-block py-3">
                <h2 class="font-bold text-lg">Choice Two</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceTwo" class="w-screen " />
                </client-only>
            </div>
            <UploadImagewidget v-model:path="questionInfo.choiceTwoImage" class="px-2" />
                       <div class="pt-8 inline-block py-3">
                    <h2 class="font-bold text-lg">Choice Three</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceThree" class="w-screen" />
                </client-only>
            </div>
            <UploadImagewidget v-model:path="questionInfo.choiceThreeImage" class="px-2" />
                       <div class="pt-8 inline-block py-3">
                    <h2 class="font-bold text-lg">Choice Four</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceFour" class="w-screen" />
                </client-only>
            </div>
            <UploadImagewidget v-model:path="questionInfo.choiceFourImage" class="px-2" />
            <div class="flex flex-row mt-5 w-10/12">

                <button @click="prevStep" class="btn btn-primary">Previous</button>
                 <div v-if="questionInfo.choiceOne.length > 6 && questionInfo.choiceTwo.length > 6 && questionInfo.choiceThree.length > 6 && questionInfo.choiceFour.length > 6" class="py-2 ml-auto w-1/12">
                <button @click="nextStep" class="btn btn-primary">Next</button>
                </div>
            </div>
    </div>
    <div v-else-if="step === 3">
        <h1 class="font-bold text-xl">Select the correct answer</h1>
        <h2 class="font-bold text-lg">Question</h2>
        <div>
            <div v-html="questionInfo.title" class="p-2"></div>
            <img
      v-if="questionInfo.titleImage"
      :src=getSrc(questionInfo.titleImage)
      style="width: 10em; height: 10em;"
    />
        </div>

        <div class="py-2">
        <div class="flex flex-row align-middle my-4">
            <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceOne">
                  <label class="pl-2 " for="radio_1" >
                   
            
                            <div v-html="questionInfo.choiceOne" class="px-2"></div>
                            <img
                    v-if="questionInfo.choiceOneImage"
                    :src=getSrc(questionInfo.choiceOneImage)
                    style="width: 10em; height: 10em;"
                    />
                        
                  </label>
                  </div>
                  <div class="flex flex-row align-middle my-4">
            <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceTwo">
                  <label class="pl-2 " for="radio_1" >
                   
            
                            <div v-html="questionInfo.choiceTwo" class="px-2"></div>
                            <img
                    v-if="questionInfo.choiceTwoImage"
                    :src=getSrc(questionInfo.choiceTwoImage)
                    style="width: 10em; height: 10em;"
                    />
                        
                  </label>
                  </div>
                  <div class="flex flex-row align-middle my-4">
            <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceThree">
                  <label class="pl-2 " for="radio_1" >
                   
            
                            <div v-html="questionInfo.choiceThree" class="px-2"></div>
                            <img
                    v-if="questionInfo.choiceThreeImage"
                    :src=getSrc(questionInfo.choiceThreeImage)
                    style="width: 10em; height: 10em;"
                    />
                        
                  </label>
                  </div>
                  <div class="flex flex-row align-middle my-4">
            <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceFour">
                  <label class="pl-2 " for="radio_1" >
                   
            
                            <div v-html="questionInfo.choiceFour" class="px-2"></div>
                            <img
                    v-if="questionInfo.choiceFourImage"
                    :src=getSrc(questionInfo.choiceFourImage)
                    style="width: 10em; height: 10em;"
                    />
                        
                  </label>
                  </div>

    </div>


         <div class="flex flex-row mt-5 ">
    
                    <button @click="prevStep" class="btn btn-primary">Previous</button>
                     <div v-if="correctAnswer.length>2" class="py-2 ml-auto w-1/12">
                    <button @click="handlesubmit" class="btn btn-primary"> <div v-if="isLoading">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Submit
                                        </div></button>
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

