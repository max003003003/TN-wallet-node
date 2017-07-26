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
        return model.account.create(account)
    },

    checkLimitBalance: (account_id) =>{
        var acc = model.account.findOne({
            where:{
                destinationAccountID: account_id
            }
            
        })
        var sum = acc.destinationInitialBalance + acc.amount
        var result = 5000 - sum
        if (result < 0)
            return false
        return true
    }
}