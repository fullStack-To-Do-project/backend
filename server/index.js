const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { Client } = require("pg");
const url = "postgres://asaad:1234@localhost:5432/perntodo";
const client = new Client(url);
const axios = require("axios");
const bodyParser = require("body-parser");

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//ROUTES

//create todo
app.post("/todos", todosHandler);
//get all todos
app.get("/todos", getTodosHandler);
app.get("/todo/:id", getOneTodoHandler);
app.put("/todo/:id", updateTodoHandler);
app.delete("/todo/:id", deleteTodoHandler)

//functions
function todosHandler(req, res) {
  try {
    const { description } = req.body;
    let sql = "INSERT INTO todo (description) VALUES ($1) RETURNING *";
    const values = [description];
    client.query(sql, values).then((result) => {
      res.status(201).json(result.rows), console.log(result.rows[0]);
    });
  } catch (err) {
    console.error(err.message);
  }
}
function getTodosHandler(req, res) {
  try {
    let sql = "SELECT  * FROM todo;";
    client.query(sql).then((result) => {
      res.json(result.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
}

function getOneTodoHandler(req, res) {
  try {
    let todoId = req.params.id;
    let sql = "SELECT  * FROM todo WHERE id = $1";
    let values = [todoId];
    client.query(sql, values).then((data) => {
      res.json(data.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
}
function updateTodoHandler(req, res) {
  try {
    let todoId = req.params.id;
    let { description } = req.body;
    let sql = "UPDATE todo SET description =$1 WHERE id=$2 RETURNING *";
    const values= [description, todoId] ;
    client.query(sql,values).then((data)=>{res.json(data.rows)})
  } catch (error) {
    console.error(error.message);
  }
}
function  deleteTodoHandler(req, res) {
    try {
        let todoId=req.params.id;
        let sql="DELETE  from todo WHERE id = $1"
        let values= [todoId]
        client.query(sql , values).then((result)=>{
            res.json("Deleted")
        })
    } catch (error) {
        console.error(error.message);
        
    }
}
//Listener

client
  .connect()
  .then(() =>
    app.listen(port, () => {
      console.log(`server is running and  listening on port ${port}`);
    })
  )
  .catch();
