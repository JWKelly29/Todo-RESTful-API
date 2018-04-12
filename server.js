const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

const app = express();
// middleware to be used on incoming request before being sent off to request handlers
app.use(bodyParser.json());

require("./routes/todoRoutes")(app);

app.listen(3000, () => {
  console.log("starting on point 3000");
});

module.exports = app;
