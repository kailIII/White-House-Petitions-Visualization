var express = require('express');
var router = express.Router();

var request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/petitions', function(req, res, next) {
	request({
		uri: "https://api.whitehouse.gov/v1/petitions.json?limit=3&offset=0&createdBefore=1352924535",
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		maxRedirects: 10
	}, function(error, response, body) {
		if(error){ return next(error); }
    	res.json(body);
	});
});

module.exports = router;
