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

function insertTransaction(transactionObj){
    account.insertTransactionInstance(transactionObj)
    .then((success)=>{
        console.log("------------------")
        console.log(success)
    })
    .catch((error)=>{
             console.log("------------------")
        console.log(error)
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