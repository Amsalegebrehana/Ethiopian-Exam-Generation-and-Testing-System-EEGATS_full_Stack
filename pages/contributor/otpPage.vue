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
                            <!-- <span class="mt-5 text-red-500">{{ errors.otp }}</span> -->
                            <div class="input-group my-2  w-96">
                                <div class="input-group-text">
                                    <Icon name="material-symbols:alternate-email" class="w-4 h-4"></Icon>
                                </div>
                                <input type="text" name="otp" class="form-control bg-slate-100" placeholder="OTP"
                                    v-model="otp" autocomplete="new-password">

                            </div>
                            </div>

                        <button class="bg-primary rounded-xl w-5/12 text-white py-3 px-4 text-center mt-8"
                            :disabled="isLoading">
                            <div v-if="isLoading">
                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                            </div>
                            <div v-else>
                               Submit
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
const { $client } = useNuxtApp();
const contrId = useRoute().query.id as string;

onMounted(() => {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach((input) => {
        input.setAttribute('autocomplete', 'off');
    });
});
const isLoading = ref(false);



const validationSchema = toFormValidator(
    zod.object({
        
        otp: zod.string().nonempty('This is required').min(6, { message: 'Minimum of 6 characters required' }),
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
        otp: '',
        
    },
},
);
const { value: otp } = useField('otp');

const onSubmit = handleSubmit(async (values) => {
 
    mySignInHandler({ contrId:contrId, role: 'contributor', otp: values.otp})
});

const { signIn } = useSession()
const mySignInHandler = async ({ contrId, role, otp }: { contrId: string, role: string , otp:string}) => {
    formError.value = '';
    isLoading.value = true
    try {
    
        const { error, url } = await signIn('credentials', { contrId, role, otp, redirect: false, callbackUrl: `http://localhost:3000/contributor/${contrId}/questions` })
  
        if (error) {
            if (error == 'Multiple failed attempts, you account has been locked, please contact system admin' || error == 'Invalid otp') {
                formError.value = error;
            } else {
                formError.value = 'Something went wrong, please try again';
            }
        } else {
            return navigateTo(url, { external: true })
        }
        

    } catch (error : any) {
       
        if (error.code == 401) {
            formError.value = error.message;
        } else {
            formError.value = 'Something went wrong, please try again';
        }
    }
    isLoading.value = false
}

</script>