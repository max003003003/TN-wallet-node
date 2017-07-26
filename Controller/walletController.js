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
    return model.account.create(account)
}

function getTransactionInfo(transaction_id) {
    return model.transaction.findAll({
        where: {
            id: 1
        }
    })
}

async function checkAccountExist(account_id) {
    var account = await model.account.findAll({
        where: {
            account_id: account_id
        }
    })
    return account.length === 0 ? false : true
}

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
    insertTransaction
}