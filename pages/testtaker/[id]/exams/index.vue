<script setup lang="ts">
definePageMeta({ middleware: 'is-testtaker' })
const route = useRoute ();
const testTakerId = route.params.id as string;     
const { $client } = useNuxtApp()
const page = ref(1);
const isReloading = ref(false);
const searchText  = ref('');
const {data: count, refresh:fetchCount} = await useAsyncData( ()=> $client.testtaker.getExamsCount.query({testTakerId}));
const {data: exams, refresh:fetchExams, pending} = await useAsyncData(()=> $client.testtaker.getExams.query({testTakerId, search: searchText.value !== '' ? searchText.value : undefined, skip : (page.value - 1) * 6}), {watch: [page, searchText]});
const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchExams();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}
const showGradeModal = ref(false);
const toggleViewGradeModal = () => {
    showGradeModal.value = !showGradeModal.value;
}
const gradeInfo = ref({ name: '', score : 0});
const GradeModal = async (name : string, score : number) => {
gradeInfo.value.name = name;
gradeInfo.value.score = score;
showGradeModal.value = !showGradeModal.value;

}
</script>
<template>
    <div>
        <TopBar role="testtaker" :id="testTakerId" />
        <div class="flex">

            <div class="w-full mx-20">


                <h2 class="intro-y text-lg font-medium mt-10">List of exams</h2>

                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
                    <div></div>
                    
                    <div class=" ml-auto mt-3 sm:mt-0 ">
                        <div class="w-56 relative text-slate-500">
                            <input type="text" class="form-control w-56 box pr-10" placeholder="Search..."  v-model="searchText"/>
                            <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" ></Icon>
                        
                        </div>
                    </div>
                </div>
          
                <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                      <div v-if="exams?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                    <p>No exams found</p>
                                </div>
                            <div v-if="exams?.length !== 0">
                        
                    <table class="table table-report -mt-2">
                        <thead>
                            <tr>
                                <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap w-2/12">Exams</th>
                                    <th class="text-center whitespace-nowrap w-2/12">Number of Questions</th>
                                    <th class="text-center whitespace-nowrap w-2/12">Testing Date</th>
                                    <th class=" text-center whitespace-nowrap w-2/12">Exam Duration(mins)</th>
                                    <th class="text-center whitespace-nowrap w-full">ACTIONS</th>
                            </tr>
                        </thead>
                       

                          
                            <tbody>
                                <tr v-for="exam in exams" :key="exam.id" class="intro-x">
                                    <td class="w-10">
                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                        
                                    </td>
                                    <td class="font-medium whitespace-nowrap w-2/12 ">
                                        
                                        {{
                                            exam.name.length > 40 ? exam.name.slice(0, 39) + "..." : exam.name
                                        }}

</td>

                                    <td class="text-center w-2/12">{{ exam.numberOfQuestions }}</td>
                                  
                                    <td class=" text-center w-2/12">{{ exam.testingDate.toLocaleString() }}</td>
                                    <td class=" text-center w-2/12">{{ exam.duration }}</td>
                                    <td class="items-center">
                                    
                                        <div v-if="exam.status === 'gradeReleased'" class="flex items-center justify-center">
                                            <div class="flex justify-center items-center">
                                                <a class="flex items-center mr-6" href="javascript:;" @click="GradeModal(exam.name, exam.TestSession[0].grade )">
                                                    <Icon name="material-symbols:demography-rounded" class="w-4 h-4 mr-1"></Icon> View Grade
                                                </a>
                                                
                                            </div>
                                        </div>
                                        <div v-if="exam.status === 'published'">
                                            <div v-if=" exam.testingDate > new Date()"  >
                                                <div class="flex flex-row justify-center text-danger" >
                                                    <Icon name="ph:warning-circle" class="w-4 h-4 mr-1" ></Icon>
                                                    <span> Unavailable</span>
                                                </div>
                                            </div>
                                            <div v-else-if=" (exam.testingDate < new Date && new Date(exam.testingDate.getTime() + exam.duration*60000) > new Date()  )">

                                                <div v-if="exam.TestSession[0]">
                                                    <div v-if="!exam.TestSession[0].isSubmitted">
                                                        <Nuxt-Link class="flex items-center text-success justify-center " :to="`/testtaker/${testTakerId}/exams/${exam.id}`" >
                                                            <Icon name="material-symbols:play-circle" class="w-4 h-4 mr-1"></Icon> Resume Exam
                                                        </Nuxt-Link>
                                                    </div>
                                                    <div v-else>
                                                     <div class="flex flex-row text-success justify-center">
    
                                                        <Icon name="material-symbols:check-circle-outline" class="w-4 h-4 mr-1" ></Icon>
                                                        <span> Submitted</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <div v-if="(exam.testingDate < new Date && new Date(exam.testingDate.getTime() + exam.duration*60000) > new Date()  )">
                                                        <Nuxt-Link class="flex items-center text-success justify-center " :to="`/testtaker/${testTakerId}/exams/${exam.id}`">
                                                            <Icon name="material-symbols:play-circle" class="w-4 h-4 mr-1"></Icon> Start Exam
                                                        </Nuxt-Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div v-if="exam.TestSession[0]">
                                                    <div v-if="exam.TestSession[0].isSubmitted">
                                                        <div class="flex flex-row text-success justify-center ">
    
                                                            <Icon name="material-symbols:check-circle-outline" class="w-4 h-4 mr-1" ></Icon>
                                                            <span> Submitted</span>
                                                            </div>
                                                    </div>
                                        
                                                </div>
                                                <div v-else>
                                                    <div class="flex flex-row justify-center text-danger" >
                                                    <Icon name="ph:warning-circle" class="w-4 h-4 mr-1" ></Icon>
                                                    <span> Unavailable</span>
                                                </div>
                                                </div>
                                            </div>

                                        </div>
                                     
                                       
                                         
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="flex flex-row mt-3">
                <div class="md:block  text-slate-500">
                   
                         Showing {{1 + (page-1)*6}} to {{ page*6 <count! ? page*6:count }} of {{count! }} entries
                                    </div>
                                    <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                        <nav class="w-full sm:w-auto sm:mr-auto">
                                            <ul class="pagination">
                                                
                                                <li class="page-item">
                                                    <button class="page-link" v-on:click="paginate(page-1)" :disabled="page===1">
                                                        <div class="flex flex-row align-middle justify-center items-center  ">
                                                            <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                            <span class="">Previous</span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li class="page-item">  
                                                    <button class="page-link" v-on:click="paginate(page+1)" :disabled="(page) * 6 >= count!">
                                                        <div class="flex flex-row align-middle justify-center items-center">
                                                                <span>Next</span>
                                                                <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle"></Icon>
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
                <div>

<div v-if="showGradeModal"
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
                    type="button" v-on:click="toggleViewGradeModal()">
                    <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
            
              
                    
                    <p class="align-middle my-auto font-bold text-lg text-center p-20">You have scored {{  gradeInfo.score}} for {{ gradeInfo.name }} Exam</p>
                 
              
            </div>
            <!--footer-->
         
        </div>
    </div>
</div>
<div v-if="showGradeModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</div>
              
                  
                </div>
              
            </div>
        </div>
    
</template>
