<!-- Please remove this file from your project -->
<template>
    <div v-if="isModalVisible" class="mx-auto pt-40 absolute z-[100000000] inset-0">
      <div
        class="absolute h-[1400px] fixed bg-black opacity-70 inset-0 z-0"
      ></div>
      <div class="w-full max-w-lg relative mx-auto my-auto">
        <div
          class="fixed h-1/1 w-1/1 rounded-xl"
          data-aos="fade-down"
          data-aos-once="true"
          data-aos-delay="300"
        > 
        <div class="relative">
          <button class="absolute top-0 right-0 m-4 w-8 h-8 bg-white text-red-500 text-xl  font-bold uppercase rounded-full leading-none flex items-center justify-center" @click="onToggle()">X</button>
        </div>
          <div class="bg-[#fff] rounded-xl h-1/1 w-1/1 px-16 py-10 max-sm:px-8">
            <div class="text-black">
              <div class="mb-8 flex flex-col items-center">
                <span class="text-black-600 mt-8 text-xl"> 
                  Which of the following types of waves causes particles in matter to move back and forth along the same direction in which the wave travels?
                </span>
                <input
                    class="rounded-lg border-none bg-white bg-opacity-100 pr-28 py-2 text-start text-black placeholder-slate-300 shadow-lg outline-none backdrop-blur-md"
                    type="text"
                    name="name"
                    placeholder="question.question.title"
                    v-model="question.question.title"
                  />
                
              </div>
              <form action="#">
                <div v-for="(choice, idx) in question.choices" class="mb-4 text-lg mx-auto flex justify-center">
                  <span class="pr-2 py-2">
                      {{ String.fromCharCode(65 + idx) }}. 
                  </span>
                  <input
                    class="rounded-lg border-none bg-white bg-opacity-100 pr-28 py-2 text-start text-black placeholder-slate-300 shadow-lg outline-none backdrop-blur-md"
                    type="text"
                    name="name"
                    placeholder="choice.title"
                    v-model="choice.title"
                  />
                </div>

                <div class="mt-8 flex justify-center text-lg text-black">
                  <button
                    v-if="isProcessing"
                    type="button"
                    class="flex items-center rounded-lg px-16 py-3 text-sm bg-gradient-to-r from-[#457aff] to-[#0c66ee] border border-[#0c66ee] text-white hover:shadow-md hover:shadow-[#0c66ee]/50 transition duration-300"
                    disabled
                  >
                    <svg
                      class="animate-spin mr-3 h-4 w-4 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
                      style="border-right-color: white; border-top-color: white"
                      viewBox="0 0 24 24"
                    ></svg>

                    Processing...
                  </button>
                  <button
                    v-else
                    type="submit"
                    class="rounded-lg px-8 flex py-3 text-sm bg-gradient-to-r from-[#2D52B0] to-[#0c66ee] border border-[#0c66ee] text-white hover:shadow-md hover:shadow-[#0c66ee]/50 transition duration-300"
                  >
              <span class="pl-2">
                    Continue with A2SV
              </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#fff"
                      class="w-5 h-5 inline ml-2"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </form>
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
      return{
        isOpen: true,
        isProcessing: false,
      }
  
    },
    computed: {
      isModalVisible() {
        return this.isOpen;
      },
      incrementIdx() {
        this.idx += 1;
      }
    },
    methods: {
      onToggle() {
        this.isOpen = !this.isOpen;
      },
    },
  }
  </script>
  