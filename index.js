// Required Variable
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

// Configure Code
const app = express();
dotenv.config();

// Middleware Code
app.use(cors());
app.use(express.json());

// MongdoDB Connect URI
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_USERPASS}@cluster01.rhyj5nw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// Main Part Of A-Accountant ↓↓↓

async function run() {

    try {

        const dbName = client.db('a-accounter');
        const dbServices = dbName.collection('services');
        const dbBanner = dbName.collection('banner');
        const dbReview = dbName.collection('review');

        // send 3 services
        app.get('/',async(req, res) => {
            const query = {};
            const data = await dbServices.find(query).limit(3);
            const cursor = await data.toArray()
            res.send(cursor);
        });

        // send all services
        app.get('/services',async(req, res) => {
            const query = {};
            const data = await dbServices.find(query);
            const cursor = await data.toArray()
            res.send(cursor);
        });

        // send service and this service review by id
        app.get(`/services/:id`,async (req,res)=>{
            const reqId = req.params.id;
            const query = {_id: ObjectId(reqId)};            
            const query2 = {serviceId: reqId};            
            const result = await dbServices.findOne(query);
            const cursor = await dbReview.find(query2);
            const reviewDT = await cursor.toArray();
            res.send({result,reviewDT});
        })

        // send user already feedbacked/reviewed this service
        app.get('/service',async(req, res) => {
            const reqId = req.query.serviceId;
            const query = {_id : ObjectId(reqId)};
            const data = await dbServices.find(query);
            const cursor = await data.toArray()
            res.send(cursor);
        });

        // send user all submited feedback/review data
        app.get(`/my-review`,async(req,res)=>{
            const reqEmail = req.query.email;
            const query = {userEmail: reqEmail};
            const cursor = await dbReview.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // post review data
        app.post(`/review`,async(req,res)=>{
            const reqDT = req.body;
            const result = await dbReview.insertOne(reqDT);
            res.send(result);
        })
        
        // send banner images link
        app.get('/banner',async(req, res) => {
            const query = {};
            const data = await dbBanner.findOne(query);
            res.send(data);
        });

    } catch (e) {
        console.log(e)
    } finally {}
}

run().catch(e => console.log(e));

// API Listen Port Calling
app.listen(port, () => console.log(`this web api running on ${port}`));