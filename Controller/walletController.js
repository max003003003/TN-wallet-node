const model = require('../Model')
module.exports = {
<<<<<<< HEAD
    getAccountInfo: (account_id) => {
        return model.account.findAll({ id: account_id })
    },

    getNameSurnameID: (account_id) =>{
        return model.account.findOne({
            where: {account_id: account_id},
            attributes: ['name']
=======
    getAccountInfo: (account_id,attributes) =>{
        return model.account.findAll({
            where : {
                account_id: account_id
            },
            attributes : attributes
>>>>>>> 28f83f5ba3ae43977b15ab718df39f4b3bd4c11c
        })
    },

    insertAccount: (account) => {
        return model.account.create(account)
    }


}