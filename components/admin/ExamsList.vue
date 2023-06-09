
<template>

    <div>              <!-- after create exam btn starts here -->
              <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">
                      
                        <div class="hidden md:block mx-auto text-slate-500">
                           
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" v-model="searchText" placeholder="Search..." />
                                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>
            
                            </div>
                        </div>
                    </div>
                     <!-- BEGIN: Data List -->
                     <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                    <div v-if="searchExams?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                                              <p>No Exams found</p>
                                          </div>
                                    
                                        <table v-if="searchExams?.length !== 0" class="table table-report -mt-2">
                                            <thead>
                                                <tr>
                                                    <th class="whitespace-nowrap"></th>
                                                    <th class="whitespace-nowrap">Exams</th>
                                                    <th class="text-center whitespace-nowrap">Number of Questions</th>
                                                    <th class="whitespace-nowrap">Status</th>
                                                    <th class="whitespace-nowrap">Testing Date</th>
                                                    <th class="whitespace-nowrap">Duration(mins)</th>
                                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="exam in searchExams" :key="exam.id" class="intro-x">
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
                                                                    'text-warning': exam.status === 'generated',
                                                                    'text-primary': exam.status === 'published',
                                                                    'text-success': exam.status === 'gradeReleased',
                                                                   
                                                                }">
                                                                    <Icon v-if="exam.status === 'published'" name="ic:baseline-published-with-changes" class="w-4 h-4"></Icon>
                                                                    <Icon v-else-if="exam.status === 'gradeReleased'" name="material-symbols:new-releases" class="w-4 h-4"></Icon>
                                                                    <Icon v-else-if="exam.status === 'generated'" name="ri:ai-generate" class="w-4 h-4"></Icon>
                                                                  
                                                                         
                                                                    {{ examStatus(exam.status) }}
                                                                </div>
                                                            </td>
                                                            <td class="">{{ testingDateformat(exam.testingDate) }}</td>
                                                            <td class="">{{ exam.duration }}</td>
                                                    <td class="table-report__action w-60">
                                                        <div class="flex justify-center items-center">
                                                            <a class="flex items-center mr-6 text-primary" :href="`/admin/exams/${exam.id}`">
                                                                <Icon name="tabler:device-analytics"
                                                                    class="w-4 h-4 mr-1"></Icon> View Details
                                                            </a>
                                                            <button v-if="exam.status == 'gradeReleased'"  class="text-white flex items-center mr-3" disabled >
                                                                <Icon name="material-symbols:edit-outline" class="w-4 h-4"></Icon> Edit
                                                            </button>
                                                            <button v-if="exam.status != 'gradeReleased'"  class="text-success flex items-center mr-3"  @click="editExam(exam)">
                                                                <Icon name="material-symbols:edit-outline" class="w-4 h-4"></Icon> Edit
                                                            </button>
                                                         
                                                            
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
                   
                          </div>
                        <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                            <nav class="w-full sm:w-auto sm:mr-auto">
                                <ul class="pagination">
                                    
                                   
                                    <li class="page-item">
                                            <button class="page-link" v-on:click="paginateSearch(searchPage-1)" :disabled="searchPage===1">
                                                <div class="flex flex-row align-middle justify-center items-center  ">
                                                    <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                    <span class="">Previous</span>
                                                </div>
                                            </button>
                                        </li>
                                        <li class="page-item">  
                                            <button class="page-link" v-on:click="paginateSearch(searchPage+1)" :disabled="(searchPage) * 6 >= searchcount!">
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
                    <EditExamModal :open="openModal" @close="handleModalClose" :exam="examToEdit" @update:exam="handleUpdate"/>
                    
    </div>


</template>

<script setup lang="ts">
import EditExamModal from '~~/components/admin/EditExamModal.vue';

const { $client } = useNuxtApp();

// accept props of exam group id
const props = defineProps ({
    examGroupId: String
})

// skip value for pagination
const skipval = ref(0);
const searchInput = ref('');
const isReloading = ref(false);
const page = ref(1);
const searchPage = ref(1);
const searchText  = ref('');
// OPEN MODAL
const openModal = ref(false);
// exam to be edited
const examToEdit = ref({});
// get exam count

// prev paginate
const {data: count, refresh:fetchCount} = await useAsyncData( ()=> $client.exam.getExamsCount.query());
const {data: exams, refresh:fetchExams, pending} = await useAsyncData(()=> $client.exam.getExams.query({skip : (page.value - 1) * 6}), 
{watch: [page, searchText]});
const {data: searchcount, refresh:fetchSearchCount} = await useAsyncData( ()=> $client.exam.searchExamsCount.query({search: searchText.value !== '' ? searchText.value : undefined, examGroupId: props.examGroupId }), {watch: [searchPage, searchText]});
const {data: searchExams, refresh:fetchSearchExams, pending:pendingSearch} = await useAsyncData(()=> $client.exam.getSearchedExams.query({search: searchText.value !== '' ? searchText.value : undefined, skip : (searchPage.value - 1) * 6, examGroupId: props.examGroupId}), 
    {watch: [page, searchText]});

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

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchExams();
        await fetchSearchCount();
    } finally {
        isReloading.value = false  
    }
}
const editExam = async (exam : Object) => {
    
    openModal.value = true;
    examToEdit.value = exam;

}
// close modal
// Function to handle the modal close event
const handleModalClose = () => {
  openModal.value = false; // Update the 'openModal' ref to close the modal
};
// exam status text
const examStatus = (status: string) => {
 if (status === 'published') {
    return 'Published';
  } else if (status === 'gradeReleased') {
    return 'Grade Released';
  }
  else if (status === 'generated') {
    return 'Generated';
  }
   else {
    return 'UnPublished';
  }
  
}
// testing date  short format
const testingDateformat = (date: string) => {
    
    return new Date(date).toLocaleTimeString() + " " + new Date(date).toLocaleDateString();
}
// update exam
const handleUpdate = async (updatedExam: Object) => {
    // iterate through the searchExams array and update the exam
    await searchExams.value.forEach((exam: Object) => {
        if (exam.id === updatedExam.id) {
            exam.testingDate = updatedExam.testingDate;
            exam.examDuration = updatedExam.examDuration;
            exam.examReleaseDate = updatedExam.examReleaseDate;
        }
    });
}



</script>