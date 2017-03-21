var express = require('express');
var router = express.Router();
var User = require ('../models/user');
var db = require('../db.js');


router.get('/', function (req, res, next) {
 
        res.render('index');
  
});


module.exports = router;
