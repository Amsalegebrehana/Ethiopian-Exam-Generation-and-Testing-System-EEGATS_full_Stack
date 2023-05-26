<script setup lang="ts">

definePageMeta({ middleware: 'is-contributor' })
const { $client } = useNuxtApp()
const route = useRoute();
const contrId = route.params.id as string;
const searchText = ref('');
const searchPage = ref(1);
const page = ref(1);


const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.review.getReviewsCount.query({ reviewerId: contrId }));
const { data: reviews, refresh: fetchReviews, pending } = await useAsyncData(() => $client.review.getReviews.query({ reviewerId: contrId, skip: (page.value - 1) * 6 }), { watch: [page, searchText] });

const { data: searchCount, refresh: fetchSearchCount } = await useAsyncData(() => $client.review.getReviewsCount.query({ reviewerId: contrId, search: searchText.value !== '' ? searchText.value : undefined }), { watch: [searchPage, searchText] });
const { data: searchReviews, refresh: fetchSearchReviews, pending: pendingSearch } = await useAsyncData(() => $client.review.getReviews.query({ reviewerId: contrId, search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6 }),
  { watch: [page, searchText] });

const paginate = async (newPage: number) => {
  page.value = newPage;
  isReloading.value = true;
  try {
    await fetchReviews();
    await fetchCount();
  } finally {
    isReloading.value = false
  }
}

const paginateSearch = async (newPage: number) => {
  searchPage.value = newPage;
  isReloading.value = true;
  try {
    await fetchSearchReviews();
    await fetchSearchCount();
  } finally {
    isReloading.value = false
  }
}

const isReloading = ref(false);

const resetSearch = () => {
  if (searchText.value === "") {
    searchPage.value = 1;
    page.value = 1;
  }
}

</script>



<template>
  <div>
    <TopBar role="contributor" :id="contrId" />
    <div class="flex">

      <ContributorSideBar pageName="reviews" :contrId="contrId" />
      <div class="w-full mx-6">

        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2 ">
            <h2 class="intro-y text-lg font-medium mt-6">Questions to review</h2>
            <div class=" ml-auto mt-7 sm:mt-0 ">
              <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." v-model="searchText" @change="resetSearch"/>
                <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>

              </div>
            </div>
          </div>
          <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <div v-if="searchText != ''">
              <div v-if="searchReviews?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                <p>No questions to review found</p>
              </div>
              <div v-if="searchReviews?.length !== 0">

                <table class="table table-report -mt-2">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap"></th>
                      <th class="whitespace-nowrap">REVIEWS</th>
                      <th class="text-center whitespace-nowrap">STATUS</th>
                    </tr>
                  </thead>



                  <tbody>
                    <tr v-for="review in searchReviews" :key="review.id" class="intro-x">
                      <td class="w-10">
                        <NuxtLink :class="{ disabled: true }" :to="`/contributor/${contrId}/reviews/${review.id}`">
                          <button :disabled="review.isReviewed">
                            <Icon name="uiw:question-circle-o" class="w-6 h-6"></Icon>
                          </button>
                        </NuxtLink>
                      </td>
                      <td>
                        <NuxtLink :to="`/contributor/${contrId}/reviews/${review.id}`"
                          class="font-medium whitespace-nowrap">
                          <button :disabled="review.isReviewed">
                            <div v-html="review.questions.title
                              "></div>
                          </button>
                        </NuxtLink>

                      </td>

                      <td class="table-report__action w-100">
                        <div class="flex justify-center items-center" :class="{
                          'text-success': review.isReviewed,
                        }">
                          <a class="flex items-center mr-6" href="javascript:;">
                            <Icon name="eva:checkmark-square-outline" class="w-4 h-4 mr-1"></Icon>
                            {{
                              review.isReviewed ? "Reviewed" : "Pending"
                            }}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="flex flex-row mt-3">
                  <div class="md:block  text-slate-500">
                  </div>
                  <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <nav class="w-full sm:w-auto sm:mr-auto">
                      <ul class="pagination">

                        <li class="page-item">
                          <button class="page-link" v-on:click="paginateSearch(searchPage - 1)" :disabled="searchPage === 1">
                            <div class="flex flex-row align-middle justify-center items-center  ">
                              <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                              </Icon>
                              <span class="">Previous</span>
                            </div>
                          </button>
                        </li>
                        <li class="page-item">
                          <button class="page-link" v-on:click="paginateSearch(searchPage + 1)" :disabled="(searchPage) * 6 >= searchCount!">
                            <div class="flex flex-row align-middle justify-center items-center">
                              <span>Next</span>
                              <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle">
                              </Icon>
                            </div>
                          </button>
                        </li>


                      </ul>
                    </nav>

                  </div>
                </div>


              </div>



          </div>
          <div v-else>
             
              <div v-if="reviews?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                <p>No questions to review found</p>
              </div>
              <div v-if="reviews?.length !== 0">

                <table class="table table-report -mt-2">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap"></th>
                      <th class="whitespace-nowrap">REVIEWS</th>
                      <th class="text-center whitespace-nowrap">STATUS</th>
                    </tr>
                  </thead>



                  <tbody>
                    <tr v-for="review in reviews" :key="review.id" class="intro-x">
                      <td class="w-10">
                        <NuxtLink :class="{ disabled: true }" :to="`/contributor/${contrId}/reviews/${review.id}`">
                          <button :disabled="review.isReviewed">
                            <Icon name="uiw:question-circle-o" class="w-6 h-6"></Icon>
                          </button>
                        </NuxtLink>
                      </td>
                      <td>
                        <NuxtLink :to="`/contributor/${contrId}/reviews/${review.id}`"
                          class="font-medium whitespace-nowrap">
                          <button :disabled="review.isReviewed">
                            <div v-html="review.questions.title
                              "></div>
                          </button>
                        </NuxtLink>

                      </td>

                      <td class="table-report__action w-100">
                        <div class="flex justify-center items-center" :class="{
                          'text-success': review.isReviewed,
                        }">
                          <a class="flex items-center mr-6" href="javascript:;">
                            <Icon name="eva:checkmark-square-outline" class="w-4 h-4 mr-1"></Icon>
                            {{
                              review.isReviewed ? "Reviewed" : "Pending"
                            }}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="flex flex-row mt-3">
                  <div class="md:block  text-slate-500">
                  </div>
                  <div class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <nav class="w-full sm:w-auto sm:mr-auto">
                      <ul class="pagination">

                        <li class="page-item">
                          <button class="page-link" v-on:click="paginate(page - 1)" :disabled="page === 1">
                            <div class="flex flex-row align-middle justify-center items-center  ">
                              <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle">
                              </Icon>
                              <span class="">Previous</span>
                            </div>
                          </button>
                        </li>
                        <li class="page-item">
                          <button class="page-link" v-on:click="paginate(page + 1)" :disabled="(page) * 6 >= count!">
                            <div class="flex flex-row align-middle justify-center items-center">
                              <span>Next</span>
                              <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle">
                              </Icon>
                            </div>
                          </button>
                        </li>


                      </ul>
                    </nav>

                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

