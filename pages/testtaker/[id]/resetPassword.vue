        
<script setup lang="ts">

import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { options } from 'vue2-dropzone-vue3';
const { signOut } = useSession();
const { $client } = useNuxtApp();
const route = useRoute();
const id = route.params.id as string;

const userInfo = ref({
    newPassword: '',
    confirmPassword: '',

});

const isLoading = ref(false);
const passwordFieldSchema = toFieldValidator(zod.string().nonempty('Field is required').min(8, 'Minimum of 8 characters required'));
const confirmPasswordSchema = toFieldValidator(zod.string().nonempty('Field is required').min(8, 'Minimum of 8 characters required'));
const formError = ref('');

const showNewPassword = ref(false);
const showconfirmPassword = ref(false);

const toggleNewPassword = () => {
    showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
    showconfirmPassword.value = !showconfirmPassword.value;
};
const handleChange = () => {
    if (userInfo.value.newPassword !== userInfo.value.confirmPassword) {
        formError.value = "Passwords must match";
        return;
    }
    formError.value = '';
    isLoading.value = true;
    resetPassword();

}

const resetPassword = async () => {
    try {
        const data = await $client.passwordHandlerRouter.resetPassword.mutate({ id: id, newPassword: userInfo.value.newPassword });

        if (data) {
            isLoading.value = false;
            await signOut({redirect: true, callbackUrl: '/testtaker/login'});
        }
    } catch (e: any) {
        isLoading.value = false;

        if (e.message === "UNAUTHORIZED ACCESS." || e.message === 'Invalid Link, Unauthorized!') {
            formError.value = "UNAUTHORIZED ACCESS."
        } else {
            formError.value = "Something went wrong, please try again";
        }

    }

}

</script>



<template>
    <div>
        <TopBar role='testtaker' :id="id"/>
        <div class="flex flex-row h-full">
            <div class="h-full items-center align-middle my-auto mx-auto">
                <div class=" mt-28 justify-start mx-auto">
                    <!-- {{ poolId }} -->
                    <span class="mt-5 text-red-500">{{ formError }}</span>
                    <div class="intro-x mt-8">

                        <Form>

                            <div class="py-3 flex flex-row ">
                                <span class=" align-middle font-bold py-3">New Password</span>
                                <div class="input-group">

                                    <Field name="newPassword" :type="showNewPassword ? 'text' : 'password'"
                                        class="intro-x login__input form-control ml-3 py-3 px-4 block" placeholder="New Password"
                                        v-model="userInfo.newPassword" :rules="passwordFieldSchema" />

                                    <div v-on:click="toggleNewPassword()" class="input-group-text">
                                        <Icon v-if="showNewPassword" name="ri:eye-line" class="w-4 h-4 text-slate-500">
                                        </Icon>
                                        <Icon v-else name="ri:eye-close-line" class="w-4 h-4 text-slate-500"></Icon>
                                    </div>
                                </div>
                                <ErrorMessage name="newPassword" class=" text-red-500  ml-2 align-middle py-3" />
                            </div>



                            <div class="py-3 flex flex-row ">
                                <span class=" align-middle font-bold py-3 pr-2">Confirm Password</span>
                                <div class="input-group">

                                    <Field name="confirmPassword" :type="showconfirmPassword ? 'text' : 'password'"
                                        class="intro-x login__input form-control ml-3 px-4 block"
                                        placeholder="Confirm Password" v-model="userInfo.confirmPassword"
                                        :rules="confirmPasswordSchema" />

                                    <div v-on:click="toggleConfirmPassword()" class="input-group-text">
                                        <Icon v-if="showconfirmPassword" name="ri:eye-line" class="w-4 h-4 text-slate-500">
                                        </Icon>
                                        <Icon v-else name="ri:eye-close-line" class="w-4 h-4 text-slate-500"></Icon>
                                    </div>
                                </div>
                                <ErrorMessage name="confirmPassword" class=" text-red-500 ml-2 align-middle py-3" />
                            </div>

                        </Form>

                    </div>

                </div>
                <button @click="handleChange()" class="ml-16 bg-primary rounded-xl w-5/12 mt-8 text-white py-3 px-4 text-center"
                    :disabled="isLoading || userInfo.newPassword === '' || userInfo.confirmPassword === ''">
                    <div v-if="isLoading">
                        <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                    </div>
                    <div v-else>
                        Reset Password
                    </div>
                </button>

            </div>
        </div>

    </div>
</template>
