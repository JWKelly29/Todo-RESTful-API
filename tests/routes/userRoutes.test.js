const { app } = require("../../server");
const { User } = require("../../models/User");

const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");
const { mongoose } = require("../../db/mongoose");
const { users, populateUsers } = require("../seed/seed");

beforeEach(populateUsers);
