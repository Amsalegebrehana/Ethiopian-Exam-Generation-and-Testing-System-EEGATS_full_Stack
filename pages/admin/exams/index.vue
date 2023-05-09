<template>
    <div>
        <AdminTopBar role="admin"/>
        <div class="flex"> 

            <AdminSideBar pageName="exams"/>
            <div class="w-full mx-6">
            
            
                <h2 class="intro-y text-lg font-medium mt-10">List of exams</h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                        <NuxtLink :to="`/admin/create-exam`">
                        <button class="btn btn-primary shadow-md mr-2">Create exam
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                        </NuxtLink>
                        <div class="hidden md:block mx-auto text-slate-500">
                            Showing 1 to 10 of {{ exams?.length }} entries
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" v-model="searchInput" placeholder="Search..." />
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
            
                            </div>
                        </div>
                    </div>
                     <!-- BEGIN: Data List -->
                     <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                        <table class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Exams</th>
                                                    <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                    <th class="whitespace-nowrap">Status</th>
                                                    <th class="whitespace-nowrap">Testing Date</th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="exam in filteredExams" :key="exam.id" class="intro-x">
                                                    <td class="w-10">
                                                        <NuxtLink :to="`/admin/exams/${exam.id}`">
                                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>
                                                        </NuxtLink>
                                                    </td>
                                                    <td>
                                                        <NuxtLink :to="`/admin/exams/${exam.id}`" class="font-medium whitespace-nowrap">{{
                                                            exam.name.length > 40 ? exam.name.slice(0,39) + "..." : exam.name
                                                        }}</NuxtLink>
                            
                                                    </td>
                                                    <td class="text-center">{{ exam.numberOfQuestions }}</td>
                                                    <td class="w-40">
                                                                <div class="flex items-center justify-center" :class="{
                                                                    'text-success': exam.status === 'generated',
                                                                    'text-primary': exam.status === 'published',
                                                                    'text-danger': exam.status === 'gradeReleased',
                                                                }">
                                                                    <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon>
                                                                         {{ examStatus(exam.status) }}
                                                                </div>
                                                            </td>
                                                            <td class="">{{ testingDateformat(exam.testingDate) }}</td>
                                                    <td class="table-report__action w-40">
                                                        <div class="flex justify-center items-center">
                                                            <a class="flex items-center mr-3" href="javascript:;">
                                                                <Icon name="eva:checkmark-square-outline" class="w-4 h-4"></Icon> Edit
                                                            </a>
                                                         
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                    </div>
                                    <!-- END: Data List -->
                   
                     </div>
                      <!-- BEGIN: Pagination -->
                    <div class="flex flex-row mt-3">
                      <div class="md:block  text-slate-500">
                   
                         Showing  entries
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
                                        <button class="page-link"  v-on:click="paginate(page+1)" :disabled="(page) * 6 >= count!">
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
                    <!-- END: Pagination -->
                    <div v-if="isReloading"
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                                <div class="relative  my-6 mx-auto max-w-10xl">
                                    <!--content-->
                                    <div
                                        class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                                      
                                        <div class="relative p-6 flex-auto">
                                            
                                        
                                            <div class="flex flex-row items-center space-x-4 mx-auto">
                                                 <Icon name="eos-icons:bubble-loading" class="w-20 h-20 text-primary"></Icon>
                                                
                                            </div>
                                        </div>
                                        <!--footer-->
                                      
                                    </div>
                                </div>
                            </div>
                            <div v-if="isReloading" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();


// page skip value for pagination
const page = ref(1);

// get exam count
const {data: count, refresh:fetchCount} = await useAsyncData( ()=> $client.exam.getExamsCount.query());
// console.log(count);
 
// get exams
let {data: exams,refresh:fetchExams } =await useAsyncData(()=> $client.exam.getExams.query({skip:(page.value - 1) * 6},{watch: [page]}));

const isReloading = ref(false);

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


const searchInput = ref('');

const filteredExams = ref(exams);

// filter exam by search input
const filterExams = (name: any) => {
  // filter exams by name if it includes or starts with the search input
  return exams.filter((exam: any) => {
    return exam.name.toLowerCase().includes(name.toLowerCase()) ||
      exam.name.toLowerCase().startsWith(name.toLowerCase());
  });
  
}
// watch search input change
watch(searchInput, (value) => {
 
    filteredExams.value = filterExams(value);
 
})

// exam status text
const examStatus = (status: string) => {
  if (status === 'generated') {
    return 'Generated';
  } else if (status === 'published') {
    return 'Published';
  } else if (status === 'gradeReleased') {
    return 'Grade Released';
  } else {
    return 'UnPublished';
  }
  
}
// testing date  short format
const testingDateformat = (date: string) => {
  return new Date(date).toLocaleDateString();
}


</script>