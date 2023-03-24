<script setup>
definePageMeta({ middleware: 'is-contributor' })
const questionInfo = ref({
  title: '',
  choiceOne: '',
  choiceTwo: '',
  choiceThree: '',
  choiceFour: '',
})
const question_title_path = ref('');
const correctAnswer = ref('');
const step = ref(1);
const nextStep = () => {
  step.value++;
}
const prevStep = () => {
  step.value--;
}

</script>

<template>
    <div>
        <TopBar role="contributor" />
        <div class="flex">
    
            <ContributorSideBar pageName="questions" />
            <div class="w-10/12 mx-6 ">
    
    <div class="flex flex-row  align-middle mt-10"> 
        <NuxtLink :to="`/contributor/questions`">
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
    <div v-if="step === 1" class="w-10/12">
        <div class="font-medium text-base">Enter the question below</div>
    {{ question_title_path }}
    https://ixzzkpsnlfushkyptszh.supabase.co/storage/v1/object/public/eegts-images/0.08247799274854795.png
        <div class="py-3">
            <client-only>
                <Tiptap v-model="questionInfo.title" class="w-screen" />
            </client-only>
        </div>
      <Uploadwidget v-model:path="question_title_path" />
       <div v-if="questionInfo.title.length>10" class="py-2 ml-auto w-1/12">

           <div @click="nextStep" class="btn btn-primary">Next</div>
       </div>
    </div>
    <div v-else-if="step === 2" >
            <div class="py-3 inline-block">
                <h2 class="font-bold text-lg">Choice One</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceOne" class="w-screen " />
                </client-only>
            </div>
             <div class="pt-8 inline-block">
                <h2 class="font-bold text-lg">Choice Two</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceTwo" class="w-screen " />
                </client-only>
            </div>
                       <div class="pt-8 inline-block">
                    <h2 class="font-bold text-lg">Choice Three</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceThree" class="w-screen" />
                </client-only>
            </div>
                       <div class="pt-8 inline-block">
                    <h2 class="font-bold text-lg">Choice Four</h2>
                <client-only>
                    <Tiptap v-model="questionInfo.choiceFour" class="w-screen" />
                </client-only>
            </div>
            <div class="flex flex-row mt-5 w-10/12">

                <button @click="prevStep" class="btn btn-primary">Previous</button>
                 <div v-if="questionInfo.choiceOne.length > 6 && questionInfo.choiceTwo.length > 6 && questionInfo.choiceThree.length > 6 && questionInfo.choiceFour.length > 6" class="py-2 ml-auto w-1/12">
                <button @click="nextStep" class="btn btn-primary">Next</button>
                </div>
            </div>
    </div>
    <div v-else-if="step === 3">
        <h1 class="font-bold text-lg">Question</h1>
        <div v-html="questionInfo.title" class="p-2"></div>

        <div class="py-2">
        <div class="flex flex-row align-middle my-1">
            <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceOne">
                  <label class="pl-2 " for="radio_1" >
                   
                <div v-html="questionInfo.choiceOne"></div>
                  </label>
                  </div>
                   <div class="flex flex-row align-middle my-1">
                <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceTwo">
                      <label class="pl-2 " for="radio_1" >
                       
                    <div v-html="questionInfo.choiceTwo"></div>
                      </label>
                      </div>
                         <div class="flex flex-row align-middle my-1">
                    <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceThree">
                          <label class="pl-2 " for="radio_1" >
                           
                        <div v-html="questionInfo.choiceThree"></div>
                          </label>
                          </div>
                             <div class="flex flex-row align-middle my-1">
                    <input  id="radio_1" type="radio" name="radio" v-model="correctAnswer" value="choiceFour">
                          <label class="pl-2 " for="radio_1" >
                           
                        <div v-html="questionInfo.choiceFour"></div>
                          </label>
                          </div>

    </div>


         <div class="flex flex-row mt-5 ">
    
                    <button @click="prevStep" class="btn btn-primary">Previous</button>
                     <div v-if="correctAnswer.length>2" class="py-2 ml-auto w-1/12">
                    <button @click="submit" class="btn btn-primary">Submit</button>
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

