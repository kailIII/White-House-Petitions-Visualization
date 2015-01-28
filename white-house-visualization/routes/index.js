var express = require('express');
var router = express.Router();

var request = require("request");

var mongoose = require('mongoose');
var Petition = mongoose.model('Petition');
var Issue = mongoose.model('Issue');
var Signature = mongoose.model('Signature');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/petitions', function(req, res, next) {
	var q = Petition.find().sort('-signatureCount').limit(20);
	q.exec(function(err, petitions) {
		if(err){ return next(err); }
		res.json(petitions);
	});
});

module.exports = router;