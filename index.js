const express = require("express")
const fs = require('fs')
const {json} = require("express");

const app = express()
const parser = express.json()

app.use(express.static(__dirname + '/public'))

const filePath = "users.json"

app.get('/api/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    res.send(users)
})

app.get('/api/users/:id', (req,res) => {
    const id = req.params.id
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    let user = null
    for (let i = 0; i<users.length; i++){
        if(users[i].id == id){
            user = users[i]
            break
        }

    }
    if(user) {
        res.send(user)
    }
    else{
        res.status(404).send('user not found')
    }
})

app.post('/api/users', parser, (req,res) => {
    if(!req.body) return res.sendStatus(400)

    const userName = req.body.name
    const userAge = req.body.age
    let user = {name: userName,age: userAge}
    let data = fs.readFileSync(filePath, 'utf-8')
    let users = JSON.parse(data)

    const id = Math.max.apply(Math, users.map( o => {return o.id}))
    user.id = id+1
    users.push(user)
    data = JSON.stringify(users)
    fs.writeFileSync(filePath, data)
    res.send(user)
})

app.delete('/api/users/:id', (req, res) =>{
    const id = req.params.id
    let data = fs.readFileSync(filePath, 'utf-8')
    let users = JSON.parse(data)
    let index = -1

    for (let i = 0; i < users.length; i++){
        if (users[i].id==id){
            index = i
            break
        }
    }

    if(index > -1){
        const deletedUser = users.splice(index, 1)[0]
        data = JSON.stringify(users)
        fs.writeFileSync(filePath, data)
        res.send(deletedUser)
    }
    else{
        res.status(404).send()
    }
})

app.put('/api/users' ,parser, (req,res) =>{
    if(!req.body) return res.sendStatus(400)
    const userId = req.body.id
    const userName = req.body.name
    const userAge = req.body.age

    let data = fs.readFileSync(filePath, 'utf-8')
    const users = JSON.parse(data)
    let user;
    for (let i = 0; i > users.length; i++){
        if(users[i].id == userId){
            user = user[i]
            break
        }
    }

    if(user){
        user.age = userAge
        user.name = userName
        data = JSON.stringify(users)
        res.send(user)
    }
    else{
        res.status(404).send()
    }
})

app.listen(5000, () =>{
    console.log(`listened on 5000`)
})