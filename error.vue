<template>
    <div class="error-404" id="body">
        <div class="flex flex-col items-center justify-center h-screen">
        <div v-if="error.statusCode === 404 || '404' ">
            <img src="./assets/images/404_exam2.jpg" alt="Error Image" class="w-80" />
            <h2 class="text-lg text-center mb-4">
                Sorry! We couldn't find the page you're looking for.
            </h2> 
        </div>

        <div v-else-if="error.statusCode === 500 || '500' ">
            <img src="./assets/images/500_exam.jpg" alt="Error Image" class="w-80" />
            <!-- <p  class="text-lg text-center mb-4">
            It seems like there's a server error
            </p> -->
        </div>
    
        <a href="/" class="text-blue-500">Go back to the homepage</a>
        </div>
    </div>

</template>

<script setup>
    const props = defineProps({
        error: Object
    });

    const error = useError();
    if (error.value.statusCode === 404 || '404'){
        error.value.message = 'Oops!'
    }
    else if (error.value.statusCode === 500 || '500'){
        error.value.message = 'Uh Oh!'
    }
    const handleError = () => clearError({redirect: '/'})

</script>

<style>
.w-80 {
    width: 50rem;
}
</style>