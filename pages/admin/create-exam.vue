<template>
  <div >
    <AdminTopBar role="admin" />
        <div class="flex">
            <AdminSideBar pageName="exams" />
     
            <div  class="w-full mx-6 ">
              <div class=" rounded-md mt-5 p-5 ">
              <div class="flex flex-row  align-middle mt-10"> 
                <NuxtLink :to="`/admin/exams`">
                <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                </NuxtLink>
                <h2 class="intro-y text-lg font-medium ">Create Exam</h2>
              </div>
            
                   <div class="ml-5">

                  
                   
                    <div class="flex flex-row w-4/6 mt-3">
                      <label for="horizontal-form-1" class="my-auto w-2/6 font-medium">Exam Name</label>
                      <Form class="">
                          <ErrorMessage name="addExam" class=" text-red-500" />
                          <div class="flex flex-row rounded-md border">
                              <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                  <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                              </div>
                                <Field name="addExam" type="text"
                                    class=" form-control py-3 border-none w-full  font-medium text-black-900"
                                  
                                    v-model="examName"
                                    :rules="fieldSchema" />
                                
                                  </div>
                          </Form>
                          <!-- <input id="horizontal-form-1" type="text" class="w-full py-2 px-2" placeholder="Enter Exam Name" v-model="examName" required> -->
                  </div>
                  <div class="flex flex-row w-4/6 mt-3 ">
                      <label for="horizontal-form-1" class="my-auto w-2/6 font-medium">Exam Group</label>
                      <div class="flex flex-row rounded-md border">
                          <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                              <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                          </div>
                          <DropDownSelect :optionslist="examgroups" v-model="selectedExamGroup" style="width: 200px;" title=" Exam Group"  />
                      </div>
                  </div>
                  <div class="flex flex-row w-4/6 mt-3 ">
                      <label for="horizontal-form-1" class="my-auto w-2/6 font-medium">Question Pool</label>
                      <div class="flex flex-row rounded-md border ">
                          <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                              <Icon name="tabler:checkup-list" class="w-4 h-4 my-auto"></Icon>
                          </div>
                          <div class="width-20">

                            <DropDownSelect :optionslist="pools" v-model="selectedPool" title="Choose Pools       "  />
                          </div>
                      </div>
                  </div>
                             
                   
                          <!-- Categories -->
                  <div class="flex flex-row align-middle w-full mt-3">
                          <label for="horizontal-form-1" class="my-auto align-middle w-2/6 font-medium">Categories</label>
                  </div>
                  <div>

                <!-- categories dynamic ui -->
                <div class="flex flex-row w-4/6 mt-3 ">
                        <table class="table">
                      <thead>
                        <tr>
                          <th>Category Name</th>
                          <th>Number of questions</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(selectedCategory, index) in selectedCategories" :key="index">
                          <td>
                            <select v-model="selectedCategory.categoryName" class="select" :selected="selectedCategory.categoryName" required>
                              <option v-for="option in availableOptions" :value="option">{{ option }}</option>
                              <option :value="selectedCategory.categoryName" selected>{{ selectedCategory.categoryName }}</option>
                            </select>
                          </td>
                          <td>
                            <input type="number" v-model="selectedCategory.numberOfQuestionPerCategory" class="input"  required  min="1" :max="setMax(selectedCategory.categoryName)" />
                            <input type="hidden" :value="selectedCategory.selectedId=categoryNameId[selectedCategory.categoryName]" />
                          </td>
                          <td>
                              
                            <button class="btn btn-primary shadow-md"  @click="removeCategory(index)">
                                <Icon name="material-symbols:close" ></Icon>
                            </button>
                          
                          </td>
                          <td>
                            <p v-if="selectedCategory.categoryName && !selectedCategory.isValid" class="error-message">Please enter a value between 1 and {{ setMax(selectedCategory.categoryName) }}</p>

                          </td>
                        </tr>
                      </tbody>
                    </table>
                      </div>
                    <button class="btn btn-primary shadow-md mt-5 " @click="addCategory">Add Category</button>
                 <!-- end categories dynamic ui -->
                  </div>
                 <!-- Tesing Date-->
                               
                <div class="flex flex-row align-middle w-4/6 mt-3">

                    <label for="horizontal-form-1" class=" my-auto align-middle w-2/6 font-medium">Exam Date</label>
                    <Datepicker calendar-class="rounded text-priamry form-control w-full" v-model="testingDate"  />

                  </div>  

                    <!-- Duration -->
                    <div class="flex flex-row w-4/6 mt-3 ">
                      <label for="horizontal-form-1" class="my-auto w-2/6  font-medium">Duration</label>

                      <Form class="">
                      
                        <ErrorMessage name="examDuration" class="text-red-500" />
                          <div class="flex flex-row rounded-md border">
                              <div class="w-10 flex items-center justify-center bg-white rounded-l-md text-gray-400">
                                  <Icon name="fluent-mdl2:page-solid" class="w-4 h-4 my-auto"></Icon>
                              </div>
                                <Field 
                                    class=" form-control py-3 border-none w-full  font-medium text-black-900"
                                  
                                    name="examDuration" 
                                    type="number" 
                                    v-model.number="duration"
                            
                                    
                                    />
                                
                                  </div>
                          </Form>
           
                        </div>

            
                </div>
              </div>
                <div class="flex justify-center">
  
                  <button v-if="!isLoading" class="btn btn-primary shadow-md mt-5 w-100 px-5 py-3" type="submit" @click="createExam">Create Exam </button>
                  <button v-if="isLoading" class="btn btn-primary shadow-md mt-5 w-100" >
                    <i  class="fa fa-spinner fa-spin"></i>
                </button>

              </div>

             
              <Modal type="success" :show="isExamCreated"  message="Exam successfully created!"/>
              <Modal type="error" :show="!isExamCreated && returnedErrorMessage.length > 0" :toggle="toggleErrorModal" :message="returnedErrorMessage"/>
              <!--alert for error message  -->
            
                </div>
       
              </div>
        </div>

 
</template>

<script setup lang="ts">

import AdminTopBar from '~~/components/TopBar.vue'
import AdminSideBar from '~~/components/admin/AdminSideBar.vue';
import DropDownSelect from '~~/components/DropDownSelect.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as zod from 'zod';
import { toFieldValidator } from '@vee-validate/zod';
import { ref, computed, watch } from 'vue';
import Modal from '@/components/Modal.vue'


definePageMeta({ middleware: 'is-admin' })

const { $client } = useNuxtApp();

const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required'));
const numberfieldSchema = toFieldValidator(zod.number().min(0));

const selectedPool = ref('');

const selectedExamGroup = ref('');

const isLoading = ref(false);


const examName = ref('');

// total of all selected questions from each category
const totalNumberOfQuestions = ref(0);

// testing date of exam
const testingDate = ref('');

// duration of exam
const duration = ref(0);

// is exam created successfully
const isExamCreated = ref(false);

// error message
const returnedErrorMessage = ref('');


// modal
const toggleErrorModal = () => {
    // set errorMessage length to 0
    returnedErrorMessage.value = "";
}

 
// 
// fetch exam groups from db
const examgroups = await $client.examGroup.getExamGroups.query({skip:0});

// fetch all pools from db
const pools = await $client.pool.getPoolsWithCategories.query({});

// filter pools based on selected exam group
interface CategoryInterface {
  selectedId: string;
  categoryName: string;
  numberOfQuestionPerCategory: number;
  isValid: boolean;
}
// make available options from pools categories

const selectedCategories = ref<CategoryInterface[]>([
  { selectedId:'', categoryName: '', numberOfQuestionPerCategory: 1, isValid: false },
]);

// to store categories name as a key  and id as a value
const categoryNameId = {} as any;

//  categories and number of approved questions - categories name as a key  and number of approved questions as a value
const categoriesAndNumberOfQuestions = {} as any;

// filtere categories based on selected pool
const categoriesFilter = (poolId: string) => {
    try {

        const poolsCategory = pools.filter((pool: { id: string; }) => {
            return (pool.id === poolId );
        });

        const categories = poolsCategory[0].Category.map((category: {[q: string]: any; name: any; 
          }) => {
            categoryNameId[category.name] = category.id;
          
            categoriesAndNumberOfQuestions[category.name] = category.questions.length;
            
            return category.name;
        });

        return categories;
        
    } catch (error) {
        return []
    }

};

// all available options for categories that are not selected yet
const availableOptions = computed(() => {
  
  const selectedValues = selectedCategories.value.map(selectedCategory => selectedCategory.categoryName);
  
  return categoriesFilter(selectedPool.value).filter((option: string) => !selectedValues.includes(option) && categoriesAndNumberOfQuestions[option] > 0);
});


// while choosing categories to choose half of maximum number of questions in a pool

const setMax = (categoryName: string | number) => {
  // number of questions in a category
  const number = categoriesAndNumberOfQuestions[categoryName];

  return Math.ceil(number/2);
};

// check input field value 
const checkInputValid = (selectedCategory: { selectedId: string; categoryName: string; numberOfQuestionPerCategory: number; isValid:boolean; }) => {
  // number of questions in a category
  const number = categoriesAndNumberOfQuestions[selectedCategory.categoryName];

  const maxnum = Math.ceil(number / 2);
  
  selectedCategory.isValid = selectedCategory.numberOfQuestionPerCategory > 0 && selectedCategory.numberOfQuestionPerCategory <= maxnum;
 
};

// check whenever number of questions input value is changed
watch(selectedCategories.value, (newVal, oldVal) => {

  newVal.forEach(selectedCategory => {
    checkInputValid(selectedCategory);
  });

}, { deep: true });

// push to categories array
const addCategory = () => {

  const availableCategory = availableOptions.value;

  selectedCategories.value.push(
    {selectedId: categoryNameId[availableCategory[0]] || '', categoryName: availableCategory[0] || '', numberOfQuestionPerCategory: 0 , isValid:false});
  
  };

// remove from categories array
const removeCategory = (index: number) => {
  // remove from selected categories based on index
  const removedOption = selectedCategories.value[index].categoryName;

  selectedCategories.value.splice(index, 1);

  // add removed selected Category back to available options
  availableOptions.value.push(removedOption);
};

// create exam
const createExam = async () => {

    isLoading.value = true;

    selectedCategories.value.map((selectedCategory:{ selectedId:any, categoryName: any; numberOfQuestionPerCategory: any; }) => {

      totalNumberOfQuestions.value += selectedCategory.numberOfQuestionPerCategory;
      
    });

    const exam = {
        name: examName.value,
        examGroupId: selectedExamGroup.value,
        poolId: selectedPool.value,
        numberOfQuestions : totalNumberOfQuestions.value,
        testingDate: testingDate.value,
        duration: duration.value,
        categories: selectedCategories.value
    };
  
    try {
        const createdExam = await $client.exam.createExam.mutate(exam);
      
        if (createdExam) {


            isExamCreated.value = true;

            isLoading.value = false;

            return navigateTo("/admin/exams", { external: true })
          }
    } 
    catch (error : any ) {

      isLoading.value = false;
      returnedErrorMessage.value =  error.message;
     

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

.error-message {
    color: red;
    
}

.select {
  width: 200px;
}

.input {
  width: 100%;
}
</style>
