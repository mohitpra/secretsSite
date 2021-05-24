//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology:true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "littleSecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req,res){

  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(function(err){
    if(!err){
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function(req, res){
const username = req.body.username;
const pswd = req.body.password;

User.findOne({email: username}, function(err, foundUser){
  if(err){
    console.log(err);
  } else {
    if(foundUser) {
      if (foundUser.password === pswd){
        res.render("secrets");
      }
    }
  }
});

});

app.listen(3000, function(){
  console.log("server at 3000");
});
