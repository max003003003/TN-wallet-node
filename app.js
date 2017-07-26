const config = require('dotenv').config()
const express = require('express')
const app = express()
const model = require('./Model')
const controller = require('./Controller/walletController')

app.get("/", (req, res) => {
    res.send("server start")
})

app.get('/create', (req, res) => {
    model.createTable()
    res.send('Hello ')
})

app.get("/insert", (req, res) => {
    model.account.create({ name: "kinnch" })
    res.send("asd")
})

app.get("/query/:id", (req, res) => {
    controller.getAccountInfo(req.query.id).then((accounts) => {
        res.send(accounts[0])
    })
})

app.listen(3000, () => {
    console.log("app listen port 3000")
})