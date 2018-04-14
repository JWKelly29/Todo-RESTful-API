const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { mongoose } = require("../db/mongoose");
const User = mongoose.model("User");

module.exports = app => {
  app.post("/users", (req, res) => {
    console.log("req:", req);
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    User.save()
      .then(user => {
        res.send(user);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });
};
