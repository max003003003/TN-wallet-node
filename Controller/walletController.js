const model = require('../Model')
module.exports = {
    getAccountInfo: (account_id)=>{
        return model.account.findAll({id:account_id})
    getBalance: (acount_id)=>{
        return model.account.findAll({})
    }
    hello: hello
    }
}