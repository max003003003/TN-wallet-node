const config = require('dotenv').config()
const express = require('express')
const app = express()
const model = require('./Model')
const controller = require('./Controller/walletController')

app.get("/",(req,res)=>{
    res.send("server start")
})

app.get('/create', (req, res) => {
    model.createTable()
    res.send('Hello ')
})

app.get("/insert", (req, res) => {   
     const account ={
        account_id: 1234567890,
        name: "thanaporn",
        surname: "Sumpaotong",
        citizen_id: "1100501204188",
        email: "thanaporn@gmail.com",
        tel: "0860755482",
        username: "Oh.tnp",
        password: "12345A",
        balance: 0.0,
        register_timestamp: null
    }
     controller.insertAccount(account).then((account)=>{
         res.send(account)
     })
       
})

app.get("/accounts/:id", (req, res) => {
    controller.getAccountInfo(req.query.id).then((accounts) => {
        accounts.map((account)=>{
            delete account["balance"]
            return account
        })
        res.send(accounts)
    })
})
app.get("/balances/:id", (req, res) => {
    controller.getAccountInfo(req.query.id).then((accounts) => {
        res.send(accounts)
    })
})
app.listen(3000, () => {
    console.log("app listen port 3000")
})