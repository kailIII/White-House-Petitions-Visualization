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
	var q = Petition.find();

	var sort = req.query.sort;
	if (sort != null) {
		var reverse = req.query.reverse;
		if (reverse != null && reverse == "true") {
			q.sort("-" + sort);
		}
		else {
			q.sort("" + sort);
		}
	}

	var lessThan = req.query.lessThan;
	if (lessThan != null) {
		q.where(""+sort).lt(lessThan);
	}

	var greaterThan = req.query.greaterThan;
	if (greaterThan != null) {
		q.where(""+sort).gt(greaterThan);
	}

	var limit = req.query.limit;
	if (limit != null) {
		q.limit(limit);
	}
	else {
		q.limit(2000);
	}

	var skip = req.query.skip;
	if (skip != null) {
		q.skip(skip);
	}

	q.exec(function(err, petitions) {
		if(err){ return next(err); }
		res.json(petitions);
	});
});

router.param('petition', function(req, res, next, id) {
  var query = Petition.findById(id);
  query.exec(function (err, petition){
    if (err) { return next(err); }
    if (!petition) { return next(new Error("Can't find petition")); }

    req.petition = petition;
    return next();
  });
});


router.get('/petitions/:petition', function(req, res) {
    res.json(req.post);
});


router.get('/petitions/:petition/signatures', function(req, res, next) {
	var query = Signature.where('petitionId').equals(req.petition.petitionId);
	query.exec(function (err, signatures){
    if (err) { return next(err); }
    if (!signatures) { return next(new Error("Can't find signatures")); }
		res.json(signatures);
  	});
});

router.get('/signatures', function(req, res, next) {
	var q = Signature.find();
	q.exec(function(err, signatures) {
		if(err){ return next(err); }
		res.json(signatures);
	});
});

router.param('signature', function(req, res, next, id) {
  var query = Signature.findById(id);

  query.exec(function (err, signature){
    if (err) { return next(err); }
    if (!signature) { return next(new Error("Can't find signature")); }

    req.signature = signature;
    return next();
  });
});

router.get('/signatures/:signature', function(req, res) {
  res.json(req.signature);
});


module.exports = router;