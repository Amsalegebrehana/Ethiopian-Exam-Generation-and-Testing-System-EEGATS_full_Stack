<template>
    <div class="items-center justify-center w-screen h-screen bg-white">
        <NuxtLink :to="`/`">
            <div class="flex flex-row">

                <img src="../../assets/images/eegtslogo.png" class="w-16 m-6" />
                <h1 class="text-2xl my-auto">EEGTS</h1>
            </div>
        </NuxtLink>
        <div class="flex flex-row h-full">
            <div class="w-1/2">
                <img src="../../assets/images/undraw_Online_test_re_kyfx.png" class="m-6 mx-auto " />
            </div>
            <div class="w-1/2 h-full items-center align-middle my-auto ">
                    <form @submit="onSubmit">
                <div class="w-8/12 mt-32 justify-center mx-auto">
            <span class="mt-5 text-red-500">{{ formError }}</span>
                    <div class="intro-x mt-8">
         
                    <span class="mt-5 text-red-500">{{ errors.admissionID }}</span>
                        <div class="input-group my-2  w-96">
                            <div class="input-group-text">
                                <Icon name="material-symbols:alternate-email" class="w-4 h-4"></Icon>
                            </div>
                            <input  type="text" name="email"  class="form-control bg-slate-100" placeholder="Admission ID"  v-model="admissionID">
                        
                        </div>
               
                   <span class="mt-10 text-red-500">{{ errors.password }}</span>
                        <div class="input-group mt-2  w-96" >
                            <div class="input-group-text"><Icon name="material-symbols:alternate-email" class="w-4 h-4"></Icon></div>
                            <input :type="showPassword ? 'text' : 'password'" class="form-control bg-slate-100" placeholder="Password"  v-model="password" :class="{ 'has-error': errors.password != undefined }"   >
                        
                            <div v-on:click="togglePassword()" class="input-group-text">
                                <Icon v-if="showPassword" name="ri:eye-line" class="w-4 h-4 text-slate-500"></Icon>
                            <Icon v-else name="ri:eye-close-line" class="w-4 h-4 text-slate-500"></Icon>
                        </div>
                    
                    </div>
                

                    </div>
                    <!-- <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                    <div></div>
                    <a href="" class="ml-auto">Forgot Password?</a>
                </div> -->
         
                
                        <button class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center mt-8">
                            Sign In
                        </button>
              
                </div>
                </form>

            </div>
        </div>


    </div>
</template>
<script setup>
import { useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';
definePageMeta({ auth: false })
const { $client } = useNuxtApp()

const validationSchema = toFormValidator(
    zod.object({
        admissionID: zod.string().nonempty('This is required'),
        password: zod.string().nonempty('This is required').min(8, { message: 'Minimum of 8 characters required' }),
    })
);
const formError = ref('');
const showPassword = ref(false);
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const { handleSubmit, errors } = useForm({
    validationSchema,
    initialValues: {
        admissionID: '',
        password: '',
    },
},
);
const { value: admissionID } = useField('admissionID');
const { value: password } = useField('password');
const onSubmit = handleSubmit(values => {

    mySignInHandler({ username: values.admissionID, password: values.password, role: 'testtaker' })
});
const { signIn } = useSession()
const mySignInHandler = async ({ username, password, role }) => {
    const {data: tesTakerId} = await useAsyncData( ()=> $client.testtaker.getTestTakerId.query({username}));
    const { error, url } = await signIn('credentials', { username, password, role, redirect: false, callbackUrl: `http://localhost:3000/testtaker/${tesTakerId._rawValue}/exams/` })
    if (error) {
        formError.value = "Incorrect credentials! Please try again";
    } else {
        return navigateTo(url, { external: true })
    }
}

</script>