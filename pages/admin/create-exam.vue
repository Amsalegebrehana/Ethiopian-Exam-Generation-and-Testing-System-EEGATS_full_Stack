<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
    
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6 ">
    
    <div class="flex flex-row  align-middle mt-10"> 
        <NuxtLink :to="`/admin/exams`">
        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
        </NuxtLink>
        <h2 class="intro-y text-lg font-medium ">Create Exam</h2>
      </div>
                <!-- BEGIN: Form Layout -->
            <div class=" rounded-md mt-5 p-5 w-4/6">
                    <div class="flex flex-row align-middle w-4/6">
                        <label for="horizontal-form-1" class=" my-auto  w-2/6   font-medium">Exam Name</label>
                        <div class="flex flex-row rounded-md border">
                            <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                        
                            </div>
                        
                        
                                <input id="horizontal-form-1" type="text" class="rounded-r-md border-0 text-slate-600" placeholder="Enter Exam Name" v-model="examInfo.name">
                        </div>
                    </div>
        
                  
                    
                        <div class="flex flex-row w-4/6 mt-3 ">
                            <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Exam Group</label>
                            <div class="flex flex-row rounded-md border">
                                <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                </div>
                            
                            
                                <DropDownSelect :optionslist="examgroups" v-model="examInfo.selectedExamGroup" title="Choose Exam Group" class="" />
                            </div>
                        </div>
                       
                        <div class="flex flex-row w-4/6 mt-3 ">
                            <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Question Pool</label>
                            <div class="flex flex-row rounded-md border">
                                <div
                                    class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                            
                                </div>
                        
                                <DropDownSelect :optionslist="pools" v-model="examInfo.selectedPool" title="Choose Question Pool" class="" />
                            </div>
                        </div>
                    <div class="flex flex-row align-middle w-4/6 mt-3">
                        <label for="horizontal-form-1" class=" my-auto align-middle  w-2/6  font-medium">Number of Questions</label>
                        <input id="horizontal-form-1" type="number" class="rounded-md w-20 text-slate-600" 
                            v-model="examInfo.numberofQuestions">
                    </div>
                    
                    <div class="flex flex-row align-middle w-4/6 mt-3 ">
                        <label for="horizontal-form-1" class=" my-auto align-middle   w-2/6  font-medium">Duration(min)</label>
                        <div class="flex flex-row rounded-md border">
                            <div
                                class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                <Icon name="mdi:clock-time-four-outline" class="w-4 h-4 my-auto"></Icon>
                                
                            </div>
                          
                    
                            <input type="number" class="rounded-r-md w-20 text-slate-600 border-none"
                                v-model="examInfo.duration"> 
                        
                        </div>
                    </div>
                    <div class="flex flex-row align-middle w-4/6 mt-3">
                        <label for="horizontal-form-1" class=" my-auto align-middle w-2/6 font-medium">Exam Date</label>
                   <Datepicker calendar-class="rounded text-priamry " v-model="examInfo.testingDate"  />
 
                   </div>
                    <div class="text-center mt-5">
                        
                        <button type="button" class="btn btn-primary w-24" @click="addExam">Save</button>
                    </div>
                </div>
                <!-- END: Form Layout -->
            </div>
        </div>
    </div>
                
              
       
</template>

<script setup lang="ts">
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

definePageMeta({ middleware: 'is-admin' })

const { $client } = useNuxtApp();

const getPools = async () => {
    const pools = await $client.pool.getPools.query({skip:0});
    return pools;
};

const pools = await getPools();

const getExamGroups = async () => {
    const examgroups = await $client.examGroup.getExamGroups.query({skip:0});
    return examgroups;
};

const examgroups = await getExamGroups();

const examInfo =  {
                name: '',
                selectedPool : '',
                selectedExamGroup:'',
                numberofQuestions:100,
                duration: 60,
                testingDate : new Date()
            }     

const addExam = async  () => {
   

    //TODO : form validation
    const exam = await $client.exam.addExam.mutate({
        name: examInfo.name,
        poolId: examInfo.selectedPool,
        examGroupId: examInfo.selectedExamGroup,
        numberOfQuestions:examInfo.numberofQuestions,
        duration :examInfo.duration,
        testingDate: examInfo.testingDate

    }); 
    
}
</script>