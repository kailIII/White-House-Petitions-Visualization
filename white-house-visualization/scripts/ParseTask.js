var express = require('express');
var request = require("request");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/petitions');
require('../models/Issues');
require('../models/Signatures');
require('../models/Petitions');

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = 12;

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
	var count = petitions.length;

	var recursiveCommentCall = function getNext(i) {
			   	if (i >= count) return console.log("All Petitions Downloaded");
			   	else {
			   		//wait .5 seconds between calls
			  		setTimeout(function() {
					  	addPetition(petitions[i]);
				  		getNext(i+1);
					}, 5000);
			    }
			};
	recursiveCommentCall(0);
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
			thisPetition.deadline = new Date(petition.deadline * 1000);
			thisPetition.status = petition.status;
			//thisPetition.response = petition.response;
			thisPetition.created = new Date(petition.created * 1000);
			thisPetition.isSignable = petition.isSignable;
			thisPetition.isPublic = petition.isPublic;

			if (thisPetition.signaturesNeeded == 0) {
				thisPetition.signaturesNeeded = 100000;
			}

			thisPetition.signatureProgress = (thisPetition.signatureCount / thisPetition.signaturesNeeded) * 100;

			thisPetition.save(function (err, savedPetition) {
				if (err) return console.error(err);
				console.log("Petition Saved: " + savedPetition.petitionId);
				updateSignatures(savedPetition);});
			});
}

function updateSignatures(petition) {
	var queryURL = "https://api.whitehouse.gov/v1/petitions/" + petition.petitionId + "/signatures.json?limit=10000";

	request({
		uri: queryURL,
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		maxRedirects: 10
	}, function(error, response, body) {
		if(error){ return console.log(error); }
		console.log("Signature Download Complete");
		parseSignatureJSON(body);
	});

	//get the new signatures
	//get the old signatures
	//save the new signatures
	//link the new signatures to the petition
	//save the petition
	//delete the old signatures
}

function parseSignatureJSON(body) {
	var data = JSON.parse(body);
	var signatures = data.results;
	if (signatures != null) {
		for (var i = 0; i < signatures.length; i++) {
			addSignature(signatures[i]);
		}
	}
	else {
		console.error("Signatures Returned Null");
	}
}

function addSignature(signature) {
	Signature.findOne({'signatureId': signature.id}, function (err, thisSignature) {
				if (err) return console.log(err);
				if (thisSignature == null) {
					var thisSignature = new Signature();

					thisSignature.signatureId = signature.id;
					thisSignature.petitionId = signature.petitionId;
					thisSignature.name = signature.name;
					thisSignature.city = signature.city;
					thisSignature.state = signature.state;
					thisSignature.zip = signature.zip;
					thisSignature.created = new Date(signature.created * 1000);

					thisSignature.save(function (err, savedSignatue) {
						if (err) {return console.error(err);}
						else {console.log("Signature Saved: " + savedSignatue.signatureId)}
					});
		}
	});
}

function updateIssues(petition) {

}

function getGeoPoints(zipcode) {
	//query geocoding api
	//save resulting points to signature entry
}

apiCall("https://api.whitehouse.gov/v1/petitions.json?limit=3000");
var recuringQuery = schedule.scheduleJob(rule, function(){
	apiCall("https://api.whitehouse.gov/v1/petitions.json?limit=3000");
});