<template>
    <div>
        <AdminTopBar role="admin" />
        <div class="flex">
            <AdminSideBar pageName="exams" />
            <div class="w-full mx-6 ">

                <div class=" rounded-md mt-5 p-5 w-4/6">
                    <div class="flex flex-row w-4/6 mt-3 ">
                            <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Question Pool</label>
                            <div class="flex flex-row rounded-md border">
                                <div
                                    class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                            
                                </div>
                        
                                <DropDownSelect :optionslist="pools" v-model="selectedPool" title="Choose Question Pool"  @change="handleOnchange"/>
                            </div>
                           
                        </div>
                    
                </div>
                  <!-- categories dynamic ui -->
                  <div v-if="selectedPool !== ''"   v-for="index in numDynamicUI" :key="index"   class="my-5">
                        <div class="grid grid-cols-12 gap-2 mt-2">
                            <div class="flex flex-row rounded-md border form-control col-span-4">
                                <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                    <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                                </div>
                                <DropDownSelect :optionslist="categoriesFilter(selectedPool)"  title="Choose Question Categories" v-model="category"/>
                            </div>
                            <input type="text" class="form-control col-span-4" placeholder="Number of questions" v-model="numberOfQuestions" aria-label="Number of questions">
                            
                            <button class="btn  shadow-md" @click="removeSelctedCtegogry(category)">
                                <Icon name="material-symbols:close" ></Icon>
                            </button>
                        </div>
                        
  
                    </div>
                    <button class="btn btn-primary shadow-md mt-5 " @click="addCategory(category, numberOfQuestions)">Add</button>
                    <button class="btn btn-primary shadow-md mt-5 ml-3" @click="done()">Done</button>
                    

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';

definePageMeta({ middleware: 'is-admin' })

const { $client } = useNuxtApp();
// all vars
const selectedPool = ref('');

const category = ref('');
// (category, number of questions)
const selectedCategories  = {} as any;
const numberOfQuestions = ref(0);
const numDynamicUI = ref(1);

const pools = await $client.pool.getPoolsWithCategories.query({});

const categoriesFilter = (poolId: string) => {
    try {

        const poolsCategory = pools.filter((pool: { id: string; }) => {

            return (pool.id === poolId );
        });

        return poolsCategory[0].Category;
        
    } catch (error) {
        return []
    }

};
console.log(categoriesFilter(selectedPool.value));
const handleOnchange = () =>
{
    for (const key in selectedCategories) {
        if (selectedCategories.hasOwnProperty(key)) {
            delete selectedCategories[key];
        }
    }
    numDynamicUI.value = 1; 
}


const addCategory = (categoryId: string, numberOfQuestions: number) => {
   
    if (selectedCategories && selectedCategories[categoryId] === undefined) {
        
        const category = categoriesFilter(selectedPool.value).filter((category: { id: string; }) => {
            return category.id === categoryId;
        });

        if (categoryId !== ""){

            selectedCategories[categoryId] = [category, numberOfQuestions];
            categoriesFilter(selectedPool.value).splice(categoriesFilter(selectedPool.value).indexOf(category[0]), 1);
        }
    }
    
    category.value = '';
    numberOfQuestions = 0;
    numDynamicUI.value++;

};

const removeSelctedCtegogry = async (categoryId: string ) => {

    numDynamicUI.value--;
    const categoryToBeRemoved = await selectedCategories[categoryId][0];
    
    delete selectedCategories[categoryId];
    categoryId = ''

    categoriesFilter(selectedPool.value).push(categoryToBeRemoved);
   
    
}

const done = () => {
  
    console.log("done");
};

</script>