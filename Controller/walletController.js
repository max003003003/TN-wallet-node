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

    checkLimitBalance: async (account_id) =>{
        const limit = 5000
        var acc = await model.account.findOne({
            where:{
                destinationAccountID: account_id
            }
            
        })
        var sum = acc.destinationInitialBalance + acc.amount
        return (limit - sum) < 0 ? false : true
    }
}