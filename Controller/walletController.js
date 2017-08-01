const model = require('../Model')
const transactionService = require('./transactionService')
const GLService = require('./GLService')

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
function insertBank(bank) {
    return model.bank.bulkCreate(bank)
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

async function insertTransaction(transactionObj) {
    currentTransaction = await transactionService.insertTransactionInstance(transactionObj)
    let transferResult = await transferFund(currentTransaction.dataValues)
    if(transferResult[0][0] && transferResult[1][0]){
       let transactionResult = await transactionService.updateTransactionsInstance(currentTransaction.dataValues.id, "SUCCESS")
       if(transactionResult[0]) return currentTransaction.dataValues.id
    //    throw new Error("transfer log error")    
    }
<<<<<<< HEAD
    // throw new Error("transfer failed") 
    return "transfer failed"
=======
    throw new Error("transfer failed source result:" + transferResult[0][0] + " destination result:" + transferResult[1][0])
>>>>>>> 78fc15d381fcf6c6498a7f785af2bc6e9cf13857
}
function transferFund(transaction){
    return  transactionService.updateAccount(transaction.src_account_id,transaction.src_remain_balance,transaction.des_account_id,transaction.des_remain_balance)
}

module.exports = {
    getAccountInfo,
    insertAccount,
    insertTransactionDefault,
    getTransactionInfo,
    checkAccountExist,
    checkEnoughBalance,
    insertTransaction,
    checkEnoughBalance,
    checkLimitBalance,
    insertBank,
    model
}