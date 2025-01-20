<template>
  <div class="relative w-full max-w-[500px] h-[500px] mx-auto my-12 p-4">
    <svg viewBox="0 0 500 500" class="w-full h-full">
      <g ref="wheelRef"></g>
      <path
        d="M490,250 L440,240 L440,260 Z"
        fill="black"
        transform="rotate(0, 250, 250)"
      />
    </svg>
    <div class="text-center mt-8 mb-8">
      <button
        @click="spin"
        :disabled="isSpinning"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded"
      >
        {{ isSpinning ? "Spinning..." : "Spin for a Random State" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useEngagementStore } from '~/stores/engagement'
import { WordSpinner } from '~/components/WordSpinner'
import confetti from 'canvas-confetti'
import { useToast as importedUseToast } from 'vue-toastification'

const useToast = importedUseToast as unknown as () => {
  success: (message: string, options?: object) => void
  error: (message: string, options?: object) => void
}

const store = useEngagementStore()
const toast = useToast()
const wheelRef = ref<SVGGElement | null>(null)
const isSpinning = ref(false)
const wordSpinner = new WordSpinner()

const stateList = ref<string[]>([])

watch(() => store.stateData, (newStateData) => {
  if (newStateData) {
    stateList.value = Object.keys(newStateData)
    wordSpinner.setCombinations(stateList.value)
    createWheel()
  }
}, { immediate: true })

function createWheel() {
  if (!wheelRef.value) return
  const segmentAngle = 360 / stateList.value.length

  wheelRef.value.innerHTML = ''
  stateList.value.forEach((state, i) => {
    const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const startAngle = i * segmentAngle
    const endAngle = (i + 1) * segmentAngle
    const x1 = 250 + 240 * Math.cos((Math.PI * startAngle) / 180)
    const y1 = 250 + 240 * Math.sin((Math.PI * startAngle) / 180)
    const x2 = 250 + 240 * Math.cos((Math.PI * endAngle) / 180)
    const y2 = 250 + 240 * Math.sin((Math.PI * endAngle) / 180)

    segment.setAttribute('d', `M250,250 L${x1},${y1} A240,240 0 0,1 ${x2},${y2} Z`)
    segment.setAttribute('fill', getRandomColor())
    wheelRef.value?.appendChild(segment)

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    const textAngle = startAngle + segmentAngle / 2
    const textX = 250 + 170 * Math.cos((Math.PI * textAngle) / 180)
    const textY = 250 + 170 * Math.sin((Math.PI * textAngle) / 180)
    text.setAttribute('x', textX.toString())
    text.setAttribute('y', textY.toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', 'white')
    text.setAttribute('font-size', '14')
    text.setAttribute('transform', `rotate(${textAngle + 180}, ${textX}, ${textY})`)
    text.textContent = state
    wheelRef.value?.appendChild(text)
  })
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`
}

function spin() {
  if (isSpinning.value || !wheelRef.value) return
  isSpinning.value = true

  const spinPromise = wordSpinner.spin()

  const animate = () => {
    const currentAngle = wordSpinner.getCurrentRotation()

    if (wheelRef.value) {
      wheelRef.value.style.transform = `rotate(${-currentAngle}deg)`
    }

    if (wordSpinner.isSpinning()) {
      requestAnimationFrame(animate)
    } else {
      isSpinning.value = false
    }
  }

  requestAnimationFrame(animate)

  spinPromise.then((selectedState) => {
    const fullStateName = stateList.value.find(state => state.startsWith(selectedState))
    if (fullStateName) {
      store.setSelectedState(fullStateName)
      showConfetti()
      showToast(fullStateName)
    }
  }).catch((error) => {
    console.error(error)
  })
}

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}

function showToast(stateName: string) {
  toast.success(`Selected state: ${stateName}`, {
    timeout: 3000,
    position: 'top-center',
  })
}

onMounted(() => {
  if (wheelRef.value) {
    wheelRef.value.style.transformOrigin = 'center'
  }
})
</script>
