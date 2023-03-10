<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">
                
                <h1>ExamId: {{ $route.params.id }}</h1>
                  <h2>Exam detail page</h2>
                </div>
            </div>
        </div>
</template>

<script>
definePageMeta({ middleware: 'is-admin' })
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
export default {
    components: { AdminSideBar, AdminTopBar },
    name: 'ExamDeatil',
    data() {
        return {
            }

    },
}
</script>