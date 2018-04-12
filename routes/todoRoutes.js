const { mongoose } = require("../db/mongoose");
const Todo = mongoose.model("Todo");

module.exports = app => {
  app.post("/todos", (req, res) => {
    var todo = new Todo({
      text: req.body.text
    });

    todo.save().then(
      doc => {
        res.send(doc);
      },
      err => {
        res.status(400).send(err);
      }
    );
  });

  app.get("/todos", (req, res) => {
    Todo.find().then(
      todos => {
        // using obj instead of array in case i want to return more than just todos in future
        res.send({ todos });
      },
      e => {
        res.status(400).send(e);
      }
    );
  });
};
