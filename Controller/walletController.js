const model = require('../Model')

function getAccountInfo(account_id, attributes) {
    return model.account.findAll({
        where: {
            account_id: account_id
        },
        attributes: attributes
    })
}

function insertAccount(account) {
    return model.account.create(account)
}

function getTransactionInfo(transaction_id) {
    return model.transaction.findAll({
        where: {
            id: 1
        }
    })
}


 function checkAccountExist(account_id) {
    
    return model.account.findAll({
        where: {
            account_id: account_id
        }
        }).then((account)=>{
            if( !(account.length === 0) ){
                return true
            }else{
                return false
            }
        })
    
}


module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist
}