// Required Variable
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {
    MongoClient,
    ServerApiVersion
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

        // get all services
        app.get('/',async(req, res) => {
            const query = {};
            const data = await dbServices.find(query).limit(3);
            const cursor = await data.toArray()
            res.send(cursor);
        });
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