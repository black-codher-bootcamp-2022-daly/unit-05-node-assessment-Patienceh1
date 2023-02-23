require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "models/todos.json"))
);
// const todos = require("/models/todos.js");
// const data = require(".todos.json");

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
  const data = res.sendFile(todoFilePath, { root: __dirname });
  // res.status(501).end();
});

//Add GET request with path '/todos/overdue'

// app.get("/todos", (req, res) => {
//   res.header("Content-Type", "application/json");
//   res.sendFile(path.join(__dirname, "../models/todos.json"));
//   // res.status(501).end();
// });

//Add GET request with path '/todos/completed'

//Add POST request with path '/todos'

//Add PATCH request with path '/todos/:id

app.get("/todos/:id", (req, res) => {
  res.header("Content-Type", "application/json");
  const getId = data.find((element) => element.id === req.params.id);
  console.log(getId);
  res.status(200).send(getId);


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
