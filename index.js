var express   = require("express");
var parser    = require("body-parser");
var hbs       = require("express-handlebars");
var mongoose  = require('./db/connection.js');
const cors = require('cors')
var Person = mongoose.model("Person")
var Task = mongoose.model("Task")

var app = express();

//Sets localhost to 3001
app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");

app.use(cors())

//NEED THIS FOR REQ.BODY!!!!
app.use(parser.json({extended:true}));

//homepage
app.get("/home", function (req, res){
  Person.find({}).then(function(people){
    res.json(people);
  });
});

//shows individual person
app.get("/:email", function(req, res){
  Person.findOne({email: req.params.email}).then(function(person){
    res.json(person);
  });
});

//creates a new person
app.post("/home", function (req, res){
  Person.create(req.body).then(function(person){
    res.json(person);
  });
});

//updates person
app.post("/:email", function (req, res){
  Person.findOneAndUpdate({email: req.params.email}, req.body, {new:true}).then(function(person){
    res.json(person);
  })
})

//deletes a person
app.post("/:email/delete", function(req, res){
  Person.findOneAndRemove({email: req.params.email}).then(function(){
    res.json("/home");
  });
});

//add task to person
app.post('/:email/addTask', (req, res) => {
  Task.create(req.body.tasks).then(task => {
    Person.findOneAndUpdate({ email: req.params.email }, {$push: {tasks: task}}, { 'new': true}).then(person => {
      res.json(person)
    })
  })
 })

//remove task from person
app.post("/:email/:task/remove", function removeTask(req, res){
  Person.findOneAndUpdate({email: req.params.email}, {
    $pull: { tasks: {title: req.params.task} }
  },
  {new: true}, function(err, docs){
    if(err){
      console.log(err);
    }
    else{
      res.json(docs);
    }
  });
});

//lets you know if you're connected to the localhost
app.listen(app.get("port"), function(){
  console.log("DO THE DEW!!");
});
