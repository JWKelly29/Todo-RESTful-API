var mongoose = require("mongoose");

mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model("Todo", {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: "Cook Dinner"
});

newTodo.save().then(
  doc => {
    console.log("saved todo", doc);
  },
  e => {
    console.log("error:", e);
  }
);
