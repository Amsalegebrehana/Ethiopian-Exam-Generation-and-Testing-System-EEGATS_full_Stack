<template>  
  <div v-if="!session">
    <SelectRole />
  </div>
</template>

<script setup lang="ts">
import { TRPCError } from '@trpc/server';

definePageMeta({ auth: false })

const {$client} = useNuxtApp()
try{
  await $client.question.deleteQuestion.mutate("09bf8c22-1570-435c-83fd-ebafd9f2f5e5");
} catch(e){
  if (e instanceof TRPCError){
    console.log(e.message);
  } else{
    console.log("Delete operation failed")
  }
}

const { data: session } = useSession();
if (session.value?.role === "admin") {
  navigateTo('/admin/pools');
}
if (session.value?.role === "contributor") {
  navigateTo(`/contributor/${session.value?.uid}/questions`);
}
if (session.value?.role === "testtaker") {
  navigateTo(`/testtaker/${session.value?.uid}//exams`);
}
</script>
