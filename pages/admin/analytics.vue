<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
    ArcElement, 
} from 'chart.js'
import { Bar , Doughnut} from 'vue-chartjs'
definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()
const {data: questionStatusDistribution, error} = await useAsyncData( ()=> $client.analytics.getQuestionStatusDistribution.query());

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

</script>
<template>
    <div class="w-5/12 h-40">
      {{ questionStatusDistribution }}
       Error  : {{ error }}
        <div v-if="questionStatusDistribution">

            <!-- <Doughnut :data="questionStatusDistribution.data" :options="questionStatusDistribution.options" /> -->
        </div>
    </div>
  </template>
  
