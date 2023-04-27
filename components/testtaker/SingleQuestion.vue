<script setup lang="ts">
import { useQuestionListStore , itemInterface} from '~~/stores/questions';
import { useOnline } from '@vueuse/core'

const online = useOnline()
const props = defineProps(['question', 'modelValue'])
const route = useRoute ();
const { $client } = useNuxtApp();
const testTakerId = route.params.id as string;
const examId = route.params.eid as string;
const { question, modelValue } = toRefs(props)
const questionListStore = useQuestionListStore();
const regiseterResponse = async(choiceId:string, questionId:string) => {
    questionListStore.regiseterResponse(choiceId, questionId);
    await $client.testtaker.registerResponse.mutate({testTakerId, examId, questionId, choiceId});
}
</script>

<template>
  <div class="">
    {{ online }}
    <form>

    <div>
            <div v-html="question.title" class="p-2"></div>
            <img
      v-if="question.titleImage"
      :src=question.titleImage
      style="width: 10em; height: 10em;"
    />
        </div>
        
<div v-for="choice in question.choices" :key="choice.id">

    <div class="flex flex-row align-middle my-1">
        <input  id="radio_1" type="radio" name="radio"  :value="choice.id" v-model="question.selectedAnswer" @change="regiseterResponse(choice.id, question.id)">
              <label class="pl-2 " for="radio_1" >
               
       
                        <div v-html="choice.title" class="px-2"></div>
                        <img
                v-if="choice.image"
                :src=choice.image
                style="width: 10em; height: 10em;"
                />
                    
              </label>
              </div>
</div>
</form>
  </div>
</template>