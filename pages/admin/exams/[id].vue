<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            
            <AdminSideBar pageName="exams" />
            <div class="w-full m-6 ">
                <div class=" rounded-md mt-5 p-5 ">
                    <div class="flex flex-row  align-middle mt-10"> 
                        <NuxtLink :to="`/admin/exams`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                        </NuxtLink>
                        <h2 class="intro-y text-lg font-medium ">Exam Detail</h2>
                    </div>
                </div>
                <div class="flex flex-row justify-end mt-4">
                    <button v-if="publishBtn" class="btn btn-success shadow-md mt-5 mr-4 text-white" @click="publishExam" >Publish</button>
                    <button v-if="unpublishBtn" class="btn btn-success shadow-md mt-5 mr-4 text-white" @click="unPublishExam" >UnPublish</button>
                    
                    <button class="btn btn-primary shadow-md mt-5 mr-4 " @click="releaseGrade">Release Grades</button>
                    
                </div>
                <div class="ml-5 card rounded shadow-md  p-8">

                    <div class="">

                        <h1 class="text-lg pb-10">Exam Name: {{ exam.name}}</h1>
                        <h1 class="text-lg pb-10">Exam Group: {{ exam.examGroup.name}}</h1>
                        <h1 class="text-lg pb-10">Question Pools: {{ exam.pool.name}}</h1>

                        <h2 class="text-lg pb-10">Exam Total Number of questions: {{ exam.numberOfQuestions }}</h2>
                        <h2 class="text-lg pb-10">Duration: {{ exam.duration}} mins </h2>
                        <h2 class="text-lg pb-10">Testing date: {{ exam.testingDate}} </h2>
                        
                    </div>


                </div>
            </div>  
        </div>
    </div>
</template>

<script setup lang="ts">


import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();

const route = useRoute ();
const id = route.params.id as string;

// disable release grade btn if exam is not published
const releaseGradeBtn = ref(false);
// unpublish the published exam if the exam hasn't started yet (change status to generated)

const publishBtn = ref(true);
const unpublishBtn = ref(false);
//  at the time of the test they both are disabled

const exam = await $client.exam.getExam.query({id:id});

const publishExam = async () => {

    const updatedExam = await $client.exam.publishExam.mutate({id:id});
    publishBtn.value = false;
    if (updatedExam && updatedExam.status === 'published' && updatedExam.testingDate > new Date()) {
        unpublishBtn.value = true;
    }
    else {
        unpublishBtn.value = false;
    }
    
    console.log(updatedExam.status);
};

const unPublishExam = async () =>{

    const updatedExam =  await $client.exam.unPublishExam.mutate({id:id});
    unpublishBtn.value = false;

    if (updatedExam.status === 'generated' && updatedExam.testingDate > new Date()) {
        publishBtn.value = true;
    }
    else {
        publishBtn.value = false;
    }
    console.log(updatedExam.status);
};

const releaseGrade = async () =>{

    const updatedExam =  await $client.exam.releaseGrade.mutate({id:id});
    releaseGradeBtn.value = false;
    console.log(updatedExam.status);
};

</script>