<template>
    <div v-if="show" class="fixed z-[100] inset-0 px-[1em] bg-[#00000076] py-36 h-[100%]">
          <div v-if="show"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-2/6 my-6 mx-auto max-w-10xl">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center">
                    <!--header-->
                    <div class="flex items-end ml-auto justify-between p-5 border-solid border-slate-200 rounded-t">
                        <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                        <button
                            class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" @on-click="toggle">
                            <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                        </button>
                    </div>
                    <div v-if="type=='success'" >

                        <div class="flex flex-row items-center space-x-4 mx-auto h-52 px-10">
                            <Icon name="clarity:success-standard-line" class="w-20 h-20 text-green-600"></Icon>
                            <p class=" font-bold text-2xl text-center mx-10">{{message}}</p>
                        </div>
                    </div>
                    <div v-if="type==='error'">
                        <div class="flex flex-row items-center space-x-4 mx-auto h-52 px-10">
                            <Icon name="ph:warning" class="w-20 h-20 text-red-600"></Icon>
                            <p class=" font-bold text-2xl text-center mx-10">{{message}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      
  </template>
  
  <script setup lang="ts">

const props = defineProps({
        show: Boolean,
        toggle : Function,
        type : String,
        message : String
    });
   

</script>
  