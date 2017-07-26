const model = require('../Model')
module.exports = {
    getAccountInfo: (account_id) => {
        return model.account.findAll({ id: account_id })
    },

    getNameSurnameID: (account_id) =>{
        return model.account.findOne({
            where: {account_id: account_id},
            attributes: ['id', ['name', 'title']]
        })
    },

    insertAccount: (account) => {
        return model.account.create(account)
    }


}