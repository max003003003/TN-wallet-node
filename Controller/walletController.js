const model = require('../Model')
module.exports = {
    getAccountInfo: (account_id)=>{
    return model.account.findAll({id:account_id})
       
    }
}