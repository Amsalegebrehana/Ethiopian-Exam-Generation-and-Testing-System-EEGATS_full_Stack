<template>
    <div>
        <AdminTopBar role="admin"/>
        <div class="flex"> 

            <AdminSideBar pageName="exams"/>
            <div class="w-full mx-6 content middle mt-20 ">
            
            
                <h2 class="intro-y text-lg font-medium mt-10">List of exams</h2>
                <div class="mt-10">
                    <NuxtLink :to="`/admin/create-exam`">
                        <button class="btn btn-primary shadow-md mr-2">Create exam
                            <Icon name="material-symbols:add-box-rounded" class="w-6 h-6 ml-2 text-white"></Icon>
                        </button>
                        </NuxtLink>
                    </div>
                <!-- after create exam btn starts here -->
                    <ExamsList  />
                </div>
            </div>
    </div>
</template>

<script setup lang="ts">


import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import EditExamModal from '~~/components/admin/EditExamModal.vue';

import ExamsList from '~~/components/admin/ExamsList.vue';

definePageMeta({ middleware: 'is-admin' });
const { $client } = useNuxtApp();


</script>

<style scoped>
.middle {
    margin-left: 13vmax;
}
.w-full.overflow-y-auto {
  height: calc(100vh - 4rem - 3.5rem); /* Adjust the height according to your needs */
}
</style>