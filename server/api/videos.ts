import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const client = new MongoClient(process.env.MONGO_URI)

  try {
    await client.connect()
    const db = client.db('yt_comments')
    const collection = db.collection('comments_with_video')

    const query = getQuery(event)
    const state = query.state

    const matchFilter: any = { }
    if (state) {
      matchFilter.state = state
    }

    const masterVideos = await collection.aggregate([
      { $match: matchFilter },
      { $group: { 
        _id: "$video_id", 
        video_title: { $first: "$video_title" },
        channel_id: { $first: "$channel_id" },
        views: { $first: "$views" },
        video_url: { $first: "$video_url" },
        timestamp: { $first: "$timestamp" },
        timeScraped: { $first: "$timeScraped" }
      }},
      { $project: { 
        _id: 0, 
        video_id: "$_id", 
        video_title: 1, 
        channel_id: 1,
        views: 1,
        video_url: 1,
        timestamp: 1,
        timeScraped: 1
      }}
    ]).toArray()

    return masterVideos
  } catch (error) {
    console.error('Error fetching master videos:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching master videos'
    })
  } finally {
    await client.close()
  }
})
