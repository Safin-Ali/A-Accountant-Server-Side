
// Required Variable
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {} = require('mongodb');

// Configure Code
const app = express();
dotenv.config();

// Middleware Code
app.use(cors());
app.use(express.json());

// Main Part Of A-Accountant ↓↓↓

// get all services

app.get('/',(req,res)=>{
    res.send('yay i am api')
})


// API Listen Port Calling
app.listen(port,() => console.log(`this web api running on ${port}`));