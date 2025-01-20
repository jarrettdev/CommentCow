<template>
  <div class="relative w-full bg-white rounded-lg shadow-sm p-4">
    <h2 class="text-lg font-semibold mb-4">State Selector</h2>
    <select
      v-model="selectedState"
      @change="handleStateChange"
      class="w-full p-2 border rounded-md"
      :disabled="!stateList.length"
    >
      <option value="">Select a state</option>
      <option v-for="state in stateList" :key="state" :value="state">
        {{ state }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEngagementStore } from '~/stores/engagement'

const store = useEngagementStore()
const selectedState = ref<string>('')
const stateList = computed(() => {
  if (store.stateData) {
    return Object.keys(store.stateData).sort()
  }
  return []
})

function handleStateChange() {
  if (selectedState.value) {
    store.setSelectedState(selectedState.value)
  }
}
</script>
