const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { mongoose } = require("../db/mongoose");
const User = mongoose.model("User");
const { authenticate } = require("../middleware/authenticate");

module.exports = app => {
  app.post("/users", (req, res) => {
    // console.log("req:", req);
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user
      .save()
      .then(() => {
        return user.generateAuthToken();
        // res.send(user);
      })
      .then(token => {
        res.header("x-auth", token).send(user);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

  app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
  });

  app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    User.findByCredentials(body.email, body.password)
      .then(user => {
        return user.generateAuthToken().then(token => {
          res.header("x-auth", token).send(user);
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      }
    );
  });
};
