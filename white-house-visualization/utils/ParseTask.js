var express = require('express');
var request = require("request");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/petitions');
require('../models/Issues');
require('../models/Signatures');
require('../models/Petitions');

var Petition = mongoose.model('Petition');
var Issue = mongoose.model('Issue');
var Signature = mongoose.model('Signature');

function apiCall(url) {
	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		maxRedirects: 10
	}, function(error, response, body) {
		if(error){ return console.log(error); }
		parseJSON(body);
	});
}

function parseJSON(body) {
	var data = JSON.parse(body);
	var petitions = data.results;

	for (var i = 0; i < petitions.length; i++) {
		var petition = petitions[i];
		addPetition(petition);
	}
}

function addPetition(petition) {
		Petition.findOne({'petitionId': petition.id}, function (err, thisPetition) {
			if (err) return console.log(err);
			if (thisPetition != null) {
				thisPetition.title = petition.title;
				thisPetition.body = petition.body;
			}
			else {
				var thisPetition = new Petition();
				thisPetition.petitionId = petition.id;
				thisPetition.title = petition.title;
				thisPetition.body = petition.body;
			}

			thisPetition.save(function (err, savedPetition) {
				if (err) return console.error(err);});
		});
}

apiCall("https://api.whitehouse.gov/v1/petitions.json?limit=30&offset=0&createdBefore=1352924535");

