<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-bold mb-4">State Engagement Data</h2>
    <div v-if="selectedState">
      <h3 class="text-lg font-semibold mb-2">{{ selectedState }}</h3>
      <div v-if="stateData" class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-semibold">Keywords</h4>
          <ul>
            <li v-for="(category, categoryName) in stateData.keywords" :key="categoryName">
              {{ categoryName }}:
              <ul class="ml-4">
                <li v-for="(data, keyword) in category" :key="keyword">
                  {{ keyword }}: {{ data.total_mentions }} mentions
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold">Sentiment</h4>
          <p>Ratio: {{ stateData.sentiment.sentiment_ratio }}</p>
          <p>Positive: {{ stateData.sentiment.positive_count }}</p>
          <p>Negative: {{ stateData.sentiment.negative_count }}</p>
          <p>Total Comments: {{ stateData.sentiment.total_comments }}</p>
        </div>
        <div>
          <h4 class="font-semibold">Engagement</h4>
          <p>Avg Likes per Comment: {{ stateData.engagement.avg_likes_per_comment }}</p>
          <p>Max Likes: {{ stateData.engagement.max_likes }}</p>
          <p>Total Likes: {{ stateData.engagement.total_likes }}</p>
          <p>Comment Count: {{ stateData.engagement.comment_count }}</p>
        </div>
        <div>
          <h4 class="font-semibold">Top Comments</h4>
          <ul>
            <li v-for="comment in stateData.top_comments.slice(0, 3)" :key="comment.comment_id">
              {{ comment[0] }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="stateVideos && stateVideos.length > 0" class="mt-4">
        <h4 class="font-semibold mb-2">Videos in {{ selectedState }}</h4>
        <ul>
          <li v-for="video in stateVideos" :key="video.video_id" class="mb-2">
            <button @click="selectVideo(video)" class="text-blue-600 hover:underline">
              {{ video.video_title }}
            </button>
          </li>
        </ul>
      </div>
      <div v-if="selectedVideo" class="mt-4">
        <h4 class="font-semibold mb-2">Selected Video</h4>
        <p>Video Title: {{ selectedVideo.video_title }}</p>
        <p>Views: {{ selectedVideo.views }}</p>
        <p>
          <a :href="selectedVideo.video_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
            Watch on YouTube
          </a>
        </p>
        <div v-if="videoComments.length > 0">
          <h5 class="font-semibold mt-2">Top Comments:</h5>
          <ul>
            <li v-for="comment in videoComments" :key="comment.comment_id" class="mb-2">
              <p>{{ comment[0] }}</p>
              <p class="text-sm text-gray-600">Likes: {{ comment.like_count }}</p>
            </li>
          </ul>
        </div>
      </div>
      <p v-else>Select a video to view engagement data</p>
    </div>
    <p v-else>Please select a state to view engagement data.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEngagementStore } from '~/stores/engagement'

const store = useEngagementStore()

const selectedState = computed(() => store.selectedState)
const stateData = computed(() => selectedState.value ? store.getStateData(selectedState.value) : null)
const stateVideos = ref([])

watch(selectedState, async (newState) => {
  selectedVideo.value = null
  videoComments.value = []
  
  if (newState) {
    const videos = await store.getStateVideos(newState)
    console.log('State videos:', videos)
    stateVideos.value = videos
  } else {
    stateVideos.value = []
  }
})

const selectedVideo = ref(null)
const videoComments = ref([])

function selectVideo(video) {
  selectedVideo.value = video
  videoComments.value = store.getVideoComments(video.video_id)
}
</script>

<style scoped>
.state-map {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
