const model = require('../Model')
const account = require('./account')

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
            id: 1
        }
    })
}


function checkAccountExist(account_id) {
    
    return model.account.findAll({
        where: {
            account_id: account_id
        }
        }).then((account)=>{
            if( !(account.length === 0) ){
                return true
            }else{
                return false
            }
        })
    
}
<<<<<<< HEAD


function checkLimitBalance(account_id) {
    const limit = 5000
    // var acc = model.transaction.findAll({
    //     where: {
    //         destinationAccountID: account_id
    //     }

    // })
    // var sum = acc.destinationInitialBalance + acc.amount
    // return (limit - sum) < 0 ? false : true

    return model.transaction.findAll({
        where: {
            destinationAccountID: account_id
        }
        }).then((transaction)=>{
           let sum = destinationInitialBalance + amount
           if (limit - sum < 0){
               return false
           }else{
               return true
           }
        })
}

function insertTransaction(transactionobj) {
    return model.sequelize.transaction((t) => {
        return model.transaction.create(transactionobj, { transaction: t })
            .then((result) => {
                p1 = account.updateAccountBalance2("1233")
                p2 = account.updateAccountBalance2("1222")
                Promise.all([p1, p2]).then(values => {
                    return values
                }).catch(error => {
                    throw new error.toString()
                })
            })
    }).then((result) => {
        return result
    }).catch((error) => {
        console.log(error.toString())
    })
}
=======
>>>>>>> 69514263fb73569825cab695d0ca40c4f678c855

function insertTransaction(transactionObj) {
    let resultTran
    return model.sequelize.transaction((t) => {
        return model.transaction.create(transactionObj, { transaction: t })
            .then(result => {
                resultTran = result.dataValues
                return model.account.update({  //source accout
                    balance: resultTran.src_remain_balance
                },
                    {
                        where: { account_id: resultTran.src_account_id }
                    }, { transaction: t })
                    .then(result => {
                        return model.account.update({ //dest account
                            balance: resultTran.des_remain_balance
                        },
                            {
                                where: { account_id: resultTran.des_account_id }
                            })
                    }, { transaction: t })
                    .then((result) => {
                        console.log("--------------------------")
                        console.log(resultTran)
                        return result
                    })
                    .catch((error) => {
                        throw error
                    })

            })
    })
}
// p1 = account.updateAccountBalance("1233")
// p2 = account.updateAccountBalance("1222")
// Promise.all([p1, p2]).then(values => {
//     return values
// }).catch(error => {
//     throw new error.toString()
// })
module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist,
    insertTransaction,
    checkLimitBalance
}