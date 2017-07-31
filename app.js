const config = require('dotenv').config()
const express = require('express')
const app = express()
const model = require('./Model')
const bodyParser = require('body-parser');
const controller = require('./Controller/walletController')
var morgan = require('morgan')

const errorMsg = [
    "source account doesn't exist",
    "destination account doesn't exist",
    "source account doesn't have enough balance",
    "destination account balance exceed limit"
]
app.use(morgan('dev'));
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

    const account = [{
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
    },
    {
        account_id: 1111111111,
        name: "Top",
        surname: "Up",
        citizen_id: "1111111111",
        email: "1111111111@gmail.com",
        tel: "1111111111",
        username: "Top.Up",
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
    controller.getAccountInfo(req.params.id, ['account_id', 'name', 'surname', 'balance']).then((accounts) => {
        res.send(accounts)
    })
})

app.get("/accounts", (req, res) => {
    controller.getAccountInfo(null, ['account_id', 'name', 'surname', 'balance']).then((accounts) => {
        res.send(accounts)
    })
})

app.get("/balances/:id", (req, res) => {
    controller.getAccountInfo(req.params.id, ['account_id', 'balance']).then((accounts) => {
        res.send(accounts)
    })
})
app.post("/transactions", (req, res) => {
    console.log("/transactions")
    var type = req.body.type
    var des_acc_id = req.body.des_acc_id
    var des_initial_balance = Number(req.body.des_initial_balance)
    var amount = Number(req.body.amount)
    var fee = 0
    var src_remain_balance
    var des_remain_balance = Number(req.body.des_remain_balance)
    var src_initial_balance
    var src_acc_id
    var checkArray = []
    if (type == "topup") {
        src_initial_balance = amount
        src_acc_id = 1111111111
        src_remain_balance = 0
        checkArray = [
            controller.checkAccountExist(des_acc_id),
            controller.checkLimitBalance(des_acc_id, amount)
        ]
    }
    else if (type == "transfer") {
        src_initial_balance = Number(req.body.src_initial_balance)
        src_remain_balance = Number(req.body.src_remain_balance)
        src_acc_id = req.body.src_acc_id
        checkArray = [
            controller.checkAccountExist(des_acc_id),
            controller.checkLimitBalance(des_acc_id, amount),
            controller.checkAccountExist(src_acc_id),
            controller.checkLimitBalance(src_acc_id, amount)
        ]
    } else {
        return res.status(400).send({
            error: {
                message: "transaction type error"
            }
        })
    }

    var local_src_remain_balance = src_initial_balance - amount
    var local_des_remain_balance = des_initial_balance + amount

    // calculate transfer
    if ((type != "topup" && local_src_remain_balance != src_remain_balance) || local_des_remain_balance != des_remain_balance) {
        return res.status(400).send({
            error: {
                message: "invalid remaining balance"
            }
        })
    }

    Promise.all(checkArray)
        .then((result) => {
            retError = []
            console.log(result)
            result.map((isPass, index) => {
                console.log(isPass, index)
                if (!isPass) retError.push(errorMsg[index])
            })
            if (retError.length != 0) {
                return res.status(400).json({
                    error: {
                        messege: retError
                    }
                })
            }
            // can transfer
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
            controller.insertTransaction(trans).then((result) => {
                res.json({ transaction_id: result })
            })
                .catch((err) => {
                    res.status(500).json({
                        error: {
                            message: err.message
                        }
                    })
                })

        })
        .catch((reason) => {
            res.status(400).send(reason)
        })

})

app.get("/transactions/:id", (req, res) => {
    controller.getTransactionInfo(req.params.id).then((transaction_id) => {
        res.send(transaction_id[0])
    })
})











app.listen(3000, () => {
    console.log("app listen port 3000")
})