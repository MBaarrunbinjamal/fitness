var express = require('express');
var routes = express.Router();
var admin = require('../controllers/admin/admin');
var user = require('../controllers/users/user');
var authentication = require('../controllers/authentication/authentication');
//routes

module.exports = routes;