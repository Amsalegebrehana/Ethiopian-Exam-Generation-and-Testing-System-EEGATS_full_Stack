<script setup lang="ts">

definePageMeta({ middleware: 'is-contributor' })
const route = useRoute();
const { $client } = useNuxtApp()
const contrId = route.params.id as string;
const reviewId = route.params.rid as string;
const { data, refresh: fetchReview } = await useAsyncData(() => $client.review.getQuestionForReview.query({ reviewId }));

const question = data.value?.questions;

const reviewMetrics = ref([
    { "id": 1, "text": "Is this the first time you're seeing this question? ", "select": false },
    { "id": 2, "text": "Is the chosen answer correct? ", "select": false },
    { "id": 3, "text": "Is the question coherent or clear enough? ", "select": false },
    { "id": 4, "text": "Are the choices clear enough? ", "select": false },
    { "id": 5, "text": "Is the question's difficulty suitable? ", "select": false },
    { "id": 6, "text": "Is the question in the category intended? ", "select": false },
    { "id": 7, "text": "Is the question from the intended subject? ", "select": false },
]);
</script>



<template>
    <div>
        <TopBar role="contributor" :id="contrId" />
        <div class="flex">

            <ContributorSideBar pageName="reviews" :contrId="contrId" />
            <div class="w-full mx-6">
                <div class="flex flex-row  align-middle mt-10">
                    <NuxtLink :to="`/contributor/${contrId}/reviews`">
                        <Icon name="mdi:chevron-left" class="h-6 w-6 mr-2 "></Icon>
                    </NuxtLink>
                    <h2 class="intro-y text-lg font-medium ">Question</h2>
                </div>

                <div v-if="question">



                    <div>
                        <h4 class="intro-y text-md font-medium ">Subject: {{ question.pool.name }}</h4>
                        <h4 class="intro-y text-md font-medium ">Question Category: {{ question.category.name }}</h4>
                        <div v-html="question.title" class="p-2"></div>
                        <img v-if="question.image" :src=question.image style="width: 10em; height: 10em;" />
                    </div>

                    <div v-for="choice in question.choices" :key="choice.id">

                        <div class="flex flex-row align-middle my-1">
                            <input id="radio_1" type="radio" name="radio" :value="choice.id"
                                v-model="question.QuestionAnswer[0].choiceId" :disabled="true">
                            <label class="pl-2 " for="radio_1">


                                <div v-html="choice.title" class="px-2"></div>
                                <img v-if="choice.image" :src=choice.image style="width: 10em; height: 10em;" />

                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    {{ reviewMetrics }}
                    <h2 class="intro-y text-lg font-medium ">Review:-</h2>
                    <ol>
                        <li v-for="metric in reviewMetrics">
                            <form>
                                <div class="flex flex-row py-2">
                                    <p class="py-1 pr-4">{{ metric.text }}</p>
                                    <div class=" px-2">

                                        <input id={{metric.id}} type="radio" name="radio" :value="true" v-model="metric.select">
                                        <label class="pl-2 " for={{metric.id}}>
                                            Yes
                                        </label>
                                    </div>
                                    <div class=" px-2">

                                        <input id={{metric.id}} type="radio" name="radio" :value="false"
                                            v-model="metric.select">
                                        <label class="pl-2 " for={{metric.id}}>
                                            No
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </li>
                    </ol>

                </div>

            </div>
        </div>
    </div>
</template>

