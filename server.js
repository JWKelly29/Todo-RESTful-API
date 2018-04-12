var mongoose = require("mongoose");

mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var newTodo = new Todo({
  text: "Cook Dinner"
});

var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  }
});
