require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
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
  res.sendFile(path.join(__dirname, "/models/todos.json"));
  // res.status(501).end();
});

//Add GET request with path '/todos/overdue'
app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "/models/todos.json"));

  // res.status(501).end();
});

//Add GET request with path '/todos/completed'

//Add POST request with path '/todos'

//Add PATCH request with path '/todos/:id
app.get("/models/todos.json"), (req, res) => {
  console.log('Models:', res.locals)
  const file = "/models/todos.json";
  const id = JSON.parse(req.params.id);}
  

//Add POST request with path '/todos/:id/complete

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id

module.exports = app;
