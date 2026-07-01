var express = require('express');

var { MongoClient } = require('mongodb');
require('dotenv').config();

var mongoserver = new MongoClient(process.env.MONGO_URL);

var bcrypt = require('bcrypt');

var db = mongoserver.db(process.env.DB_NAME);

module.exports={
    
};