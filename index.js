const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const commentCollections = client.db('postCard').collection('commentsCollection')
        const aboutCollection = client.db('postCard').collection('aboutCollection')

        app.post('/posts', async(req,res)=>{
            const post = req.body;
            const result = await postCollections.insertOne(post)
            res.send(result);
        })
        app.get('/posts', async(req,res)=>{
            const query = {}
            const result = await postCollections.find(query).toArray();
            res.send(result)
        })
        app.get('/posts/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await postCollections.findOne(query)
            res.send(result);
        })
        // commentsections 
        app.post('/comments', async(req,res)=>{
            const comment =req.body;
            const result = await commentCollections.insertOne(comment);
            res.send(result);
        })
        app.get('/comments', async(req,res)=>{
            const query = {};
            const result = await commentCollections.find(query).toArray();
            res.send(result);
        })
        app.post('/about', async(req, res) => {
            const aboutBody = req.body;
            const result = await aboutCollection.insertOne(aboutBody)
            res.send(result)
        })

        app.get('/about/:email', async(req, res) => {
            const email = req.params.email;
            const query = {user_email: email};
            const result = await aboutCollection.findOne(query);
            res.send(result)
            
        })
        app.put('/postlike/:todo', async(req, res) => {
            const todo = req.params.todo;
            
            const id = req.query.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};

            //for find the current like with exact id
            const findPost = await postCollections.findOne(filter);
            const oldLike = parseInt(findPost.countLike)
            //end

              
                const updatedDoc = {
                    $set: {
                        "countLike": oldLike + 1
                    }
                }
                const result = await postCollections.updateOne(filter, updatedDoc, options)
                res.send(result)

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