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

const statusCode = (goodStatus, badStatus, res) => {
  fs.readFileSync(path.join(__dirname + todoFilePath)),
    JSON.stringify(getData),
    (err) => {
      if (err) {
        res.status(badStatus).send("Sorry cannot find data");
      } else {
        res.status(goodStatus).send("Data has been found");
      }
    };
};

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });
  // res.status(501).end();
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
    const newTodo = { id, name, complete: false, due, created: dateTime };
    console.log(newTodo);
    todos.push(newTodo);
    todos = JSON.stringify(todos, null, 2);
    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      } else {
        res.status(201).send(`User with the id ${id} created.`).end();
      }
    });
  } else {
    res.status(400).send("Could not fulfil request").end();
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

  fs.writeFile(
    path.join(__dirname, "models/todos.json"),
    JSON.stringify(todos),
    (err) => {
      if (err) {
        res.send("Unsuccessful request");
      } else {
        res.send("Successful request");
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
    getData.completed = true;
  }

  fs.writeFile(
    path.join(__dirname, todoFilePath),
    JSON.stringify(todos),
    (err) => {
      if (getElement) {
        res.send("Successful request").status(200);
      } else {
        res.send("Unsuccessful request").status(404);
      }
    }
  );
});

//Add POST request with path '/todos/:id/undo
app.post("/todos/:id/undo", (req, res) => {
  const todos = getData();
  const id = req.params.id;

  const getElement = todos.find((todos) => todos.id === id);
  if (getElement) {
    getData.completed = false;
  }
  fs.writeFile(
    path.join(__dirname, "models/todos.json"),
    JSON.stringify(todos),
    (err) => {
      if (err) {
        res.send("Unsuccessful request");
      } else {
        res.send("Successful request");
      }
    }
  );
});

//Add DELETE request with path '/todos/:id
app.delete("/todos/:id", (req, res) => {
  // res.header("Content-Type", "application/json");
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
