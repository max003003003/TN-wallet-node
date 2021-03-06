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

function checkDifferentAccount(src_acc_id, des_acc_id) {
    return new Promise((resolve, reject) => {
        resolve(src_acc_id != des_acc_id)
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
    let currentTransaction = await transactionService.insertTransactionInstance(transactionObj)
    let transferResult = await transferFund(currentTransaction.dataValues)
    console.log(transferResult)
    if (transferResult[0][0] && transferResult[1][0]) {
        let transactionResult = await transactionService.updateTransactionsInstance(currentTransaction.dataValues.id, "SUCCESS")

        await insertGL(currentTransaction.dataValues.src_account_id,
            currentTransaction.dataValues.des_account_id, currentTransaction.dataValues.amount, currentTransaction.dataValues.id,
            '001', transactionObj.fee, transactionObj.type)

        if (transactionResult[0]) return currentTransaction.dataValues.id
        //    throw new Error("transfer log error")
    }
    await transactionService.updateTransactionsInstance(currentTransaction.dataValues.id, "TRANSFER MONEY FAIL")


    // throw new Error("transfer failed")
    return "transfer failed"
    // throw new Error("transfer failed source result:" + transferResult[0][0] + " destination result:" + transferResult[1][0])
}
function transferFund(transaction) {
    return transactionService.updateAccount(transaction.src_account_id, transaction.src_remain_balance, transaction.des_account_id, transaction.des_remain_balance)
}
async function insertGL(src_account_id, des_account_id, amount, transaction_id, bankID, fee, type) {
    const GLObject1 = GLService.createForTransactionTransferTo(amount, src_account_id, transaction_id, bankID)
    const GLObject2 = GLService.createForTransactionRecieveFrom(amount, des_account_id, transaction_id, bankID)
    let checkDebitCreditBalanceGLobject12 = GLService.checkBalanceforGL(GLObject1, GLObject2)//problem if topup it only get dummy source account data
    if (fee === 0) {
        if (type === "topup") {
            if(checkDebitCreditBalanceGLobject12){
                //check balance success
                const GLObjects =[GLObject2]
                await GLService.insertGL(GLObjects)
                return "fee is zero : topup GL record successfully"
            }
            //check balance fail
            return "fee is zero : topup GL record fail"
            

        } else if (type === "transfer") {
            if(checkDebitCreditBalanceGLobject12){
                //check balance success
                const GLObjects = [GLObject1,GLObject2]
                await GLService.insertGL(GLObjects)
                return "fee is zero : transfer GL record successfully"
            }
            //check balance fail
            return "fee is zero : transfer GL record fail"

        }return "fee is zero : type not recognized : GL record fail"
    }
    else if (fee > 0) {
        const GLObject3 = GLService.createFeeForTransactionTransferTo(fee, src_account_id, transaction_id, bankID)
        const GLObject4 = GLService.createFeeForTransactionRecieveFrom(fee, des_account_id, transaction_id, bankID)
        let checkDebitCreditBalanceGLobject34 = GLService.checkBalanceforGL(GLObject3, GLObject4)
        if(checkDebitCreditBalanceGLobject12 && checkDebitCreditBalanceGLobject34){
            //check balance success
             const GLObjects = [GLObject1,GLObject2,GLObject3,GLObject4]
             await GLService.insertGL(GLObjects)
             return "fee is positive : transfer GL record successfully"
        }
        //check balance fail
        return "fee is positive : transfer GL record fail"
       
    }
    //fee negative will not try to record GL
    return "fee is negative : record fail"
}

module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist,
    checkDifferentAccount,
    checkEnoughBalance,
    insertTransaction,
    checkLimitBalance,
    insertBank,
    insertGL,
    model
}
