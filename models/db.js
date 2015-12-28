var mongoose = require('mongoose');
var dbURI = "mongodb://localhost/test";
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

var userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique:true},
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  lastLogin: Date
});
mongoose.model('User', userSchema);

var projectSchema = new mongoose.Schema({
  projectName: String,
  createdOn: Date,
  modifiedOn: { type: Date, default: Date.now },
  createdBy: String,
  tasks: String
});
projectSchema.statics.findByUserID = function (userid, callback) {
  this.find(
    { createdBy: userid },
    '_id projectName',
    {sort: 'modifiedOn'},
    callback);
}
mongoose.model('Project', projectSchema);
