<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">

            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6">

                <h1>PoolId: {{ $route.params.id }}</h1>
                <h2>Pool detail page</h2>
            </div>
        </div>
    </div>
</template>

<script >
definePageMeta({ middleware: 'is-admin' })
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
export default {
    components: { AdminSideBar, AdminTopBar },
    name: 'PoolDetail',
    data() {
        return {
        }

    },
}
</script>