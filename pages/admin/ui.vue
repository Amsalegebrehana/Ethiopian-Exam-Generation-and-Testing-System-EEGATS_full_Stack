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
                            
                            
                                    <input id="horizontal-form-1" type="text" class="" placeholder="Enter Exam Name" v-model="examName.value">
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
                                <div
                                    class="  w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400 ">
                                    <Icon name="ri:pie-chart-2-fill" class="w-4 h-4 my-auto"></Icon>
                            
                                </div>
                        
                                <DropDownSelect :optionslist="pools" v-model="selectedPool" title="Choose Question Pool"  />
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
                            <select v-model="row.selectValue" class="select" :selected="row.selectValue">
                              <option v-for="option in availableOptions" :value="option">{{ option }}</option>
                              <option :value="row.selectValue" selected>{{ row.selectValue }}</option>
                            </select>
                          </td>
                          <td>
                            <input type="number" v-model="row.inputValue" class="input" />
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
                <button class="btn btn-primary shadow-md mt-5 w-100" @click="createExam">Create</button>
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

const examName = ref('');
const totalNumberOfQuestions = ref(0);

const examgroups = await $client.examGroup.getExamGroups.query({skip:0});

const pools = await $client.pool.getPoolsWithCategories.query({});
console.log(pools);
interface Row {
  selectValue: string;
  inputValue: number;
}
// make available options from pools categories

const rows = ref<Row[]>([
  { selectValue: '', inputValue: 0 },
]);

const categoriesFilter = (poolId: string) => {
    try {

        const poolsCategory = pools.filter((pool: { id: string; }) => {

            return (pool.id === poolId );
        });
        const categories = poolsCategory[0].Category.map((category: { name: any; }) => {
            return category.name;
        });

        return categories;
        
    } catch (error) {
        return []
    }

};

const availableOptions = computed(() => {

  const selectedValues = rows.value.map(row => row.selectValue);
  
  return categoriesFilter(selectedPool.value).filter(option => !selectedValues.includes(option));
});

console.log(availableOptions.value);

const addRow = () => {
  const options = availableOptions.value;
  rows.value.push({ selectValue: options[0] || '', inputValue: 0 });
  console.log("rows",rows.value);
 
};

const removeRow = (index: number) => {
  const removedOption = rows.value[index].selectValue;
  rows.value.splice(index, 1);
  availableOptions.value.push(removedOption);
};

// create exam
const createExam = async () => {
    rows.value.map((row:{ selectValue: any; inputValue: any; }) => {
      totalNumberOfQuestions.val += row.inputValue;
       
    });
    const exam = {
        name: examName.value,
        examGroupId: selectedExamGroup.value,
        poolId: selectedPool.value,
        numberOfQuestions : totalNumberOfQuestions.value,
        categories: rows.value,
        testingDate: new Date(),
        duration: 60,
    }
    console.log(exam);
    const createdExam = await $client.exam.addExam.query(exam);
    console.log(createdExam);
    // if (createdExam) {
    //     alert("Exam created successfully");
    // }
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
