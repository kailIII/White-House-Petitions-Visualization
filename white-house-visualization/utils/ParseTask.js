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
		console.log("Download Complete");
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
			if (thisPetition == null) {
				var thisPetition = new Petition();
				thisPetition.petitionId = petition.id;
				updateIssues(petition);
			}

			thisPetition.title = petition.title;
			thisPetition.body = petition.body;
			//thisPetition.issues = petition.issues;
			thisPetition.signatureThreshold = parseInt(petition.signatureThreshold);
			thisPetition.signatureCount = parseInt(petition.signatureCount);
			thisPetition.signaturesNeeded = parseInt(petition.signaturesNeeded);
			thisPetition.url = petition.url;
			thisPetition.deadline = new Date(petition.deadline);
			thisPetition.status = petition.status;
			thisPetition.response = petition.response;
			thisPetition.created = new Date(petition.created);
			thisPetition.isSignable = petition.isSignable;
			thisPetition.isPublic = petition.isPublic;


			thisPetition.save(function (err, savedPetition) {
				if (err) return console.error(err);
				updateSignatures(savedPetition);});
			});
}

function updateSignatures(petition) {
	//get the new signatures
	//get the old signatures
	//save the new signatures
	//link the new signatures to the petition
	//save the petition
	//delete the old signatures
	console.log(petition._id + " Saved");
}

function updateIssues(petition) {

}

apiCall("https://api.whitehouse.gov/v1/petitions.json?limit=30&offset=0&createdBefore=1352924535");

