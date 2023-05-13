<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })
const route = useRoute ();
const contrId = route.params.id as string;
</script>
<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div class="flex">

            <ContributorSideBar pageName="reviews" :contrId="contrId"/>
            <div class="w-full mx-6">
            <!-- <h1>{{$route}}</h1> -->
                <h1>ReviewId: {{ $route.params.rid }}</h1>
                <h2>Reviewing Page</h2>
            </div>
           
        </div>
    </div>
</template>

