const mongoose = require('./connection.js');
var seedData = require('./seeds.json');
var Person = mongoose.model("Person");
var Task = mongoose.model("Task");

Task.remove({});

Person.remove({}).then(() => {
  Person.collection.insert(seedData).then(() =>{
    process.exit();
  });
});
