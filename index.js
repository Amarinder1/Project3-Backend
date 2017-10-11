var express   = require("express");
var parser    = require("body-parser");
var hbs       = require("express-handlebars");
var mongoose  = require('./db/connection.js');
const cors = require('cors')
var Person = mongoose.model("Person")
var Task = mongoose.model("Task")
var path = require("path");
var keys = require("./twiliokeys");

var app = express();

//Sets localhost to 3001
app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");

app.use(cors())
app.use('/', express.static('public'));


//NEED THIS FOR REQ.BODY!!!!
app.use(parser.json({extended:true}));

//homepage
app.get("/home", function (req, res){
  Person.find({}).then(function(people){
    res.json(people);
  });
});

//shows individual person
app.get("/:name", function(req, res){
  Person.findOne({name: req.params.name}).then(function(person){
    res.json(person);
  });
});

//creates a new person
app.post("/home", function (req, res){
  Person.create(req.body).then(function(person){
    res.json(person);
  });
});

//twilio integration
app.post('/sendsms', (req, res) => {
  var accountSid = 'ACcc9da7643bf18e44f258ebd74eea7a82';
  var authToken = '1a3c44a9730d9edef125e2b9ecbaba92';
  var twilio = require('twilio')
  var client = new twilio(keys.sid, keys.token);
  client.messages.create({
    to: req.body.recipient,
    from: '+12407021328',
    body: 'Great success!!! *Borat voice*.'
  }, function (err, responseData) {
    console.log(err, responseData)
    if (!err) {
      res.json({
        "From": responseData.from,
        "Body": responseData.body
      });
    }
  });
});

//updates person
app.post("/:name", function (req, res){
  Person.findOneAndUpdate({name: req.params.name}, req.body, {new:true}).then(function(person){
    res.json(person);
  })
})

//deletes a person
app.post("/:name/delete", function(req, res){
  Person.findOneAndRemove({name: req.params.name}).then(function(){
    res.json("/");
  });
});

//add task to person
app.post('/:name/addTask', (req, res) => {
  Task.create(req.body.tasks).then(task => {
    Person.findOneAndUpdate({ name: req.params.name }, {$push: {tasks: task}}, { 'new': true}).then(person => {
      res.json(person)
    })
  })
 })

//remove task from person
app.post("/:name/:task/remove", function removeTask(req, res){
  Person.findOneAndUpdate({name: req.params.name}, {
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
