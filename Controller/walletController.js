const model = require('../Model')
const transactionService = require('./transactionService')

function getAccountInfo(account_id, attributes) {
    var query = {
    }
    if (account_id != null) {
        query.where = { account_id: account_id }
    }
    query.attributes = attributes
    return model.account.findAll(query)
}

function insertAccount(account) {
    return model.account.bulkCreate(account)
}

function insertTransactionDefault(transaction) {
    return model.transaction.bulkCreate(transaction)
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
    return model.account.findAll({
        where: {
            account_id: account_id
        },
        attributes: ['balance']
    }).then((balance) => {
        // console.log(balance[0].dataValues.balance,amount,limit)
        return balance[0].dataValues.balance + amount <= limit

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

async function insertTransaction2(transactionObj) {
    currentTransaction = await transactionService.insertTransactionInstance(transactionObj)
    let transferResult = await transferFund(currentTransaction.dataValues)
    if(transferResult[0][0] && transferResult[1][0]){
       let transactionResult = await transactionService.updateTransactionsInstance(currentTransaction.dataValues.id, "SUCCESS")
       console.log("transactionResult",transactionResult) 
       if(transactionResult[0]) return currentTransaction.dataValues.id
       throw new Error("transfer log error")    
    }
    throw new Error("transfer failed")

    
                        
    
   
}
function transferFund(transaction){
    return Promise.all([
        transactionService.updateAccount(transaction.src_account_id, transaction.src_remain_balance),
        transactionService.updateAccount(transaction.des_account_id, transaction.des_remain_balance)
    ]) 

}

module.exports = {
    getAccountInfo,
    insertAccount,
    insertTransactionDefault,
    getTransactionInfo,
    checkAccountExist,
    checkEnoughBalance,
    insertTransaction,
    checkLimitBalance,
    checkEnoughBalance,
    insertTransaction2
}