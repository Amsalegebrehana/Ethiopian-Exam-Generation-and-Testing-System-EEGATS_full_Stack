<script setup lang="ts">
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { UserInfo } from 'os';
definePageMeta({ auth: false })
const poolId = useRoute().query.poolId;

const { $client } = useNuxtApp();

defineRule('confirmed', (value:any, [target]:any) => {
    if (value === target) {
        return true;
    }
    return 'Passwords must match';
});
const userInfo = ref({
    firstName: '',
    lastName: '',
    email : '',
    password: '',
    confirmPassword : ''
    
});
const isLoading = ref(false);
const nameFieldSchema = toFieldValidator(zod.string().nonempty('Field is required').min(2, 'Minimum of 2 characters required'));
const emailFieldSchema = toFieldValidator(zod.string().nonempty('Field is required').email('Must be a valid email'));
const passwordFieldSchema = toFieldValidator(zod.string().nonempty('Field is required').min(8, 'Minimum of 8 characters required'));
const confirmPasswordSchema =  toFieldValidator(zod.string().nonempty('Field is required').min(8, 'Minimum of 8 characters required'));
const formError = ref('');
const showPassword = ref(false);
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const showconfirmPassword = ref(false);
const toggleConfirmPassword = () => {
    showconfirmPassword.value = !showconfirmPassword.value;
};
const register = () => {
    if(userInfo.value.password !== userInfo.value.confirmPassword){
        formError.value = "Passwords must match";
        return;
    }
    formError.value = '';
    isLoading.value = true;
    createContributor();

}
const createContributor = async () => {
    if(poolId){
        const data=  await $client.contributor.registerContributor.mutate({
            email: userInfo.value.email,
            password: userInfo.value.password,
            name: userInfo.value.firstName + ' ' + userInfo.value.lastName,
            poolId: poolId as string,
        });
        if(data){
            isLoading.value = false;
            navigateTo('/contributor/login');
        }
    }
   
}
</script>
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
                <img src="../../assets/images/undraw_Teacher_re_sico.png" class="m-6 mx-auto h-4/6 w-4/6" />
            </div>
            <div class="w-1/2 h-full items-center align-middle my-auto ">
                <div class=" mt-28 justify-start mx-auto">
{{ poolId }}
      <span class="mt-5 text-red-500">{{ formError }}</span>
                    <div class="intro-x mt-8">
                        <Form>
                            <div class="py-3 flex flex-row ">
                                <span class=" align-middle font-bold py-3 pr-2 w-24">First Name</span>
                                
                                    
                                    <Field name="firstName" type="text" class="intro-x form-control py-3 block w-1/2"  
                                    placeholder="Enter First Name" v-model="userInfo.firstName" :rules="nameFieldSchema" />
                              
                                <ErrorMessage name="firstName" class=" text-red-500 ml-2 align-middle py-3" />
                           </div>

                           <div class="py-3 flex flex-row ">
                               <span class="  align-middle font-bold py-3 pr-2 w-24 ">Last Name</span>
                              
                                   
                                   <Field name="lastName" type="text" class="intro-x form-control py-3 block w-1/2"  
                                   placeholder="Enter Last Name" v-model="userInfo.lastName" :rules="nameFieldSchema" />
                                   <ErrorMessage name="lastName" class=" text-red-500  ml-2 align-middle py-3" />
                                  
                           </div>

                           <div class="py-3 flex flex-row ">
                               <span class="  align-middle font-bold py-3 pr-2 w-24">E-mail</span>
                           
                                   <Field name="email" type="text" class="intro-x form-control py-3 block w-1/2"  
                                   placeholder="Enter e-mail" v-model="userInfo.email" :rules="emailFieldSchema" />
                                   
                            
                                <ErrorMessage name="email" class=" text-red-500  ml-2 align-middle py-3" />
                            </div>

                            <div class="py-3 flex flex-row ">
                                <span class="  align-middle font-bold py-3 pr-2 w-24 ">Password</span>
                                <div class="input-group w-6/12" >
                                    
                                    <Field name="password" :type="showPassword ? 'text' : 'password'" class="intro-x login__input form-control py-3 px-4 block" 
                                    placeholder="Password"  v-model="userInfo.password"     :rules="passwordFieldSchema"/>
                                    
                                    <div v-on:click="togglePassword()" class="input-group-text">
                                        <Icon v-if="showPassword" name="ri:eye-line" class="w-4 h-4 text-slate-500"></Icon>
                                        <Icon v-else name="ri:eye-close-line" class="w-4 h-4 text-slate-500"></Icon>
                                    </div>
                                </div>
                                <ErrorMessage name="password" class=" text-red-500  ml-2 align-middle py-3" />
                                       </div>
                                          
                                       
                                       
                                       <div class="py-3 flex flex-row ">
                                           <span class=" align-middle font-bold py-3 pr-2  ">Confirm Password</span>
                                           <div class="input-group w-6/12" >
                                               
                                               <Field name="confirmPassword" :type="showconfirmPassword ? 'text' : 'password'" class="intro-x login__input form-control py-3 px-4 block" 
                                               placeholder="Confirm Password"  v-model="userInfo.confirmPassword"    :rules="confirmPasswordSchema"/>
                                               
                                               <div v-on:click="toggleConfirmPassword()" class="input-group-text">
                                                <Icon v-if="showconfirmPassword" name="ri:eye-line" class="w-4 h-4 text-slate-500"></Icon>
                                                <Icon v-else name="ri:eye-close-line" class="w-4 h-4 text-slate-500"></Icon>
                                            </div>
                                        </div>
                                        <ErrorMessage name="confirmPassword" class=" text-red-500  ml-2 align-middle py-3" />
                                           </div>
                        
                                        </Form>
                                        
                                    </div>
                                    <!-- <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                                        <div></div>
                                        <a href="" class="ml-auto">Forgot Password?</a>
                                    </div> -->
                                    
                                    
                                    
                                </div>
                               <button @click="register()"
                                            class="bg-primary rounded-xl w-5/12 mt-2 text-white py-3 px-4 text-center" :disabled="isLoading || userInfo.firstName=== '' ||userInfo.lastName === ''||   userInfo.email === '' || userInfo.password === '' || userInfo.confirmPassword === ''">
                                            <div v-if="isLoading ">
                                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                            </div>
                                            <div v-else>
                                                Sign Up
                                            </div>
                                        </button>

            </div>
        </div>


    </div>
</template>
