var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30');
var user = require('../models/user_login.js');

/* GET home page. */

router.get('/', function(req, res, next) {

  res.render('index', { title: 'Login| SaludPrimero S.A'});
});

module.exports = router;
