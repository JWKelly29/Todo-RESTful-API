const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

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

  return _.pick(userObject, ["_id", "email"]);
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

const User = mongoose.model("User", UserSchema);

module.exports = { User };
