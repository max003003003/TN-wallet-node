const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 6000,
        min: 0,
        idle: 10000
    },
    timezone: 'Asia/Bangkok'
})

var account_model = sequelize.import('./accountModel')
var transaction_model = sequelize.import('./transactionModel')
var GL_model = sequelize.import('./GLModel')
var bank_model = sequelize.import('./bankModel')
 
var db = {
    account: account_model,
    transaction: transaction_model,
    GL: GL_model,
    bank: bank_model,
    sequelize: sequelize,
    Sequelize: Sequelize,
    createTable: () => {
        account_model.drop({ force: true })
        account_model.sync({ force: true })
        transaction_model.drop({ force: true })
        transaction_model.sync({ force: true })
        GL_model.drop({force:true})
        GL_model.sync({ force:true})
        bank_model.drop({force:true})
        bank_model.sync({force:true})
        
    }

}



module.exports = db
 