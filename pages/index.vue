<template>
  <div v-if="!session">
    <SelectRole />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const { data: session } = useSession();
if (session.value?.role === "admin") {
  navigateTo('/admin/pools');
}
if (session.value?.role === "contributor") {
  navigateTo('/contributor/questions');
}
if (session.value?.role === "testtaker") {
  navigateTo('/testtaker/exams');
}
</script>
