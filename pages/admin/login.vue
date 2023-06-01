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
                <img src="../../assets/images/undraw_Onboarding_re_6osc.png" class="h-4/6 mx-auto " />
            </div>
            <div class="h-screen align-middle my-auto py-10">
                <form @submit="onSubmit">
                    <input name="hidden" type="text" class="hidden" />
                    <div class="w-8/12 mt-32 justify-center mx-auto">
                        <span class="mt-5 text-red-500">{{ formError }}</span>

                        <div class="intro-x mt-8">

                            <span class="mt-5 text-red-500">{{ errors.email }}</span>
                            <div class="input-group my-2  w-96">
                                <div class="input-group-text">
                                    <Icon name="material-symbols:alternate-email" class="w-4 h-4"></Icon>
                                </div>
                                <input type="text" name="email" class="form-control bg-slate-100" placeholder="Email"
                                    v-model="email" autocomplete="new-password">

                            </div>

                            <span class="mt-10 text-red-500">{{ errors.password }}</span>
                            <div class="input-group mt-2  w-96">
                                <div class="input-group-text">
                                    <Icon name="material-symbols:alternate-email" class="w-4 h-4"></Icon>
                                </div>
                                <input :type="showPassword ? 'text' : 'password'" class="form-control bg-slate-100"
                                    placeholder="Password" v-model="password"
                                    :class="{ 'has-error': errors.password != undefined }" autocomplete="new-password">

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


                        <button class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center mt-8"
                            :disabled="isLoading">
                            <div v-if="isLoading">
                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                            </div>
                            <div v-else>
                                Sign In
                            </div>
                        </button>

                    </div>
                </form>
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';
definePageMeta({ auth: false })
const { getSession } = useSession();
onMounted(() => {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach((input) => {
        input.setAttribute('autocomplete', 'off');
    });
});
const isLoading = ref(false);
const validationSchema = toFormValidator(
    zod.object({
        email: zod.string().nonempty('This is required').email({ message: 'Must be a valid email' }),
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
        email: '',
        password: '',
    },
},
);
const { value: email } = useField('email');
const { value: password } = useField('password');
const onSubmit = handleSubmit(values => {

    mySignInHandler({ email: values.email, password: values.password, role: 'admin' })
});

const { signIn } = useSession()
const mySignInHandler = async ({ email, password, role }: { email: string, password: string, role: string }) => {
    formError.value = '';
    isLoading.value = true
    try {
        const { error, url } = await signIn('credentials', { email, password, role, redirect: false, callbackUrl: 'http://localhost:3000/admin' })
        if (error) {
            if (error == 'Multiple failed attempts, you account has been locked, please contact system admin' || error == 'Invalid credentials') {
                formError.value = error;
            } else {
                formError.value = 'Something went wrong, please try again';
            }
        } else {
            return navigateTo(url, { external: true })
        }
    } catch (error) {

    }
    isLoading.value = false
}

</script>