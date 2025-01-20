<template>
    <div class="bg-white rounded-lg shadow-md p-4">
      <h2 class="text-xl font-bold mb-4">Video Insights</h2>
      <div v-if="videoData">
        <h3 class="text-lg font-semibold mb-2">{{ videoData.video_title }}</h3>
        <p>Views: {{ videoData.views }}</p>
        <p class="mb-4">
          <a :href="videoData.video_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
            Watch on YouTube
          </a>
        </p>
        <div v-if="videoComments.length > 0" class="mt-4">
          <h4 class="font-semibold mb-2">Top Comments</h4>
          <ul>
            <li v-for="comment in videoComments" :key="comment.comment_id" class="mb-2">
              <p>{{ comment[0] }}</p>
              <p class="text-sm text-gray-600">Likes: {{ comment.like_count }}</p>
            </li>
          </ul>
        </div>
      </div>
      <p v-else>No data available for this video.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useEngagementStore } from '~/stores/engagement'
  
  const route = useRoute()
  const store = useEngagementStore()
  
  const videoId = computed(() => route.params.id as string)
  const videoData = computed(() => store.getVideoData(videoId.value))
  const videoComments = computed(() => store.getVideoComments(videoId.value))
</script>
