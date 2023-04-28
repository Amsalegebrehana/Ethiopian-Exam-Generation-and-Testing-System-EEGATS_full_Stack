<template>
  <div >
    <AdminTopBar role="admin" />
        <div class="flex">
            <AdminSideBar pageName="exams" />
            <div  class="w-full mx-6 ">
              <div class=" rounded-md mt-5 p-5 w-4/6">
              <div class="flex flex-row  align-middle mt-10"> 
                <NuxtLink :to="`/admin/exams`">
                <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                </NuxtLink>
                <h2 class="intro-y text-lg font-medium ">Create Exam</h2>
              </div>
            
                    <div class="flex flex-row w-4/6 mt-3">
                            <label for="horizontal-form-1" class=" my-auto  w-2/6   font-medium">Exam Name</label>
                            <div class="flex flex-row rounded-md border">
                                <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                            
                                </div>
                            
                            
                                    <input id="horizontal-form-1" type="text" class="" placeholder="Enter Exam Name" v-model="examName" required>
                            </div>
                        </div>
                    </div>
                      <div class="flex flex-row w-4/6 mt-3 ">
                            <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Exam Group</label>
                            <div class="flex flex-row rounded-md border">
                                <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                </div>
                            
                            
                                <DropDownSelect :optionslist="examgroups" v-model="selectedExamGroup" title="Choose Exam Group"  />
                            </div>
                       </div>
                       <div class="flex flex-row w-4/6 mt-3 ">
                        <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Question Pool</label>

                            <div class="flex flex-row rounded-md border">
                                <div class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                                </div>
                            
                            
                                <DropDownSelect :optionslist="pools" v-model="selectedPool" title="Choose Pools"  />
                            </div>
                       </div>
                       <!-- Duration -->
                      <div class="flex flex-row w-4/6 mt-3 ">
                            <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Duration</label>
                            <div class="flex flex-row rounded-md border">
                                <div
                                    class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                            
                                </div>
                        
                                <input type="number" v-model="duration" class="input" />

                        </div>

                        </div>
                          <!-- Categories -->
                        <div class="flex flex-row align-middle w-4/6 mt-3">
                            <label for="horizontal-form-1" class=" my-auto align-middle  w-2/6  font-medium">Categories</label>
                          
                        </div>
                        <div>

                <!-- categories dynamic ui -->
                <div class="flex flex-row w-4/6 mt-3 ">
                        <table class="table">
                      <thead>
                        <tr>
                          <th>Categorie Name</th>
                          <th>Number of questions</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, index) in rows" :key="index">
                          <td>
                            <select v-model="row.categoryName" class="select" :selected="row.categoryName" required>
                              <option v-for="option in availableOptions" :value="option">{{ option }}</option>
                              <option :value="row.categoryName" selected>{{ row.categoryName }}</option>
                            </select>
                          </td>
                          <td>
                            <input type="number" v-model="row.inputValue" class="input" required  min="1" :max="setMax(row.categoryName)" />
                            <input type="hidden" :value="row.selectedId=categoryNameId[row.categoryName]" />
                          </td>
                          <td>
                              
                            <button class="btn btn-primary shadow-md"  @click="removeRow(index)">
                                <Icon name="material-symbols:close" ></Icon>
                            </button>
                          
                          </td>
                        </tr>
                      </tbody>
                    </table>
                      </div>
                    <button class="btn btn-primary shadow-md mt-5 " @click="addRow">Add</button>
                

                <!-- end categories dynamic ui -->

            
                </div>
                  <button v-if="!isLoading" class="btn btn-primary shadow-md mt-5 w-100" @click="createExam">Create Exam </button>
                </div>
        </div>
</div>
 
</template>

<script setup lang="ts">
import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import { ref, computed } from 'vue';

definePageMeta({ middleware: 'is-admin' })

const { $client } = useNuxtApp();

const selectedPool = ref('');

const selectedExamGroup = ref('');

const isLoading = ref(false);

const examName = ref('');

// total of all selected questions from each category
const totalNumberOfQuestions = ref(0);

const duration = ref(0);

// fetch exam groups from db
const examgroups = await $client.examGroup.getExamGroups.query({skip:0});

// fetch all pools from db
const pools = await $client.pool.getPoolsWithCategories.query({});


interface Row {
  selectedId: string;
  categoryName: string;
  inputValue: number;
}
// make available options from pools categories

const rows = ref<Row[]>([
  { selectedId:'', categoryName: '', inputValue: 0 },
]);

// to store categories name as a key  and id as a value
const categoryNameId = {};

//  categories and number of approved questions - categories name as a key  and number of approved questions as a value
const categoriesAndNumberOfQuestions = {};


const categoriesFilter = (poolId: string) => {
    try {
        const poolsCategory = pools.filter((pool: { id: string; }) => {
            return (pool.id === poolId );
        });

        const categories = poolsCategory[0].Category.map((category: { name: any; }) => {
            categoryNameId[category.name] = category.id;
          
            categoriesAndNumberOfQuestions[category.name] = category.questions.length;
            return category.name;
        });

        return categories;
        
    } catch (error) {
        return []
    }

};


// console.log(categoriesAndNumberOfQuestions);


const availableOptions = computed(() => {
  
  const selectedValues = rows.value.map(row => row.categoryName);
  
  // console.log(selectedValues);
  // console.log("categoriesFiltered",categoriesFilter(selectedPool.value));
  
  return categoriesFilter(selectedPool.value).filter(option => !selectedValues.includes(option));
});

// console.log(availableOptions.value);
// while choosing categories to choose half of maximum number of questions in a pool
const setMax = (categoryName) => {

  // number of questions in a category
  const number = categoriesAndNumberOfQuestions[categoryName];
  return Math.floor(number/2);
};

const addRow = () => {

  const options = availableOptions.value;
  rows.value.push({selectedId: categoryNameId[options[0]] || '', categoryName: options[0] || '', inputValue: 0 });
  // console.log("rows",rows.value);
  console.log("categoriesAndNumberOfQuestions",categoriesAndNumberOfQuestions);
};

const removeRow = (index: number) => {

  const removedOption = rows.value[index].categoryName;

  rows.value.splice(index, 1);

  availableOptions.value.push(removedOption);
};

// create exam
const createExam = async () => {

    // isLoading.value = true;

    rows.value.map((row:{ selectedId:any, categoryName: any; inputValue: any; }) => {

      totalNumberOfQuestions.value += row.inputValue;
      
    });

    

    const exam = {
        name: examName.value,
        examGroupId: selectedExamGroup.value,
        poolId: selectedPool.value,
        numberOfQuestions : totalNumberOfQuestions.value,
        testingDate: new Date(),
        duration: duration.value,
        categories:rows.value
    }
    console.log("exam.categories",exam.categories);
    exam.categories.map((category: { selectedId: any; inputValue: any; }) => {
      console.log("category",category.selectedId);
    });

    const createdExam = await $client.exam.createExam.mutate(exam);

    // isLoading.value = false;
    console.log(createdExam);
    if (createdExam) {
        alert("Exam created successfully");
    }
}
</script>

<style scoped>

.container {
  margin-top: 40px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th{
  border-bottom: 1px solid #ddd;
}
th,
td {
  padding: 8px;
  text-align: left;
  /* border-bottom: none; */
}

th {
  font-weight: bold;
}

.button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.select,
.input {
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.select {
  width: 200px;
}

.input {
  width: 100%;
}
</style>
