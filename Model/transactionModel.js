 module.exports = function(sequelize, DataTypes){
        const transaction = sequelize.define('transaction',{
            type: DataTypes.STRING,
            sourceAcccountID: DataTypes.STRING,
            sourceInitialBalance: DataTypes.FLOAT,
            destinationAccountID: DataTypes.STRING,
            destinationInitialBalance: DataTypes.FLOAT,
            amount: DataTypes.FLOAT,
            fee: DataTypes.FLOAT,
            sourceRemainBalance: DataTypes.FLOAT,
            destinationRemainBalance: DataTypes.FLOAT
        })

        
        return transaction
 }