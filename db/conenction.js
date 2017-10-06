var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  title: String,
})

var PersonSchema = new mongoose.Schema({
  name: String,
  tasks: [TaskSchema]
})

mongoose.connect('mongodb://localhost/Project3-Backend');
mongoose.model('Task', TaskSchema);
mongoose.model('Person', PersonSchema);
module.exports = mongoose;
