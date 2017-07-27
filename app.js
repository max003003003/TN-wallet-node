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
            balance: 200.0,
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
   
     
        controller.insertAccount(account).then((account) => {
            res.send(account)
        })


})


app.get("/accounts/:id", (req, res) => {
    controller.getAccountInfo(req.params.id, ['account_id', 'name', 'surname','balance']).then((accounts) => {
        res.send(accounts)
    })

})

app.get("/transfer", (req, res) => {
    // const trans = {
    //     type: req.body.type,
    //     src_acc_id: req.body.src_acc_id,
    //     src_initial_balance: req.body.src_initial_balance,
    //     des_acc_id:req.body.des_acc_id,
    //     des_initial_balance: req.body.des_initial_balance,
    //     amount: req.body.amount,
    //     fee: req.body.fee,
    //     src_remain_balance: req.body.src_remain_balance,
    //     des_remain_balance: req.body.des_remain_balance
    // }
    src_acc_id = "1234567890" 
    des_acc_id = "9876543210"
    amount = 200


    // checkaccount exist
        controller.checkAccountExist(src_acc_id).then((isSrcExist)=>{
            if(isSrcExist){
                controller.checkAccountExist(des_acc_id).then((isDesExist)=>{
                    if(isDesExist){
                        // check Sender enough Balance
                        controller.checkEnoughBalance(src_acc_id,amount).then((isEnoungh)=>{
                            if(isEnoungh){
                                // check Limit Reciever Balance exceed
                                // TODO
                                 const trans = {

                                    type: "transfer",
                                    src_account_id: src_acc_id,
                                    src_initial_balance: 200,
                                    des_account_id: des_acc_id,
                                    des_acc_id: des_acc_id,
                                    des_initial_balance: 4700,
                                    amount: amount,
                                    fee: 0,
                                    src_remain_balance: 0,
                                    des_remain_balance: 4900

                                }
                                controller.insertTransaction(trans).then((response) => {
                                    res.send(response)
                                })
                            }
                        })
                        
                    }
                })
            }
        })

    
    
    

    

    // check 

    // const trans = {

    //     type: "transfer",
    //     src_account_id: 4097,
    //     src_initial_balance: 4700,
    //     des_account_id: 1234567890,
    //     des_acc_id: 7582983660,
    //     des_initial_balance: 4200,
    //     amount: 500,
    //     fee: 0,
    //     src_remain_balance: 4500,
    //     des_remain_balance: 4300

    // }
    // controller.insertTransaction(trans).then((response) => {
    //     res.send(response)
    // })

})
app.get("/transaction/:id", (req, res) => {
    controller.getTransactionInfo(req.params.id).then((transaction_id) => {
            res.send(transaction_id)
        })
})

app.listen(3000, () => {
    console.log("app listen port 3000")
})
