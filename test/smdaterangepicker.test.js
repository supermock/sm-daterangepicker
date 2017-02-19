//Compile index.js run: browserify -t browserify-css public/index.js -o public/bundle.js
var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
app.listen(4000);
console.log("Test running on - localhost:4000");