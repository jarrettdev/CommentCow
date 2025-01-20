import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const client = new MongoClient(process.env.MONGO_URI)

  try {
    await client.connect()
    const db = client.db('yt_comments')
    const collection = db.collection('state_analysis')
    
    const stateData = await collection.find({}).toArray()
    
    const stateDataObject = stateData.reduce((acc, state) => {
      acc[state.state] = state
      delete acc[state.state].state
      return acc
    }, {})

    return stateDataObject
  } catch (error) {
    console.error('Error fetching state data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching state data'
    })
  } finally {
    await client.close()
  }
})
