var mongoose = require('mongoose');

var SignatureSchema = new mongoose.Schema({
  signature_id: String,
  name: String,
  zip: String,
  created: String
});

mongoose.model('Signature', SignatureSchema);