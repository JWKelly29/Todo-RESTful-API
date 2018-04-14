var env = process.env.NODE_ENV || "development";
console.log(`Running in a ${env} environment`);

if (env == "development") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env == "test") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}

const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

const app = express();

// middleware to be used on incoming request before being sent off to request handlers
app.use(bodyParser.json());
const port = process.env.PORT;

require("./routes/todoRoutes")(app);

app.listen(port, () => {
  console.log(`starting on port ${port}`);
});

module.exports = { app };
