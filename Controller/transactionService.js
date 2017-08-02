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

    deleteTransactionsInstance: (id) => {
        return model.sequelize.transaction((t1) => {
            return model.transaction.destroy(
                { where: { id: id } }, { transaction: t1 }
            )
        })
    },

    updateAccount: (srcAccountId, srcBalance, destAccountId, destBalance) => {
        return model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.account.update({ balance: srcBalance },
                    { where: { account_id: srcAccountId } }, { transaction: t1 }),
                model.account.update({ balance: destBalance },
                    { where: { account_id: destAccountId } }, { transaction: t1 })
            ])
        }
        )
    }

}
module.exports = transactionService
