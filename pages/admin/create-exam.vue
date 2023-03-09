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
                        
                        <button type="button" class="btn btn-primary w-24">Save</button>
                    </div>
                </div>
                <!-- END: Form Layout -->
            </div>
        </div>
    </div>
                
              
       
</template>

<script>
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

definePageMeta({ middleware: 'is-admin' })

export default {
    components: { AdminSideBar, AdminTopBar, DropDownSelect, Datepicker },
    name: 'CreateExam',
    data() {
        return {
            pools: [{ "id": "1", "name": "Chemistry", "numberofQuestions": 180 }, { "id": "2", "name": "Physics", "numberofQuestions": 90 }, { "id": "3", "name": "Biology", "numberofQuestions": 120 }],
            examgroups: [{ "id": "1", "name": "1990 Ethiopian National Exam", "numberOfExams": 9 }, { "id": "2", "name": "2000 Ethiopian National Exam", "numberOfExams": 9 }, { "id": "3", "name": "2001 Ethiopian National Exam", "numberOfExams": 9 }],
            examInfo: {
                name: '',
                selectedPool : '',
                selectedExamGroup:'',
                numberofQuestions:100,
                duration: 60,
                testingDate :''
            },
        }

    },
    methods: {
        addExam() {
            //TODO : form validation 
            console.log(this.examInfo);
        },
        
    }
}
</script>