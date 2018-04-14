const { ObjectID } = require("mongodb");

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
  app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findById(id)
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }
        // responding with object in case i want to respond with additional things in future
        res.send({ todo });
      })
      .catch(e => {
        res.status(400).send();
      });
  });
};
