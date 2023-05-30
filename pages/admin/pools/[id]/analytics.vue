<template>
    <h1>analytics</h1>
    <p>{{ $route.params.id }}</p>
    {{ poolAnalytics }}
</template>
<script setup lang="ts">
import AdminTopBar from '@/components/TopBar.vue'
import { Chart, registerables } from 'chart.js';
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
import { Bar, Doughnut } from 'vue-chartjs'
definePageMeta({ middleware: 'is-admin' })
const { $client } = useNuxtApp()
const route = useRoute();
const poolId = route.params.id as string;

const { data: poolAnalytics } = await useAsyncData(() => $client.analytics.getPoolAnalytics.query({ poolId }));


</script>