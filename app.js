require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const _ = require("lodash");
const atlasPass = process.env.ATLAS_PASS;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-jan:" + atlasPass + "@cluster0.njvgj.mongodb.net/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const wikiSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", wikiSchema);

// "/articles"
// GET
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  // POST
  .post(function(req, res) {
    const newArticle = new Article({
      title: _.capitalize(req.body.title),
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("New article created.");
      } else {
        res.send(err);
      }
    });
  })
  // DELETE all
  .delete(function(req, res) {
    Article.deleteMany(function(err, deletedArticles) {
      if (!err) {
        res.send("Deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

// "/articles/[article]"
app.route("/articles/:articleName")
  // GET an article
  .get(function(req, res) {
    const articleName = _.capitalize(req.params.articleName.replace(/-/g, " "));
    console.log(articleName);
    Article.findOne({
      title: articleName
    }, function(err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("Article not found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  // PUT an article
  .put(function(req, res) {
    const articleName = _.capitalize(req.params.articleName.replace(/-/g, " "));
    Article.updateOne({
      title: articleName
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err, updatedArticle) {
      if (!err) {
        if (updatedArticle) {
          res.send("Article " + articleName + " has been updated.");
        } else {
          res.send("Article not found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  // PATCH an article
  .patch(function(req, res) {
    const articleName = _.capitalize(req.params.articleName.replace(/-/g, " "));
    Article.updateOne({
      title: articleName
    }, {
      $set: req.body
    },function(err, updatedArticle) {
      if (!err) {
        if (updatedArticle) {
          res.send("Article " + articleName + " has been updated.");
        } else {
          res.send("Article not found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  // DELETE an article
  .delete(function(req, res){
    const articleName = _.capitalize(req.params.articleName.replace(/-/g, " "));
    Article.deleteOne({title: articleName},function(err){
      if(!err){
        res.send("Article " + articleName + " deleted.");
      }else{
        res.send(err);
      }
    });
  });




  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }

  app.listen(port, function() {
    console.log("Server started successfully!");
  });
