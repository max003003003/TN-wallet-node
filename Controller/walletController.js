const model = require('../Model')

<<<<<<< HEAD
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
=======
    insertAccount: (account) => {
        return model.account.bulkCreate(account)
    },
>>>>>>> a54e81df1325a5ef53f8631a59063124d2d8aa5d

function getTransactionInfo(transaction_id) {
    return model.transaction.findAll({
        where: {
            id: 1
        }
    })
}

async function checkAccountExist(account_id) {
    var ac = await model.account.findAll({
        where: {
            account_id: account_id
        }
    })
    return ac.length === 0 ? false : true
}


module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist
}