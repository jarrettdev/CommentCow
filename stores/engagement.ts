// stores/engagement.ts
import { defineStore } from 'pinia'

export const useEngagementStore = defineStore('engagement', {
  state: () => ({
    selectedState: null as string | null,
    stateData: null,
    videoData: null,
    masterVideos: null
  }),

  actions: {
    async fetchData() {
      try {
        const [stateData, videoData, masterVideos] = await Promise.all([
          $fetch('/api/states'),
          $fetch('/api/video-analysis'),
          $fetch('/api/videos')
        ])
        this.stateData = stateData
        this.videoData = videoData
        this.masterVideos = masterVideos
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },

    setSelectedState(state: string | null) {
      this.selectedState = state
    },

    getStateData(state) {
      return this.stateData[state]
    },

    async getStateVideos(state: string) {
      if (!state) return []
      try {
        const response = await fetch(`/api/videos?state=${encodeURIComponent(state)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch state videos')
        }
        const videos = await response.json()
        console.log('Fetched videos:', videos)

        return videos.filter(video => 
          this.videoData[video.video_id] && 
          this.videoData[video.video_id].top_comments.some(comment => comment.state === state)
        )
      } catch (error) {
        console.error('Error fetching state videos:', error)
        return []
      }
    },

    getVideoData(videoId) {
      return this.masterVideos.find(video => video.video_id === videoId)
    },

    getVideoComments(videoId) {
      return this.videoData[videoId]?.top_comments || []
    }
  }
})
