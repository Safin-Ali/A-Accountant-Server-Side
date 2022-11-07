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

        const dbServices = client.db('a-accounter').collection('services');

        // get all services
        app.get('/', (req, res) => {
            res.send('yay i am api');
        });

    } catch (e) {
        console.log(e)
    } finally {}
}

run().catch(e => console.log(e));

// API Listen Port Calling
app.listen(port, () => console.log(`this web api running on ${port}`));