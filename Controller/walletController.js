const model = require('../Model')

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


module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist
}