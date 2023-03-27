<script setup lang="ts">
definePageMeta({ middleware: 'is-testtaker' })
const route = useRoute ();
const testtakerId = route.params.id as string;
</script>

<template>
    <div>

        <h1>Exam detail page for test taker</h1>
        <h1>ExamId: {{ $route.params.eid }}</h1>
    </div>
</template>
