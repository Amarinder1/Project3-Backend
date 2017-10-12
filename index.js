var express   = require("express");
var parser    = require("body-parser");
var hbs       = require("express-handlebars");
var mongoose  = require('./db/connection.js');
const cors = require('cors')
var Person = mongoose.model("Person")
var Task = mongoose.model("Task")
var keys = require("./twiliokeys");
cronJob = require('cron').CronJob;

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

app.post('/sendsms', (req, res) => {

  var CronJob = require('cron').CronJob;
  var twilio = require('twilio')
  var client = new twilio(keys.sid, keys.token);

  new CronJob('* * * * *', function() {
    client.messages.create({
      to: req.body.recipient,
      from: '+12407021328',
      body: 'You still have a pending to-do item. Tick tock! We are not getting any younger...'
    }, function (err, responseData) {
      console.log(err, responseData)
      if (!err) {
        res.json({
          "From": responseData.from,
          "Body": responseData.body
        });
      }
    });
}, null, true, 'America/New_York');

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
