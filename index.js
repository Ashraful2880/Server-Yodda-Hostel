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

        //<------------ Add New Foods Items By Admin ------------->

        app.post('/addFoods',async(req,res)=>{
          const food=req.body.food;              
          const cost=req.body.cost;          
          const pic=req.files.image;
          const picData=pic.data;
          const encodedPic=picData.toString('base64');
          const imageBuffer=Buffer.from(encodedPic,'base64');
  
          const newFood={
            food, cost, image:imageBuffer
          }
          console.log(newFood);
          const result=await foods.insertOne(newFood);
          res.json(result); 
        })

        //<------------ Delete a Food Item API ------------>

        app.delete('/deleteFood/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)}
          const remove=await foods.deleteOne(query);
          res.json(remove)
        });

        //<--------------- Add Students Data to Database ----------------->

        app.post('/addStudent', async(req,res)=>{
          const newStudent=req.body;
          const result=await students.insertOne(newStudent);
          res.json(result);
        }); 

        //<--------------- Save register User info to Database----------------->

        app.post('/users', async(req,res)=>{
          const newUsers=req.body;
          const result=await users.insertOne(newUsers);
          res.json(result);
        });
         //<--------------- Update Google Sign User info to Database----------------->

         app.put('/users', async(req,res)=>{
          const newUser=req.body;
          const filter={email:newUser.email}
          const options={upsert: true};
          const updateUser={$set:newUser}
          const result=await users.updateOne(filter,updateUser,options);
          res.json(result);
        }); 

        //<------------ Get Admin From Database ------------->

        app.get('/user/:email',async(req,res)=>{
          const email=req.params.email;
          const query={email:email};
         const getAdmin=await users.findOne(query);
         let isAdmin=false
         if(getAdmin?.role === 'admin'){
           isAdmin=true;
         }
         res.json({admin:isAdmin})
       }); 

       //<--------------- Set Admin Role API----------------->

       app.put('/users/admin', async(req,res)=>{
        const user=req.body;
        const filter={email:user.email}
        const updateAdmin={$set:{role:'admin'}}
        const result=await users.updateOne(filter,updateAdmin);
        res.json(result);
      }); 

  // Update Approve Status

  /* app.put("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        status: updatedData.status,
      },
    };
    const result = await blogs.updateOne(
      query,
      updateDoc,
      options
    );

    res.json(result);
  });
   */
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