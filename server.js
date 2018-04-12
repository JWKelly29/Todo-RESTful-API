const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

var app = express();

app.listen(3000, () => {
  console.log("starting on point 3000");
});
