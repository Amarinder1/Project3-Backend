var express   = require("express");
var parser    = require("body-parser");
var hbs       = require("express-handlebars");
var mongoose  = require('./db/connection.js');

var Person = mongoose.model("Person")
var Task = mongoose.model("Task")

var app = express();

//Sets localhost to 3001
app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");

//NEED THIS FOR REQ.BODY!!!!
app.use(parser.urlencoded({extended:true}));

//homepage
app.get("/", function (req, res){
  Person.find({}).then(function(people){
    res.render("index.hbs", {
      people: people
    });
  });
});

//shows individual person
app.get("/:name", function(req, res){
  Person.findOne({name: req.params.name}).then(function(person){
    res.render("show", {
      person: person
    });
  });
});

//creates a new person
app.post("/", function (req, res){
  Person.create(req.body).then(function(person){
    res.redirect("/" + person.name);
  });
});

//updates person
app.post("/:name", function (req, res){
  Person.findOneAndUpdate({name: req.params.name}, req.body, {new:true}).then(function(person){
    res.redirect('/' + person.name)
  })
})

//deletes a person
app.post("/:name/delete", function(req, res){
  Person.findOneAndRemove({name: req.params.name}).then(function(){
    res.redirect("/");
  });
});

//add task to person
app.post("/:name/:item/add", function addItem(req, res){
  Person.findOne({name: req.params.name}, function(err, docs){
    docs.items.push(new Task({title: req.body.task}))
    docs.save(function(err, results){
      if(err){
        console.log(err)
      }
      else{
        res.redirect("/" + docs.name)
      }
    });
  });
});

//remove task from person
app.post("/:name/:item/remove", function removeItem(req, res){
  Person.findOneAndUpdate({name: req.params.name}, {
    $pull: { tasks: {title: req.params.item} }
  },
  {new: true}, function(err, docs){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/" + docs.name);
    }
  });
});

//lets you know if you're connected to the localhost
app.listen(app.get("port"), function(){
  console.log("DO THE DEW!!");
});
