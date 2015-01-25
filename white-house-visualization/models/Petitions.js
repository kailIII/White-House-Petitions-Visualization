var mongoose = require('mongoose');

var PetitionSchema = new mongoose.Schema({
  petition_id: String,
  type: String,
  title: String,
  body: String,
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signature' }],
  signatureThreshold: String,
  signatureCount: String,
  signaturesNeeded: String,
  url: String,
  deadline: String,
  status: String,
  response: String,
  created: String,
  isSignable: Boolean,
  isPublic: Boolean
});

mongoose.model('Petition', PetitionSchema);