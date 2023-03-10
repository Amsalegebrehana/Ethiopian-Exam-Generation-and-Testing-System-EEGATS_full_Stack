<template>
    <div>
        <AdminTopBar role="contributor" />
        <div class="flex">

            <ContributorSideBar pageName="questions" />
            <div class="w-full mx-6">
            
                <h1>QuestionId: {{ $route.params.id }}</h1>
                <h2>Question detail page</h2>
            </div>
           
        </div>
    </div>
</template>

<script>
definePageMeta({ middleware: 'is-contributor' })
import AdminTopBar from '~~/components/TopBar.vue'
import ContributorSideBar from '~~/components/contributor/ContributorSideBar.vue';
export default {
    components: { ContributorSideBar, AdminTopBar },
    name: 'QuestionDetail',
    data() {
        return {

        }

    },
    methods: {

    }
}
</script>