const { app } = require("../../server");
const { Todo } = require("../../models/Todo");

const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");
const { mongoose } = require("../../db/mongoose");

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

beforeEach(done => {
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
});

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => {
            console.log(e);
            done(e);
          });
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        res.body.todos.length == 2;
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("Should return a specific todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it("Should return a 404 if the todo doc is not found", done => {
    var objID = new ObjectID();
    request(app)
      .get(`/todos/${objID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("Should return a 404 if the an a non-objectID is given", done => {
    request(app)
      .get(`/todos/nonObjectID`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    var testTodo = new Todo({ _id: new ObjectID(), text: "test todo" });
    testTodo.save();

    request(app)
      .delete(`/todos/${testTodo._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(testTodo.text);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    var testID = new ObjectID();
    request(app)
      .delete(`/todos/${testID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if objectID is not valid", done => {
    request(app)
      .delete(`/todos/123abc789`)
      .expect(404)
      .end(done);
  });
});

describe("Patch /todos/:id", () => {
  it("should update the todo when completed is true", done => {
    var hexId = todos[0]._id.toHexString();
    var text = "This should be the new text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should update the todo when completed is false", done => {
    var hexId = todos[0]._id.toHexString();
    var text = "This should be the new text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    var testID = new ObjectID();
    request(app)
      .patch(`/todos/${testID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if objectID is not valid", done => {
    request(app)
      .patch(`/todos/123abc789`)
      .expect(404)
      .end(done);
  });
});
