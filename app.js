require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const _ = require("lodash");
const atlasPass = process.env.ATLAS_PASS;

app.set("view engine", "ejs");
app.use(bodyParser());
app.use(express.static("public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect("mongodb+srv://admin-jan:" + atlasPass + "@cluster0.njvgj.mongodb.net/classifiedApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dbSchema = {
  name: String,
  email: String,
  phone: String
};

const Record = mongoose.model("Record", dbSchema);

// "/articles"
// GET
app.route("/records")
  .get(function(req, res) {
    Record.find(function(err, foundRecords) {
      if (!err) {
        res.send(foundRecords);
      } else {
        res.send(err);
      }
    });
  })
  // POST
  .post(function(req, res) {
    console.log(req.body)

    const newRecord = new Record({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone      
    });
    newRecord.save(function(err) {
      if (!err) {
        res.send("New record created.");
      } else {
        res.send(err);
      }
    });
  })
  

// "/records/[record]"
app.route("/records/:recordId")
  // GET a record
  .get(function(req, res) {    
    Record.findOne({
      _id: recordId
    }, function(err, foundRecord) {
      if (!err) {
        if (foundRecord) {
          res.send(foundRecord);
        } else {
          res.send("Record not found.");
        }
      } else {
        res.send(err);
      }
    });
  })

  // PUT an article
  .put(function(req, res) {    
    Record.updateOne({
      _id: recordId
    }, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    }, {
      overwrite: true
    }, function(err, updatedRecord) {
      if (!err) {
        if (updatedRecord) {
          res.send("Record " + recordId + " has been updated.");
        } else {
          res.send("Record not found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  // PATCH an article
  .patch(function(req, res) {
    
    Record.updateOne({
      _id: recordId
    }, {
      $set: req.body
    },function(err, updatedRecord) {
      if (!err) {
        if (updatedRecord) {
          res.send("Record " + recordId + " has been updated.");
        } else {
          res.send("Record not found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  // DELETE an article
  .delete(function(req, res){    
    Record.deleteOne({_id: recordId},function(err){
      if(!err){
        res.send("Record " + recordId + " deleted.");
      }else{
        res.send(err);
      }
    });
  });

  



  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 2000;
  }

  app.listen(port, function() {
    console.log("Server started successfully!");
  });
