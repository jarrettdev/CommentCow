// components/StateMap.vue
<template>
  <div class="relative w-full bg-gray-900 rounded-lg shadow-lg p-4">
    <h2 class="text-2xl font-bold mb-4 text-black">State Selector</h2>
    <div class="map-container aspect-[16/9] flex justify-center items-center">
      <svg viewBox="-50 0 1100 650" class="w-full h-full">
        <g transform="scale(0.75)">
          <path
            v-for="state in stateData"
            :key="state.id"
            :id="state.id"
            :d="state.path"
            :class="[
              'transition-colors duration-200',
              selectedState === state.name ? 'fill-yellow-500' : getStateStyle(state.id),
            ]"
            @click="handleStateClick(state.id, state.name)"
            @mouseenter="handleStateHover(state.name)"
            @mouseleave="handleStateLeave()"
            @touchstart="handleTouchStart(state.id, state.name, $event)"
          />
        </g>
      </svg>

      <div 
        v-if="hoveredState && !isTouchDevice"
        class="absolute bg-gray-800 text-white shadow-lg rounded-lg p-3 z-10 w-48 text-sm"
        :style="tooltipStyle"
      >
        <h3 class="font-bold">{{ hoveredState }}</h3>
        <p>Click to view stats</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import usa from '@svg-maps/usa'
import { useEngagementStore } from '~/stores/engagement'

const store = useEngagementStore()

const stateData = usa.locations

const selectedState = computed(() => store.selectedState)
const hoveredState = ref<string | null>(null)
const mousePosition = ref({ x: 0, y: 0 })

const tooltipStyle = computed(() => ({
  left: `${mousePosition.value.x + 10}px`,
  top: `${mousePosition.value.y + 10}px`
}))

const isTouchDevice = ref(false)

function handleStateClick(stateId: string, stateName: string) {
  if (selectedState.value === stateName) {
    store.setSelectedState(null)
  } else {
    store.setSelectedState(stateName)
  }
}

function handleStateHover(stateName: string) {
  if (!isTouchDevice.value) {
    hoveredState.value = stateName
  }
}

function handleStateLeave() {
  if (!isTouchDevice.value) {
    hoveredState.value = null
  }
}

function handleTouchStart(stateId: string, stateName: string, event: TouchEvent) {
  event.preventDefault()
  isTouchDevice.value = true
  handleStateClick(stateId, stateName)
}

function handleTouchEnd() {
  isTouchDevice.value = false
}

function updateMousePosition(event: MouseEvent) {
  mousePosition.value = { x: event.clientX, y: event.clientY }
}

onMounted(() => {
  document.addEventListener('mousemove', updateMousePosition)
  console.log('Map Data:', stateData)
  
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateMousePosition)
})

type RegionCategory = 'category1' | 'category1' | 'category1';

const stateCategories: Record<string, RegionCategory> = {
  'AL': 'category1', 'AK': 'category1', 'AZ': 'category1', 'AR': 'category1', 'CA': 'category1', 
  'CO': 'category1', 'CT': 'category1', 'DE': 'category1', 'FL': 'category1', 'GA': 'category1', 
  'HI': 'category1', 'ID': 'category1', 'IL': 'category1', 'IN': 'category1', 'IA': 'category1', 
  'KS': 'category1', 'KY': 'category1', 'LA': 'category1', 'ME': 'category1', 'MD': 'category1', 
  'MA': 'category1', 'MI': 'category1', 'MN': 'category1', 'MS': 'category1', 'MO': 'category1', 
  'MT': 'category1', 'NE': 'category1', 'NV': 'category1', 'NH': 'category1', 'NJ': 'category1', 
  'NM': 'category1', 'NY': 'category1', 'NC': 'category1', 'ND': 'category1', 'OH': 'category1', 
  'OK': 'category1', 'OR': 'category1', 'PA': 'category1', 'RI': 'category1', 'SC': 'category1', 
  'SD': 'category1', 'TN': 'category1', 'TX': 'category1', 'UT': 'category1', 'VT': 'category1', 
  'VA': 'category1', 'WA': 'category1', 'WV': 'category1', 'WI': 'category1', 'WY': 'category1'
};

function getStateStyle(stateId: string): string {
  const upperStateId = stateId.toUpperCase();
  const category = stateCategories[upperStateId as keyof typeof stateCategories];
  
  const styleMap = {
    'category1': 'fill-green-700 hover:fill-green-600',
    'category2': 'fill-zinc-700 hover:fill-zinc-600',
    'category3': 'fill-stone-700 hover:fill-stone-600'
  };
  
  return styleMap[category] || 'fill-gray-700 hover:fill-gray-600';
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 70vh;
}

path {
  cursor: pointer;
  stroke: white;
  stroke-width: 0.5;
}

.fill-red-700 {
  fill: #b91c1c;
}
.fill-red-600 {
  fill: #dc2626;
}
.fill-blue-700 {
  fill: #1d4ed8;
}
.fill-blue-600 {
  fill: #2563eb;
}
.fill-purple-700 {
  fill: #7e22ce;
}
.fill-purple-600 {
  fill: #9333ea;
}
</style>
