// Server.js
var express = require('express');
var jwt = require('jsonwebtoken');
var {MongoClient} = require('mongodb');
var cors = require('cors');
require('dotenv').config()
var mongoserver= new MongoClient(process.env.MONGO_URL)
var secretkey=process.env.SECRET_KEY
var app = express();
app.use(express.json());
app.use(cors());
var routes = require('.rRoutes/routes');
app.use('/api', routes);

var Port=process.env.PORT || 5000
 app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
 });