<template>
    <div>
        <AdminTopBar role="contributor" />
        <div class="flex">

            <ContributorSideBar pageName="questions" />
          <h1>Reviews </h1>
        </div>
  </div>
</template>

<script>
definePageMeta({ middleware: 'is-contributor' })
import AdminTopBar from '~~/components/TopBar.vue'
import ContributorSideBar from '~~/components/contributor/ContributorSideBar.vue';
export default {
    components: { ContributorSideBar, AdminTopBar },
    name: 'Reviews',
    data() {
        return {
        
        }

    },
    methods: {

    }
}
</script>