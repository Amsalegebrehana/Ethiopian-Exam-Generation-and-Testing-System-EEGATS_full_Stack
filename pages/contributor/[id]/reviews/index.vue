<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })
const route = useRoute ();
const contrId = route.params.id as string;
</script>
<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div class="flex">

            <ContributorSideBar pageName="questions" :contrId="contrId"/>
          <h1>Reviews </h1>
        </div>
  </div>
</template>

