const { app } = require("../../server");
const { User } = require("../../models/User");

const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");
const { mongoose } = require("../../db/mongoose");
const { users, populateUsers } = require("../seed/seed");

beforeEach(populateUsers);

describe("GET /users/me", function() {
  it("Should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it("Should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("Post /users/me", function() {
  it("Should create a user and that user should have a hashed password", done => {
    var email = "test@test.com";
    var password = "password123";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({ email }).then(user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        });
      });
  });
  it("Should return validation errors if request is invalid", done => {
    request(app)
      .post("/users")
      .send({
        email: "invalid email",
        password: "123"
      })
      .expect(400)
      .end(done);
  });
  it("Should not create user if email in use", done => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "password123"
      })
      .expect(400)
      .end(done);
  });
});
