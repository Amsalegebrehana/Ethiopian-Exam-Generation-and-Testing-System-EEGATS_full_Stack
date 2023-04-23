<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
    
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6 ">
    

        
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
                        
                                <DropDownSelect :optionslist="poolswithCategories" v-model="examInfo.selectedPool" title="Choose Question Pool"  />
                            </div>
                        </div>
                    <div class="flex flex-row align-middle w-4/6 mt-3">
                        <label for="horizontal-form-1" class=" my-auto align-middle  w-2/6  font-medium">Number of Questions</label>
                        <input id="horizontal-form-1" type="number" class="rounded-md w-20 text-slate-600" 
                            v-model="examInfo.numberofQuestions">
                    </div>
                    <!-- Categories -->
                    <div class="flex flex-row align-middle w-4/6 mt-3">
                        <label for="horizontal-form-1" class=" my-auto align-middle  w-2/6  font-medium">Categories</label>
                       
                    </div>
                                                    
              
                    <!-- categories dynamic ui -->
                    <div v-if="examInfo.selectedPool!==''" v-for="index in numDynamicUI" :key="index" class="my-5">
                        <div class="grid grid-cols-12 gap-2">
                            <div class="flex flex-row rounded-md border form-control col-span-4">
                            <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                            </div>
                            <DropDownSelect :optionslist="filterCategory(examInfo.selectedPool)" v-model="examInfo.selectedCategories" title="Choose Question Categories" />
                            </div>
                            <input type="text" class="form-control col-span-4" placeholder="Number of questions" aria-label="Number of questions">
                            <button class="btn btn-primary shadow-md" @click="addDynamicUI">
                            <Icon name="material-symbols:add-box-rounded" class="text-white"></Icon>
                            </button>
                        </div>
                        </div>
                    <!-- categories dynamic ui ends here -->
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
                        
                        <button type="button" class="btn btn-primary w-24" @click="createExam">Save</button>
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
const numDynamicUI = ref(1);

const poolsCategory = async()=>{
    const poolsCategories = await $client.pool.getPoolsWithCategories.query({});
    return poolsCategories;
}
const poolswithCategories = await poolsCategory();


const getExamGroups = async () => {
    const examgroups = await $client.examGroup.getExamGroups.query({skip:0});
    return examgroups;
};

const handleOnchange = (e: any) => {
    console.log("e",e);
}

const filterCategory = (poolId: string) => {
 
    const poolsCategory = poolswithCategories.filter((pool) => {
        pool.id === poolId
       
    });
    
    return poolsCategory;
};

const examgroups = await getExamGroups();


const examInfo =  {
                name: '',
                selectedPool : '',
                selectedExamGroup:'',
                selectedCategories: '',
                numberofquestionPerCategory:0,
                numberofQuestions:100,
                duration: 60,
                testingDate : new Date()
            }  

const createExam = async  () => {
   
    const exam = await $client.exam.addExam.mutate({
        name: examInfo.name,
        poolId: examInfo.selectedPool,
        examGroupId: examInfo.selectedExamGroup,
        numberOfQuestions:examInfo.numberofQuestions,
        duration :examInfo.duration,
        testingDate: examInfo.testingDate

    }); 
    
}
// method to add dynamic ui
const dynamicUIs: { selectedCategories: string; }[] = [];
const addDynamicUI = ()=> {
    dynamicUIs.push({
        selectedCategories: "",
    });
 
    numDynamicUI.value++;
    };
const removeDynamicUI = (index: any) => {
      dynamicUIs.splice(index, 1);
        numDynamicUI.value--;
    };
</script>