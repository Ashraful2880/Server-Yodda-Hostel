const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');
const fileUpload=require('express-fileupload');

app.use(cors());
app.use(express.json());
app.use(fileUpload());


//<------------- Database Code Here ---------->

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();

        //<------------ Database All Collections ------------->

        const database = client.db("Yodda_Hostel");
        const foods = database.collection("food_collections");
        const students = database.collection("students_collection");
        const users = database.collection("userCollections");

        //<------------ Get All Foods ------------->

        app.get('/foods',async(req,res)=>{
          const getBlogs=await foods.find({}).toArray();
          res.send(getBlogs)
        }); 

         //<------------ Get All Students ------------->

        app.get('/students',async(req,res)=>{
          const getPlace=await students.find({}).toArray();
          res.send(getPlace)
        });
        
      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    app.get('/',(req,res)=>{
      res.send('Running Yodda Hostel')
    });


app.listen(port,()=>{
    console.log("Running Server Port is",port);
});