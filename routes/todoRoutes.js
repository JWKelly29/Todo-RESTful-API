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
};
