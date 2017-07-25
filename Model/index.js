const Sequelize = require('sequelize')
 
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,{
            host: process.env.DB_HOST,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }})

var account_model = sequelize.import('./accountModel')
var transaction_model = sequelize.import('./transactionModel')
var db ={
  
 sequelize : sequelize,
 Sequelize : Sequelize,
 createTable: ()=>{
      account_model.sync({ force: true})
      transaction_model.sync({force: true})
 }
 
 
}
db[account_model.name] = account_model
db[transaction_model.name] = transaction_model


module.exports= db