<!-- Please remove this file from your project -->
<template>
    <div v-if="isModalVisible"
        class="absolute z-[100] inset-0 flex items-center justify-center px-[1em] bg-[#00000076] py-36 max-w-full max-h-screen">
        <div class="py-5 px-3 flex-col bg-white rounded-xl">
            <div
                class="px-3 bg-white rounded-xl sm:min-w-[100%] lg:min-w-[37em] max-w-[37em] flex h-[15vh] opacity-100 gap-4">
                <div class="px-3 flex-col">
                    <Icon name="eva:checkmark-square-outline" class="w-12 h-12 text-green-600"></Icon>
                    <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                        Success! 
                    </DialogTitle>
                    <p v-if="message" class="py-3 text-sm text-gray-500"> 
                        Thank you for submitted a question. Your question is currently being reviewed. You'll hear back if you have to submit more questions. 
                    </p>
                    <p v-else class="py-3 text-lg text-black-500">
                        Your work has been saved as a draft and is now accessible from your "Questions" tab. 
                    </p>
                    <div class="sm:flex sm:flex-row-reverse gap-3">
                        <button @click="onDelete "
                            class="inline-flex text-sm font-semibold justify-center rounded-md px-3 py-2 bg-red-700 hover:bg-red-600 text-white">
                            Delete
                        </button>
                        <button type="button" @click="onToggle"
                            class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    


<script>

export default {
    props: {
        message: Boolean,
        questionId: String,
        required: false,
    },
    name: 'EditQuestion',
    components: {},
    data() {
        return {
            isOpen: true,
            loading: false,
        }

    },
    computed: {
        isModalVisible() {
            return this.isOpen;
        },
        isLoading() {
            return this.loading;
        }
    },
    methods: {
        onToggle() {
            this.isOpen = !this.isOpen;
        },
        onDelete() {
            this.loading = !this.loading;
            this.loading = !this.loading;
            this.onToggle();
        }
    },
}
</script>
    