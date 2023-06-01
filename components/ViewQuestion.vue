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
      <div class="p-3 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[70em] max-w-[70em] flex h-[50vh] opacity-100 gap-4 text-lg">
        <div class="flex-1 overflow-scroll">
          <div v-html="question.question.title" class="py-5" />
          <div v-for="(choice, index) in question.choices" class="flex">
            <span class="py-2"> <b> {{ String.fromCharCode(65 + index) }}. </b> </span>
            <span v-html="choice.title" class="px-2 py-2 w-full" />
          </div>
          <div class="flex py-5">
            <span class="pt-5 pr-2"> <b> Correct answer: </b> </span>
            <span v-html="question.choices.filter(choice => choice.id === question.answer.choiceId)[0].title" class="pt-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    question: Object,
    required: true,
  },
  name: 'EditQuestion',
  components: {},
  data() {
    return {
      isOpen: true,
    }

  },
  computed: {
    isModalVisible() {
      return this.isOpen;
    }
  },
  methods: {
    onToggle() {
      this.isOpen = !this.isOpen;
    },
  },
}
</script>
  