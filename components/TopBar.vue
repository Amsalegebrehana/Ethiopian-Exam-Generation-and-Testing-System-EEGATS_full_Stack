<script setup lang="ts">

const props = defineProps(['role', 'id']);
const dropdown = ref(true);

const middleware = props.role === 'admin' ? 'is-admin' : props.role === 'contributor' ? 'is-contributor' : 'is-testtaker';

definePageMeta({ middleware: middleware })
const { data, signOut } = useSession()

const delayToggleDropdown = () => {
    
    setTimeout(() => {
        dropdown.value = !dropdown.value;
    }, 220);
    
}

</script>



<template>
    <div class="w-screen">
        <div class="mx-10">
            <div class=" mt-4 bg-blue-100 h-10 rounded-lg shadow-md bg-cover bg-center w-11/12 mx-auto">
                </div>
            <div class="flex flex-row bg-primary mx-auto -mt-8 rounded-xl h-14 items-center space-x-auto"> 
                
                    <NuxtLink :to="role === 'admin' ? `/admin` : role === 'testtaker' ? `/testtaker/${id}/exams` : `/contributor/${id}/questions` "><div class="flex flex-row items-center">
                        <img src="@/assets/images/whitelogo.png" class="w-8 m-6" />
                        <h1 class="text-2xl my-auto text-white">EEGTS</h1>
                    </div>
                </NuxtLink>
                <div class="flex flex-row items-center ml-auto">
                    <div class="relative mr-8">
                        <div>
                            <button type="button" v-on:click="dropdown = !dropdown" v-on:focusout="delayToggleDropdown()"
                                class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span class="sr-only">Open user menu</span>
                                <img class="h-8 w-8 rounded-full" src="@/assets/images/prof.png" alt="">
                            </button>
                        </div>


                        <div :hidden="dropdown"
                            class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                            role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                            <a :href="role === 'admin' ? `/${role}/changePassword` : `/${role}/${id}/changePassword`"
                                class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
                                id="user-menu-item-0">Change Password</a>

                            <button @click="signOut({redirect: true, callbackUrl: '/'})" href="#" class="block px-4 py-2 text-sm text-gray-700"
                                role="menuitem" tabindex="-1" id="user-menu-item-1">Sign out</button>

                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

