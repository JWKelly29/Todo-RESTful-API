const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/Todo");
const { User } = require("../../models/User");
const jwt = require("jsonwebtoken");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: "email@email.com",
    password: "userOnePass",
    tokens: [
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
    tokens: [
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
    text: "first test todo",
    _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: "second test todo",
    completed: true,
    completedAt: 667,
    _creator: userTwoID
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
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
    .then(() => {
      done();
    });
};

module.exports = { todos, populateTodos, users, populateUsers };
