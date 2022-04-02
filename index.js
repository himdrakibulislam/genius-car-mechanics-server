const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.znysc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(cors())
app.use(express.json())
async function run() {
    try {
      await client.connect();
      const database = client.db("GeniusCarMechanic");
      const serviceCollection = database.collection("services");
    //   GET API 
    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find ({})
        const services = await cursor.toArray()
        res.send(services)
    })
    // GET single service
    app.get('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        res.send(result);
    })
    //   POST API
      app.post('/services', async(req,res)=>{
          const service = req.body;
          const result = await serviceCollection.insertOne(service)
          res.json(result)
      })
    //   DELETE API
    app.delete('/services/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const result =  await serviceCollection.deleteOne(query)
        res.json(result)
    })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('express started successfully')
})
app.listen(port,()=>{
    console.log('Running Port',port)
})