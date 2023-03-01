require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const getData = () =>
  JSON.parse(fs.readFileSync(path.join(__dirname, todoFilePath)));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());
app.use("/content", express.static(path.join(__dirname, "public")));

const statusCode = (goodStatus, badStatus, res) => {
  fs.readFileSync(path.join(__dirname, todoFilePath)),
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
  res.header("Content-Type", "application/json");
  const getId = getData().find((element) => element.id === req.params.id);
  console.log(getId);
  if (!getId) {
    res.status(404).send("Sorry Id not found");
  } else {
    res.send(getId).status(200);
  }
});

//Add POST request with path '/todos'
app.post("/todos", (req, res) => {
  const todos = getData();
  const body = req.body;
  todos.push(body);
  console.log(todos);

  fs.writeFile((path.join(__dirname, "models/todos.json")), JSON.stringify(todos), (err) => {

    if (err) {

      res.send("Unsuccessful request").status(201);

    } else {

      res.send("Successful request");
    }

  });



  // const { name, due } = req.body;
  // const id = uuidv4();
  // const dateTime = new Date();

  // if (req.body && new Date(due) != "invalid date") {
  //   const newTodo = { id, name, created: dateTime, due, complete: false };
  //   console.log(newTodo);

  //   todos.push(newTodo);
  // }

  //  res.status(201).json(newTodo);
  // log(req.method, todos);
  //  statusCode(res, 404, 201);
});

//Add PATCH request with path '/todos/:id
app.patch("/todos/:id", (req,res) => {
const todos = getData() 
const reqName = req.body.name;
const reqId = req.params.id;
const reqDue = req.body.due;

  const todo = todos.find((element) => element.id === reqId)  
        if (reqDue) {todo.due = reqDue} 
        if (reqName) {todo.name = reqName};     
        
        fs.writeFile((path.join(__dirname, "models/todos.json")), JSON.stringify(todos), (err) => {

          if (err) {
      
            res.send("Unsuccessful request");
      
          } else {
      
            res.send("Successful request");
          }
      
        });
      })


//Add POST request with path '/todos/:id/complete
app.post("/todos/:id/complete", (req,res) => {
const todos = getData();
const id = req.params.id;

const getElement = todos.find((todos) => todos.id === id)
if (getElement) {
  getData.completed = true;
}

 fs.writeFile((path.join(__dirname, "models/todos.json")), JSON.stringify(todos), (err) => {

          if (err) {
      
            res.send("Unsuccessful request");
      
          } else {
      
            res.send("Successful request");
          }
      
        });

})


//Add POST request with path '/todos/:id/undo
app.post("/todos/:id/undo", (req, res) => {
  const todos = getData();
  const id = req.params.id;

  const getElement = todos.find((todos) => todos.id === id)
  if (getElement) {
    getData.completed = false;
  }
  fs.writeFile((path.join(__dirname, "models/todos.json")), JSON.stringify(todos), (err) => {

    if (err) {

      res.send("Unsuccessful request");

    } else {

      res.send("Successful request");
    }

  });

})

//Add DELETE request with path '/todos/:id

module.exports = app;
