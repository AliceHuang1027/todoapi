//requires all the dependencies
const express = require('express')
const app = express()
const fs = require('fs')
const {v4:uuid} = require('uuid')
const port = process.env.PORT || 8000

let todos = []
fs.readFile('./notes',(err,data)=>{
    if(err) {
        // this means the file does not exsit
        return console.log('error reading file')}
        const str = data.toString()
        if(str){
            todos = JSON.parse(str)
        }
})

app.use(express.static(__dirname +'/public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.options('/todolist/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Credentials'
    )
    res.send('ok')
  })
  

app.get("/todolist", (req, res)=>{
    res.sendFile("index.html",{root:__dirname})
})
app.get("/todolist/todos",(req,res)=>{
    fs.writeFile('./notes',JSON.stringify(todos),()=>{})
    res.json(todos)

})

app.post("/todolist/todos",(req,res)=>{
    if(!req.body.text){
        return res.status(400).send("please provide a todo item.")
    }
    const $id = uuid()
    todos.push({"id":$id,"complete":false,"text":req.body.text,"createdAt":Date.now()})
    
    res.json(todos)
})
app.patch("/todolist/todos/:id",(req,res)=>{
    const todoId = req.params.id
    
    if(req.body.complete !== undefined){
        todos.forEach((e)=>{
            if(e.id===todoId){
                e.complete=req.body.complete
            }
        })
    }
    if(req.body.text){
         todos.forEach((e)=>{
            if(e.id===todoId){
                e.text=req.body.text
            }
        })
    }
    res.json(todos)
})

app.delete("/todolist/todos/:id",(req,res)=>{
    const todoId = req.params.id
    
    todos = todos.filter((e)=>{
        return e.id !==todoId
    })
    res.sendFile("index.html",{root:__dirname})
})

app.listen(port,()=>{console.log(`listening on port ${port} `)})
