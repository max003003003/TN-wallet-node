const model = require('../Model')
const account = {
 insertTransactionInstance: function(transactionObj) {
    return model.sequelize.transaction(function (t1) {
        return model.transaction.create(transactionObj, { transaction: t1 })
    })
},
updateAccount:function (accountId,balance) {
    return model.sequelize.transaction(function (t1) {
        return model.account.update({ balance: balance },
                    { where: { account_id: accountId } }, { transaction: t1 })
    })
}
}
module.exports = account
