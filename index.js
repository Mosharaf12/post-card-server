const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


// meddleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uujg3og.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const postCollections = client.db('postCard').collection('postCollection')

        app.post('/posts', async(req,res)=>{
            const post = req.body;
            const result = await postCollections.insertOne(post)
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err=> console.error(err))



app.get('/', (req, res) => {
  res.send('post card server is running')
})

app.listen(port, () => {
  console.log(`post card server listening on port ${port}`)
})