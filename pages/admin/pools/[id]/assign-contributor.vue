<script setup lang="ts">
const contrId = useRoute().query.contrId;
const { $client } = useNuxtApp();
</script>
<template>
    <h1>assign contributor</h1>
    <p>{{ contrId }}</p>
</template>