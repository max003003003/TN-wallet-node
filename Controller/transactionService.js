const model = require('../Model')
const transactionService = {
    insertTransactionInstance: function (transactionObj) {
        return model.sequelize.transaction(function (t1) {
            return model.transaction.create(transactionObj, { transaction: t1 })
        })
    },

    updateTransactionsInstance: function (id,status) {
        return model.sequelize.transaction(function (t1) {
            return model.transaction.update({ transaction_status: status },
                { where: { id: id } }, { transaction: t1 }
            )
        })
    },
    updateAccount: function (accountId, balance) {
        return model.sequelize.transaction(function (t1) {
            return model.account.update({ balance: balance },
                { where: { account_id: accountId } }, { transaction: t1 })
        })
    }
}
module.exports = transactionService
