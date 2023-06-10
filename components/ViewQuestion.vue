<!-- Please remove this file from your project -->
<template>
  <div v-if="isModalVisible"
    class="absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
    <div class="p-3 flex-col bg-white rounded-xl">
      <div class="">
        <button @click="onToggle" class="float-right px-1">
          <Icon name="eva:close-outline" class="w-8 h-8 text-red-600"></Icon>
        </button>
      </div>
      <div
        class="p-5 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[70em] max-w-[70em] flex h-[50vh] opacity-100 gap-4 text-lg">
        <div class="flex-1 overflow-scroll">
          <div v-html="question.question.title" class="py-5" />
          <img v-if="question.question.image" :src=question.question.image style="width: 10em; height: 10em;" />
          <div v-for="choice in question.choices" :key="choice.id" class="ml-5">

            <div class="flex flex-row align-middle my-1 mt-5 ml-5">
              <input id="radio_1" type="radio" name="radio" :value="choice.id" v-model="question.answer.choiceId"
                :disabled="true">
              <label class="pl-2 " for="radio_1">


                <div v-html="choice.title" class="px-2"></div>
                <img v-if="choice.image" :src=choice.image style="width: 10em; height: 10em;" />

              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
defineProps({
  question: {
    type: Object,
    required: true,
  },
});
const isOpen = ref(true);
const isModalVisible = computed(() => isOpen.value);
const onToggle = () => isOpen.value = !isOpen.value;
</script>

  