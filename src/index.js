require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const getData = () =>
  JSON.parse(fs.readFileSync(path.join(__dirname + todoFilePath)));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());
app.use("/content", express.static(path.join(__dirname, "public")));



app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });
});

//Add GET request with path '/todos/overdue'

app.get("/todos/overdue", (req, res) => {
  res.header("Content-Type", "application/json");
  let todos = getData().filter(
    (todo) => !todo.completed && Date.parse(todo.due) < new Date()
  );
  res.send(todos);
});

//Add GET request with path '/todos/completed'
app.get("/todos/completed", (req, res) => {
  res.header("Content-Type", "application/json");
  let todos = getData().filter((todo) => todo.completed);
  res.send(todos);
});


//Add GET request with path '/todos/:id
app.get("/todos/:id", (req, res) => {
  const getId = getData().find((element) => element.id === req.params.id);
  if (getId) {
    res.send(
      JSON.stringify(
        getData().find((element) => element.id == req.params.id),
        null,
        2
      )
    );
  } else {
    res.status(404).send("Sorry Id not found");
  }
});

//Add POST request with path '/todos'
app.post("/todos", (req, res) => {
  let todos = getData();
  const name = req.body.name;
  const due = req.body.due;
  const id = uuidv4();
  const dateTime = new Date();

  if (req.body && new Date(due) != "invalid date") {
    const newTodo = { id, name, completed: false, due, created: dateTime };
    console.log(newTodo);
    todos.push(newTodo);
    todos = JSON.stringify(todos, null, 2);

    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (name == null || due == null) {
        res.status(400).end();
      } else {
        res.status(201).send(`User with the id ${id} created.`);
      }
    });
  }
});

//Add PATCH request with path '/todos/:id
app.patch("/todos/:id", (req, res) => {
  const todos = getData();
  const reqName = req.body.name;
  const reqId = req.params.id;
  const reqDue = req.body.due;

  const todo = todos.find((element) => element.id === reqId);
  if (reqDue) {
    todo.due = reqDue;
  }
  if (reqName) {
    todo.name = reqName;
  }
  console.log(todo);

  fs.writeFile(
    path.join(__dirname + todoFilePath),
    JSON.stringify(todos, null, 2),
    (err) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send(`User has been amended!`).end();
      }
    }
  );
});

//Add POST request with path '/todos/:id/complete
app.post("/todos/:id/complete", (req, res) => {
  const todos = getData();
  const id = req.params.id;

  const getElement = todos.find((todos) => todos.id === id);
  if (getElement) {
    getElement.completed = true;
    console.log(getElement);
    
    fs.writeFile(
      __dirname + todoFilePath,
      JSON.stringify(todos, null, 2),
      (err) => {
        if (err) {
          throw err;
        } else {
          res.send(`User with the id ${id} is now complete.`).status(200);
        }
      }
    );
  } else {
    res.status(404).send("Could not fulfil request");
  }
});

//Add POST request with path '/todos/:id/undo
app.post("/todos/:id/undo", (req, res) => {
  const todos = getData();
  const id = req.params.id;

  const getElement = todos.find((todos) => todos.id === id);
  if (getElement) {
    getElement.completed = false;
    console.log(getElement);
    fs.writeFile(
      __dirname + todoFilePath,
      JSON.stringify(todos, null, 2),
      (err) => {
        if (err) {
          throw err;
        } else {
          res.send(`User with the id ${id} is now incomplete.`).status(200);
        }
      }
    );
  } else {
    res.status(404).send("Could not fulfil request");
  }
});

//Add DELETE request with path '/todos/:id
app.delete("/todos/:id", (req, res) => {
  let todos = getData();
  const id = req.params.id;

  const removeTodo = todos.find((todo) => todo.id == id);
  console.log(removeTodo);
  if (removeTodo) {
    todos = todos.filter((todo) => todo.id != id);
    fs.writeFile(
      __dirname + todoFilePath,
      JSON.stringify(todos, null, 2),
      (err) => {
        if (err) {
          throw err;
        } else {
          res.send(`User with the id ${id} deleted.`).status(200);
        }
      }
    );
  } else {
    res.status(404).send("Could not fulfil request");
  }
});

module.exports = app;
