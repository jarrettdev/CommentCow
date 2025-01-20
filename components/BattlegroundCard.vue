<template>
  <div class="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4" :class="borderColor">
    <h3 class="text-lg font-bold text-white mb-2">{{ title }}</h3>
    <div class="text-gray-300">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  priority: string
}>()

const borderColor = computed(() => {
  if (props.priority === 'Critical') return 'border-red-500'
  if (props.priority === 'High') return 'border-orange-500'
  if (props.priority === 'Medium') return 'border-yellow-500'
  return 'border-green-500'
})
</script>
