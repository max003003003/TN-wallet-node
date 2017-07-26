const model = require('../Model')
module.exports = {
    getAccountInfo: (account_id,attributes) =>{
        return model.account.findAll({
            where : {
                account_id: account_id
            },
            attributes : attributes
        })
    },

    insertAccount: (account) => {
        return model.account.bulkCreate(account)
    },

    getTransactionInfo: (transaction_id) => {
        return model.transaction.findAll({
            where : {
                id: 1
            }
        })
    }


}