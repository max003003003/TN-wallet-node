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
    return model.sequelize.transaction((t) => {
        return model.transaction.create(transactionObj, { transaction: t })
            .then(result => {
                const resultTran = result.dataValues
                return model.account.update({
                    balance: 99989999
                },
                    {
                        where: { account_id: 4097 }
                    }, { transaction: t })
                    .then(result => {
                        return model.account.update({
                            balance: 11111111
                        },
                            {
                                where: { account_id: 1234567890 }
                            })
                    }, { transaction: t })
                    .then((result) => {
                        console.log(result)
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