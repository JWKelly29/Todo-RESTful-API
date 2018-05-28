require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

const app = express();

// middleware to be used on incoming request before being sent off to request handlers
app.use(bodyParser.json());
const port = process.env.PORT;

require("./routes/userRoutes")(app);
require("./routes/todoRoutes")(app);

app.listen(port, () => {
  console.log(`starting on port ${port}`);
});

module.exports = { app };
