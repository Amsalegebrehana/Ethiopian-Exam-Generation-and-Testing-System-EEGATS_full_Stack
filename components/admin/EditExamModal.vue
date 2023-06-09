
<template>
    <div v-if="open" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center ">
                    <!--header-->
                    <div class="flex items-end ml-auto justify-between p-5 border-solid border-slate-200 rounded-t">
                     
                        <button
                            class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" @click="closeModal">
                            <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                        </button>
                    </div>
                    <!-- modal body -->
                    <div class="ml-5 mb-5">
                          <!-- Tesing Date-->
                                                          
                            <div v-if="isUpdated && errorMessage.length === 0" class="alert alert-success alert-dismissible show flex items-center mb-2 text-white" role="alert">
                                <i data-lucide="alert-circle" class="w-6 h-6 mr-2"></i> Exam Updated Successfully!
                                <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div v-if="errorMessage.length !== 0" class="alert alert-danger alert-dismissible show flex items-center mb-2 text-white" role="alert">
                                <i data-lucide="alert-octagon" class="w-6 h-6 mr-2"></i> Error {{ errorMessage }}
                                <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>
                          <h2 class="intro-y text-lg font-medium mt-2 ml-3 px-3">Edit {{ props.exam?.name }}</h2>
                             
                        <div class="flex flex-row align-middle w-full mt-3">

                            <label for="horizontal-form-1" class=" my-auto align-middle w-3/6 font-medium text-md">Exam Date</label>
                            <Datepicker calendar-class="rounded text-priamry form-control w-full hover:-translate-y-0.5 hover:border-blue-700" :disabled-dates="disablePastDates" v-model="testingDate"  />

                        </div>  
                            <!-- Test Release date -->
                                                
                        <div class="flex flex-row align-middle w-full mt-3">

                            <label for="horizontal-form-1" class=" my-auto align-middle w-3/6 font-medium text-md">Grade Release Date</label>
                            <Datepicker calendar-class="rounded text-priamry form-control w-full" v-model="examReleaseDate" :disabled-dates="disablePastDates" />

                        </div> 
                   
                    <div class="flex flex-row w-full mt-3 ">
                      <label for="horizontal-form-1" class="my-auto w-3/6  font-medium text-md">Duration</label>

                        <Form >
                        
                            <ErrorMessage name="examDuration" class="text-red-500" />
                            <div class="flex flex-row rounded-md border hover:-translate-y-0.5 hover:border-blue-700">
                                <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                    <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                                </div>
                                    <Field 
                                        class=" form-control py-3 border-none w-full  font-medium text-black-900"
                                    
                                        name="examDuration" 
                                        type="number" 
                                        v-model.number="duration" />
                                    
                                    </div>
                         </Form>
           
                        </div>
                        <div class="flex justify-center items-center mt-5">
                            <button v-if="!isLoading" class="btn btn-primary text-white flex items-center mr-3 px-5" @click="editExam" >
                                <Icon name="material-symbols:edit-outline" class="mr-2 w-4 h-4"></Icon> Edit
                            </button>
                            <button v-if="isLoading" class="btn btn-gray-700 text-primary flex items-center mr-3" disabled >
                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>

                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as zod from 'zod';

import { ref, watch } from 'vue';


const { $client } = useNuxtApp();
// accept props from parent component
const props = defineProps({
    open: Boolean,
    exam: Object,
});

const isLoading = ref(false);

// testing date of exam
const testingDate = ref('');

// exam release date
const examReleaseDate = ref('');
// is exam updated
const isUpdated = ref(false);

// error message
const errorMessage = ref('');
// duration of exam
const duration = ref(props.exam?.duration || 0);

const disablePastDates = (date: Date)=> {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

      return date < today;
    }

// watch for changes in props.exam
watch(() => props.exam, (newVal: any, oldVal) => {
 
    duration.value = newVal.duration;
    testingDate.value = newVal.testingDate;
    examReleaseDate.value = newVal.examReleaseDate;
});

// Define the emitted event
const emits = defineEmits(['close','update:exam' ]);

// call updateExam mutation
const editExam = async() => {

    isLoading.value = true;
    try {
        const updatedExam = await $client.exam.updateExam.mutate({

            id: props.exam?.id,
            duration: duration.value,
            testingDate: testingDate.value,
            examReleaseDate: examReleaseDate.value,
            examGroupId: props.exam?.examGroupId,

        });
        emits('update:exam', updatedExam)


        
    } catch (error: any) {
      
        errorMessage.value = error.message;
    }
    isUpdated.value = true;
    isLoading.value = false;

}


// Close the modal when the close button is clicked
const closeModal = () => {


    isUpdated.value = false;
    isLoading.value = false;
    errorMessage.value = '';

    emits('close'); // Emit the 'close' event to the parent component
    
};

</script>