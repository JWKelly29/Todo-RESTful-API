const _ = require("lodash");
const { ObjectID } = require("mongodb");
const { authenticate } = require("../middleware/authenticate");

const { mongoose } = require("../db/mongoose");
const Todo = mongoose.model("Todo");

module.exports = app => {
  app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
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

  app.get("/todos", authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then(
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

  app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({ todo });
      })
      .catch(err => {
        res.status(400).send();
      });
  });

  app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id)
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
