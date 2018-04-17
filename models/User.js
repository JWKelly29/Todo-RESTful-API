const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  console.log(user);
  var access = "auth";
  var token = jwt.sign({ _id: user._id.toHexString(), access }, "123abc789");
  // concat instead of push
  user.tokens = user.tokens.concat([{ access, token }]);
  user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  var user = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "123abc789");
  } catch (e) {
    return Promise.reject();
  }

  return user.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
