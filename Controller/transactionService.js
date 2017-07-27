const model = require('../Model')
const transactionService = {
    insertTransactionInstance: (transactionObj) => {
        return model.sequelize.transaction((t1) => {
            return model.transaction.create(transactionObj, { transaction: t1 })
        })
    },

    updateTransactionsInstance: (id, status) => {
        return model.sequelize.transaction((t1) => {
            return model.transaction.update({ transaction_status: status },
                { where: { id: id } }, { transaction: t1 }
            )
        })
    },

    updateAccount: (accountId, balance) => {
        return model.sequelize.transaction((t1) => {
            return model.account.update({ balance: balance },
                { where: { account_id: accountId } }, { transaction: t1 })
        })
    }
}
module.exports = transactionService
