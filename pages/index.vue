// pages/index.vue
<template>
  <div class="min-h-screen bg-black-100">
    <header class="sticky top-0 bg-white shadow-sm p-4">
      <h1 class="text-3xl font-bold text-blue-600">CommentCow🐄</h1>
    </header>
    
    <main class="container mx-auto p-6 space-y-6">
      <p class="text-center text-gray-600 text-lg">Click a state to view engagement</p>

      <StateMap class="bg-white rounded-lg shadow-md p-4" />
      <EngagementDashboard class="bg-white rounded-lg shadow-md p-4" />
      <StateSpinner class="bg-white rounded-lg shadow-md p-4" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useEngagementStore } from '~/stores/engagement'
import { onMounted } from 'vue'
import StateMap from '~/components/StateMap.vue'
import EngagementDashboard from '~/components/EngagementDashboard.vue'
import StateSpinner from '~/components/StateSpinner.vue'

const store = useEngagementStore()

onMounted(async () => {
  await store.fetchData()
})
</script>
