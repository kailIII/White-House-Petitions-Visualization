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
	var q = Petition.find()

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
  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("Can't find petition")); }

    req.post = post;
    return next();
  });
});

router.get('/petitions/:petition', function(req, res) {
 //req.post.populate('signatures', function(err, post) {
    res.json(req.post);
 // });
});


module.exports = router;