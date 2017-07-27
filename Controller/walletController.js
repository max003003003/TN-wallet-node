const model = require('../Model')
const transactionService = require('./transactionService')

function getAccountInfo(account_id, attributes) {
    return model.account.findAll({
        where: {
            account_id: account_id
        },
        attributes: attributes
    })
}

function insertAccount(account) {
    return model.account.bulkCreate(account)
}

function getTransactionInfo(transaction_id) {
    return model.transaction.findAll({
        where: {
            id: transaction_id
        }
    })
}


function checkAccountExist(account_id) {

    return model.account.findAll({
        where: {
            account_id: account_id
        }
    }).then((account) => {
        if ((account.length === 0)) {
            return false
        } else {
            return true
        }
    })

}
function checkEnoughBalance(account_id, amount) {

    return model.account.findAll({
        where: {
            account_id: account_id
        },
        attributes: ['balance']
    }).then((balance) => {
        if (balance[0].dataValues.balance >= amount) return true
        else return false
    })
}

function checkLimitBalance(account_id, amount) {
    const limit = 5000
    // var acc = model.transaction.findAll({
    //     where: {
    //         destinationAccountID: account_id
    //     }

    // })
    // var sum = acc.destinationInitialBalance + acc.amount
    // return (limit - sum) < 0 ? false : true

    return model.account.findAll({
        where: {
            account_id: account_id
        }
    }).then((account) => {
        let sum = account.balance + amount
        if (limit - sum < 0) {
            return false
        } else {
            return true
        }
    })
}

function insertTransaction(transactionObj, res) {
    transactionService.insertTransactionInstance(transactionObj)
        .then((success) => {
            const transaction = success.dataValues
            Promise.all([
                transactionService.updateAccount(transaction.src_account_id, transaction.src_remain_balance)
            ])
                .then((result) => {
                    console.log("-------SUCCESS-----------")
                    console.log(result)
                    transactionService.updateTransactionsInstance(transaction.id, "SUCCESS")
                        .then((result) => {
                            res.send(transaction)
                            return transaction
                        })
                })
                .catch((error) => {
                    console.log("-------ERROR-----------")
                    console.log(error)
                    transactionService.updateTransactionsInstance(transaction.id, "ERROR")
                        .then((result) => {
                            res.send("error")
                            return "error"
                        })
                })
        })
        .catch((error) => {
            console.log("-------ERROR TRANS-----------")
            console.log(error)
            res.send("error")
            return "insert transaction faild"
        })
}
// function insertTransaction(transactionObj) {
//     let resultTran
//     return model.sequelize.transaction ( t => {
//         return model.transaction.create(transactionObj, { transaction: t })
//             .then( result => {
//                 resultTran = result.dataValues
//                 return model.account.update({ //source accout
//                     balance: resultTran.src_remain_balance
//                 },
//                     {
//                         where: { account_id: resultTran.src_account_id }
//                     }, { transaction: t })
//                     .then(result => {
//                         return model.account.update({ //dest account
//                             balance: resultTran.des_remain_balance
//                         },
//                             {
//                                 where: { i: resultTran.des_account_id }
//                             })
//                     }, { transaction: t })
//                     .then((result) => {  //transaction 
//                         return resultTran
//                     })
//                     .catch((error) => {
//                     })
//             })
//     })
// }
module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist,
    insertTransaction,
    checkEnoughBalance,
    checkLimitBalance
}