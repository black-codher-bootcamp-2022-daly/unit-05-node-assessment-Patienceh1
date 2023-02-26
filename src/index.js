require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const getData = () => JSON.parse(
  fs.readFileSync(path.join(__dirname, todoFilePath))
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());
app.use("/content", express.static(path.join(__dirname, "public")));

// const statusCode = (goodStatus, badStatus, res) => {
//   fs.readFileSync(path.join(__dirname, todoFilePath)), JSON.stringify(getData), (err) =>{
//   if (err) {
//     res.status(badStatus).send("Sorry cannot find data");
//   } else {
//     res.status(goodStatus).send("Data has been found");
//   }

// }};

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
  // get todos
 let todos = getData()
  //filter todos that are incomplete and the due date has passed
  .filter((todo) => !todo.completed && Date.parse(todo.due) < new Date())
  // return filtered todos
   res.send(todos);
});

//Add GET request with path '/todos/completed'
app.get("/todos/completed", (req, res) => {
  res.header("Content-Type", "application/json");
let todos = getData().filter((todo) => todo.completed)
res.send(todos);


});
//Add POST request with path '/todos'

//Add PATCH request with path '/todos/:id

app.get("/todos/:id", (req, res) => {
  res.header("Content-Type", "application/json");
  const getId = getData().find((element) => element.id === req.params.id);
  console.log(getId);
  if (!getId) {
    res.status(404).send("Sorry Id not found")
  } else {
  res.send(getId).status(200);
}


});

// (req, res) => {
//   console.log("Models:", res.locals);
//   const file = "/models/todos.json";
//   const id = JSON.parse(file);
//   console.log(file);
// };

//Add POST request with path '/todos/:id/complete

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id



module.exports = app;
