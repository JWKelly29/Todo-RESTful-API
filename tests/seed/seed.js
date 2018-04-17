const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/Todo");
const jwt = require("jsonwebtoken");

userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: "email@email.com",
    password: "userOnePass",
    token: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneID, access: "auth" }, "123abc789")
          .toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "user2email@email.com",
    password: "userTwoPass",
    token: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoID, access: "auth" }, "123abc789")
          .toString()
      }
    ]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: "first test todo"
  },
  {
    _id: new ObjectID(),
    text: "second test todo",
    completed: true,
    completedAt: 667
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos, (error, docs) => {
        if (error) {
          return done(error);
        }
      });
    })
    .then(() => {
      done();
    });
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(done);
};

module.exports = { todos, populateTodos, users, populateUsers };
