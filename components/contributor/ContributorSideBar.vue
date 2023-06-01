<template>
    <div>

<aside class="w-48 h-[80vh]" aria-label="Sidebar">
    <div class="px-3 py-4 overflow-y-auto rounded h-full bg-gray-50">
        <ul class="space-y-2">
            <li>
                <NuxtLink :to="`/contributor/${contrId}/questions`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="ri:pie-chart-2-fill" class="h-6 w-6" :class="{ 'text-primary': pageName === 'questions' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary': pageName === 'questions' }">Questions</span>
            </NuxtLink>
            </li>
          
            <li>
                <NuxtLink :to="`/contributor/${contrId}/reviews`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="tabler:checkup-list" class="h-6 w-6" :class="{ 'text-primary': pageName === 'reviews' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary': pageName === 'reviews' }">Reviews</span>
         </NuxtLink>

            </li>
          
        
        </ul>
    </div>
</aside>
</div>
</template>
<script>
export default {
    props: {
        pageName: String,
        contrId : String
    },
    components: {},
    name: 'ContributorSideBar',
    data: ()=> {
        return {
        }

    },

}
</script>