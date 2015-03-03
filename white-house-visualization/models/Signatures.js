var mongoose = require('mongoose');

var SignatureSchema = new mongoose.Schema({
  signatureId: String,
  petitionId: String,
  name: String,
  city: String,
  state: String,
  zip: String,
  created: Date
});

mongoose.model('Signature', SignatureSchema);