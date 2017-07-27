const config = require('dotenv').config()
const express = require('express')
const app = express()
const model = require('./Model')
const bodyParser = require('body-parser');
const controller = require('./Controller/walletController')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.send("server start")
})

app.get('/create', (req, res) => {
    model.createTable()
    res.send('Hello ')
})



app.get("/insert", (req, res) => {

    const account = [
        {
            account_id: 1234567890,
            name: "Thanaporn",
            surname: "Sumpaotong",
            citizen_id: "1100501204188",
            email: "thanaporn@gmail.com",
            tel: "0860755482",
            username: "Oh.tnp",
            password: "12345A",
            balance: 2000.0,
            register_timestamp: '2017-07-25 09:29:00'
        },
        {
            account_id: 9876543210,
            name: "Thanaporn",
            surname: "Suwathanawongchai",
            citizen_id: "1111111111111",
            email: "kunthanaporn@gmail.com",
            tel: "0984593556",
            username: "Not.Oh",
            password: "12345A",
            balance: 4700.0,
            register_timestamp: '2017-07-25 09:29:00'
        },
        {
            account_id: 7582983660,
            name: "Phansawuth",
            surname: "Jenthaworn",
            citizen_id: "1111122222345",
            email: "phanasawuth@gmail.com",
            tel: "0860755483",
            username: "Phan.tnp",
            password: "12345A",
            balance: 0.0,
            register_timestamp: '2017-07-25 09:29:00'
        }
    ]

    const transaction = [
        {
            type: "transfer",
            src_account_id: "1234567890",
            src_initial_balance: "200",
            des_account_id: "9876543210",
            des_initial_balance: "4700",
            amount: "200",
            fee: "0",
            src_remain_balance: "0",
            des_remain_balance: "4900",
            transaction_status: 'success'
        }
    ]
    controller.insertTransactionDefault(transaction).then((transaction) => {
        controller.insertAccount(account).then((account) => {
            res.send(account)
        })
    })
})


app.get("/accounts/:id", (req, res) => {
    controller.getAccountInfo(req.params.id, ['account_id', 'name', 'surname','balance']).then((accounts) => {
        res.send(accounts)
    })
})

app.get("/accounts", (req, res) => {
    controller.getAccountInfo(null, ['account_id', 'name', 'surname','balance']).then((accounts) => {
        res.send(accounts)
    })
})

app.get("/balances/:id", (req, res) => {
    controller.getAccountInfo(req.params.id, ['account_id', 'balance']).then((accounts) => {
        res.send(accounts)
    })
})
app.post("/transactions", (req, res) => {
     var type = req.body.type
     var src_acc_id = req.body.src_acc_id
     var src_initial_balance = Number(req.body.src_initial_balance)
     var des_acc_id = req.body.des_acc_id
     var des_initial_balance = Number(req.body.des_initial_balance)
     var amount = Number(req.body.amount)
     var fee = 0
     var src_remain_balance = Number(req.body.src_remain_balance)
     var des_remain_balance = Number(req.body.des_remain_balance)

    var local_src_remain_balance = src_initial_balance - amount
    var local_des_remain_balance = des_initial_balance + amount
    
 

    if(type == "transfer"){
         // calculate transfer
        if(local_src_remain_balance != src_remain_balance || local_des_remain_balance != des_remain_balance){
            return res.status(400).send({
                error: {
                    message : "invalid remaining balance"
                }
            })
        }
        console.log("going to check account exist")
        // checkaccount exist
            controller.checkAccountExist(src_acc_id).then((isSrcExist)=>{
                if(isSrcExist){
                    controller.checkAccountExist(des_acc_id).then((isDesExist)=>{
                        if(isDesExist){
                            // check Sender enough Balance
                            controller.checkEnoughBalance(src_acc_id,amount).then((isEnoungh)=>{
                                if(isEnoungh){
                                    // check Limit Reciever Balance exceed
                                    controller.checkLimitBalance(des_acc_id,amount).then((canTransfer)=>{
                                        if(canTransfer){
                                            const trans = {
                                                type: type,
                                                src_account_id: src_acc_id,
                                                src_initial_balance: src_initial_balance,
                                                des_account_id: des_acc_id,
                                                des_acc_id: des_acc_id,
                                                des_initial_balance: des_initial_balance,
                                                amount: amount,
                                                fee: fee,
                                                src_remain_balance: src_remain_balance,
                                                des_remain_balance: des_remain_balance
                                            }
                                            controller.insertTransaction(trans,res)
                                        }else{
                                            return res.status(400).send({
                                                error: {
                                                    message : "destination account balance exceed limit"
                                                }
                                            }) 
                                        }
                                    })
                                   
                                }else{
                                    return res.status(400).send({
                                                error: {
                                                    message : "source account doesn't have enough balance"
                                                }
                                            }) 
                                }
                            })
                            
                        }else{
                            return res.status(400).send({
                                error: {
                                    message : "destination account doesn't exist"
                                }
                            }) 
                        }
                    })
                }else{
                    return res.status(400).send({
                                error: {
                                    message : "source account doesn't exist"
                                }
                            }) 
                }
            })

    }else{
        return res.status(400).send({
                error: {
                    message : "transaction type error"
                }
            }) 
    }
})

app.get("/transactions/:id", (req, res) => {
    controller.getTransactionInfo(req.params.id).then((transaction_id) => {
            res.send(transaction_id)
        })
})

app.post("/test",(req,res)=>{
     var type = req.body.type
     var src_acc_id = req.body.src_acc_id
     var src_initial_balance = req.body.src_initial_balance
     var des_acc_id = req.body.des_acc_id
     var des_initial_balance = req.body.des_initial_balance
     var amount = Number(req.body.amount)
     var fee = req.body.fee
     var src_remain_balance = req.body.src_remain_balance
     var des_remain_balance = req.body.des_remain_balance
   

     //TODO handle undefine
     
})

app.listen(3000, () => {
    console.log("app listen port 3000")
})