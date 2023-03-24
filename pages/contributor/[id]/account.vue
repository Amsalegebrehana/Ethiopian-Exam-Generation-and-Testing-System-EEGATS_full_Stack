<template>
    <div>
        <div>I'm protected! Session data: {{ data }}</div>
        <button class="rounded-xl shadow-xl p-2 m-2" @click="signOut()">
            sign out
        </button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'is-contributor' })

const { data, signOut } = useSession()
</script>
