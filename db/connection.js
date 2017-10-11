var mongoose = require('mongoose');

if(process.env.NODE_ENV == 'production'){
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect('mongodb://localhost/Project3-Backend')
}

var TaskSchema = new mongoose.Schema({
  title: String,
  date: String
})

var PersonSchema = new mongoose.Schema({
  name: String,
  phone: String,
  tasks: [TaskSchema]
})

mongoose.connect('mongodb://localhost/Project3-Backend');
mongoose.model('Task', TaskSchema);
mongoose.model('Person', PersonSchema);
module.exports = mongoose;
