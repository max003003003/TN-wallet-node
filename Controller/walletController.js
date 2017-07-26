const model = require('../Model')
const account = require('./account')
  
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
function  insertTransaction (transactionobj)  {
        return model.sequelize.transaction((t) => {
            return model.transaction.create(transactionobj, { transaction: t })
                .then((result) => {
                    p1 = account.updateAccountBalance2("1233")                    
                    p2 = account.updateAccountBalance2("1222")
                    Promise.all([p1, p2]).then(values => {
                        return values
                    }).catch(error => {
                            throw new error.toString()
                        })
                })
        }).then((result) => {
            return result
        }).catch((error) => {
            console.log(error.toString())
        })
    }


module.exports = {
    getAccountInfo,
    insertAccount,
    getTransactionInfo,
    checkAccountExist,
    insertTransaction
}