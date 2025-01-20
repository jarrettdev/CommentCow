import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const client = new MongoClient(process.env.MONGO_URI)

  try {
    await client.connect()
    const db = client.db('yt_comments')
    const collection = db.collection('video_analysis')
    
    const videoData = await collection.find({}).toArray()
    
    const videoDataObject = videoData.reduce((acc, video) => {
      acc[video.video_id] = video
      delete acc[video.video_id].video_id
      return acc
    }, {})

    return videoDataObject
  } catch (error) {
    console.error('Error fetching video data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching video data'
    })
  } finally {
    await client.close()
  }
})
