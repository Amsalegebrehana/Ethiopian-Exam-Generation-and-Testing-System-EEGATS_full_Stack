<!-- Please remove this file from your project -->
<template>
  <div class="items-center justify-center w-screen h-screen bg-white">
    <div class="flex flex-row">

      <img src="../assets/images/eegtslogo.png" class="w-16 m-6" />
      <h1 class="text-2xl my-auto">EEGTS</h1>
    </div>
        <h1 class="ml-60 mt-10 text-3xl">Please choose your role to continue</h1>
          <div class="flex flex-row w-full max-w-screen-sm mx-auto h-2/6 mt-10 justify-center space-x-12 ">
            <div class="drop-shadow-xl rounded-xl border border-gray-100 items-center justify-center text-center w-full">
              <input class="hidden" id="radio_1" type="radio" name="radio" checked  v-model="accountType" value="admin">
              <label class=" text-gray-400 border border-blue-100 flex flex-col p-4 h-full rounded-xl cursor-pointer items-center" for="radio_1" :class="{ 'bg-blue-100': accountType === 'admin' }">
                <Icon name="mdi:shield-account-variant-outline" class="h-32 w-32 mt-5"  :class="{ 'text-primary': accountType === 'admin' }"></Icon>
                <h1 class="pt-5 text-xl font-medium  justify-center align-middle text-black ">
                  Admin
                </h1>
              </label>
            </div>
          <div class=" drop-shadow-xl rounded-xl border border-gray-100 items-center justify-center text-center w-full"
      >
            <input class="hidden" id="radio_2" type="radio" name="radio" v-model="accountType" value="contributor">
            <label class="text-gray-400 border border-blue-100 flex flex-col p-4 rounded-xl h-full cursor-pointer items-center" for="radio_2" :class="{ 'bg-blue-100': accountType === 'contributor' }">
              <Icon name="akar-icons:people-group" class="h-32 w-32  mt-5" :class="{ 'text-primary': accountType === 'contributor' }"></Icon>
              <h1 class="pt-5 text-xl font-medium justify-center align-middle text-black ">
          
                Contributor
              </h1>
            </label>
          </div>
            <div class=" drop-shadow-xl rounded-xl border border-gray-100 items-center justify-center text-center w-full">
              <input class="hidden" id="radio_3" type="radio" name="radio" v-model="accountType" value="testtaker">
              <label class=" text-gray-400 border border-blue-100 flex flex-col p-4 h-full rounded-xl cursor-pointer items-center"   :class="{ 'bg-blue-100': accountType === 'testtaker' }" for="radio_3">
                <Icon name="iconoir:group" class="h-32 w-32 mt-5"  :class="{ 'text-primary': accountType === 'testtaker' }"></Icon>
                <h1 class="pt-5 text-xl font-medium justify-center align-middle text-black ">
            
                  Test Taker
                </h1>
              </label>
            </div>
          </div>
          <NuxtLink :to=" `${accountType}/login` ">
          <div class="mx-auto bg-primary rounded-xl w-3/12 text-xl text-white py-2 px-2 text-center mt-16">
             Continue
            </div>
          </NuxtLink>
          
  </div>
</template>

<script>

export default {
  name: 'SelectRole',
  components: {},
  data() {
    return{
      accountType: 'admin'
    }

  },

  
}
</script>
