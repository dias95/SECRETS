//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/home",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/secrets",(req,res)=>{
  res.render("secrets");
});

app.get("/submit",(req,res)=>{
  res.render("submit");
});

app.post("/register", (req,res)=>{
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save((err)=>{
    if(!err){
      res.render("secrets");
    } else{
     console.log(err);
    }});
  });

app.post("/login",(req,res)=>{
      const username = req.body.username;
      const password = req.body.password;

      User.findOne({email:username}, (err, foundUser)=>{
        if(err){
          console.log(err);
        } else{
          if(foundUser){
            if(foundUser.password === password){
              res.render("secrets");}
          //   } else{
          //     res.redirect("/login");
          //   }
          // } else{
          //   res.redirect("/login");
          // }
        }}});
      });

app.listen(3000,()=>{
  console.log("The port is working");
});
