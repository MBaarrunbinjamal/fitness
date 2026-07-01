var express = require('express');
var jwt = require('jsonwebtoken');
var { MongoClient } = require('mongodb');
require('dotenv').config();

var mongoserver = new MongoClient(process.env.MONGO_URL);
var secretkey = process.env.SECRET_KEY;
var bcrypt = require('bcrypt');

var db = mongoserver.db(process.env.DB_NAME);

module.exports ={

};