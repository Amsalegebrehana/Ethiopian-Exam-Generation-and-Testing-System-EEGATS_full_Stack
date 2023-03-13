<template>
    <div>

        <h1>Exam detail page for test taker</h1>
        <h1>ExamId: {{ $route.params.id }}</h1>
    </div>
</template>
<script >
definePageMeta({ middleware: 'is-testtaker' })
</script>