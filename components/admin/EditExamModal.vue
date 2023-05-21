
<template>
    <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center">
                    <!--header-->
                    <div class="flex items-end ml-auto justify-between p-5 border-solid border-slate-200 rounded-t">
                        <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                        <button
                            class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" @click="toggle">
                            <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                        </button>
                    </div>
                    <!-- modal body -->
                    <div>
                          <!-- Tesing Date-->
                               
                        <div class="flex flex-row align-middle w-4/6 mt-3">

                            <label for="horizontal-form-1" class=" my-auto align-middle w-2/6 font-medium text-lg">Exam Date</label>
                            <Datepicker calendar-class="rounded text-priamry form-control w-full hover:-translate-y-0.5 hover:border-blue-700" v-model="testingDate"  />

                        </div>  
                            <!-- Test Release date -->
                                                
                        <div class="flex flex-row align-middle w-4/6 mt-3">

                            <label for="horizontal-form-1" class=" my-auto align-middle w-2/6 font-medium text-lg">Grade Release Date</label>
                            <Datepicker calendar-class="rounded text-priamry form-control w-full" v-model="examReleaseDate"  />

                        </div> 
                   
                    <div class="flex flex-row w-4/6 mt-3 ">
                      <label for="horizontal-form-1" class="my-auto w-2/6  font-medium text-lg">Duration</label>

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
                    </div>
                </div>
            </div>
        </div>
</template>
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as zod from 'zod';
import { toFieldValidator } from '@vee-validate/zod';
import { ref, computed, watch } from 'vue';
// testing date of exam
const testingDate = ref('');
// exam release date
const examReleaseDate = ref('');

// duration of exam
const duration = ref(0);

</script>