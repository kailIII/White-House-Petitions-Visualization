var mongoose = require('mongoose');

var IssueSchema = new mongoose.Schema({
  issue_id: String,
  name: String,
  count: {type: Number, default: 0}
});

mongoose.model('Issue', IssueSchema);