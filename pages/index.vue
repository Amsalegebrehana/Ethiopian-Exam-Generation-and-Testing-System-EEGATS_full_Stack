<template>  
  <div v-if="!session">
    <SelectRole />
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const {$client} = useNuxtApp()

const question = await $client.question.getQuestion.query("4e8270cb-c2e7-4dda-90fe-eff4de695795")

const { data: session } = useSession();
if (session.value?.role === "admin") {
  navigateTo('/admin/pools');
}
if (session.value?.role === "contributor") {  
  navigateTo(`/contributor/${session.value?.uid}/questions`);
}
if (session.value?.role === "testtaker") {
  navigateTo(`/testtaker/${session.value?.uid}/exams`);
}
</script>
