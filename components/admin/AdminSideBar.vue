<template>
    <div>

<aside class="w-48 h-screen " aria-label="Sidebar">
    <div class="px-3 py-4 overflow-y-auto rounded h-full bg-gray-50">
        <ul class="space-y-4">
            <li>
                <NuxtLink :to="`/admin/pools`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="ri:pie-chart-2-fill" class="h-6 w-6" :class="{ 'text-primary font-bold': pageName === 'pools' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary font-bold': pageName === 'pools' }">Question Pools</span>
            </NuxtLink>
            </li>
          
            <li>
                <NuxtLink :to="`/admin/examgroups`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="tabler:checkup-list" class="h-6 w-6" :class="{ 'text-primary font-bold': pageName === 'examgroups' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary font-bold': pageName === 'examgroups' }">Exam Groups</span>
         </NuxtLink>

            </li>
            <li>
                <NuxtLink :to="`/admin/exams`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="fluent-mdl2:page-solid" class="h-4 w-6" :class="{ 'text-primary font-bold': pageName === 'exams' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary font-bold': pageName === 'exams' }">Exams</span>
                        </NuxtLink>

            </li>
            <li>
            <NuxtLink :to="`/admin/contributors`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="akar-icons:people-group" class="h-4 w-6" :class="{ 'text-primary font-bold': pageName === 'contributors' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary font-bold': pageName === 'contributors' }">Contributors</span>
                        </NuxtLink>

            </li>
            <li>
            <NuxtLink :to="`/admin/testtakers`"
                    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ">
                    <Icon name="iconoir:group" class="h-4 w-6" :class="{ 'text-primary font-bold': pageName === 'testtakers' }"></Icon>
                    <span class="ml-3" :class="{ 'text-primary font-bold': pageName === 'testtakers' }">Test Takers</span>
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
        pageName: String
    },
    components: {},
    name: 'AdminSidebar',
    data: ()=> {
        return {
        }

    },

}
</script>