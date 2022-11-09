// Required Variable
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId,
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
        const dbBlog = dbName.collection('blog');

        // Generate JWT
        app.post('/jwt',(req,res)=>{
            const reqEmail = req.headers.email;
            const encryptToken = jwt.sign(reqEmail,process.env.JWT_KEY);
            res.send({encryptToken})
        })

        // Verify JWT

        function verifyJWT (req,res,next) {
            const encryptToken = req.headers.encrypttoken;
            if(!encryptToken) return res.status(401).send(`Unauthorized Error`);
            jwt.verify(encryptToken,process.env.JWT_KEY,(e,decoded)=>{
                if(e){
                    return res.status(401).send(`Unauthorized Error`);
                }
                req.decrypt = decoded;
                next();
            })
        }

        // root params
        app.get('/',(req,res)=>{
            res.send(`A-Accountant Server Is Running! YAY!`)
        })

        // send 3 base services and if any user menualy added services
        app.get('/home',async(req, res) => {
            const reqHeaders = req.headers.email;
            const query = {};
            const query2 = {email: reqHeaders}
            const cursor = await dbServices.find(query).limit(3);
            const cursor2 = await dbServices.find(query2);
            const data = await cursor.toArray();
            const userAddedDT = await cursor2.toArray();
            res.send({data,userAddedDT});
        });

        // send all services
        app.get('/services',async(req, res) => {
            const query = {};
            const data = await dbServices.find(query);
            const cursor = await data.toArray()
            res.send(cursor);
        });

        // add new services
        app.post('/services',async(req, res) => {
            const reqBody = req.body;
            const data = await dbServices.insertOne(reqBody);
            res.send(data);
        });

        // send service and this service review by id
        app.get(`/services/:id`,async (req,res)=>{
            const reqId = req.params.id;
            const query = {_id: ObjectId(reqId)};            
            const query2 = {serviceId: reqId};    
            const sort = {postedTime : -1};      
            const result = await dbServices.findOne(query);
            const cursor = await dbReview.find(query2).sort(sort);
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
        app.get(`/my-review`,verifyJWT,async(req,res)=>{
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
            console.log(reqDT,)
        })

        // update review data by reviewed ObjectId
        app.patch('/review',async(req,res)=>{
            const reqQuery = req.query.id;
            const reqBody = req.body.feedbackText;
            const filter = {_id: ObjectId(reqQuery)}
            const updateText = {$set: {feedbackText: reqBody}};
            const result = await dbReview.updateOne(filter,updateText);
            res.send(result)
        })

        // delete review data by user email,and service id
        app.delete(`/review`,async(req,res)=>{
            const reqEmail = req.query.userEmail;
            const reqServiceId = req.query.serviceId;
            const query = {serviceId: reqServiceId,userEmail: reqEmail};
            const result = await dbReview.deleteOne(query);
            res.send(result);
        })
        
        // send banner images link
        app.get('/banner',async(req, res) => {
            const query = {};
            const data = await dbBanner.findOne(query);
            res.send(data);
        });

        // send blog questions and answer
        app.get('/blog',async (req,res)=>{
            const query = {};
            const cursor = await dbBlog.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

    } catch (e) {
        console.log(e)
    } finally {}
}

run().catch(e => console.log(e));

// API Listen Port Calling
app.listen(port, () => console.log(`this web api running on ${port}`));