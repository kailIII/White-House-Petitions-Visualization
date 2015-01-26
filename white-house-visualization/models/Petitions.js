var mongoose = require('mongoose');

var PetitionSchema = new mongoose.Schema({
  petitionId: String,
  title: String,
  body: String,
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signature' }],
  signatureThreshold: Number,
  signatureCount: Number,
  signaturesNeeded: Number,
  url: String,
  deadline: Date,
  status: String,
  response: String,
  created: Date,
  isSignable: Boolean,
  isPublic: Boolean
});

mongoose.model('Petition', PetitionSchema);