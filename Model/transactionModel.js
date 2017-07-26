<<<<<<< HEAD
module.exports = function (sequelize, DataTypes) {
    const transaction = sequelize.define('tb_transaction', {
        type: {
            type: DataTypes.STRING,
            require: true
        },
        src_account_id: {
            type: DataTypes.INTEGER(10),
            require: true
        },
        src_initial_balance: {
            type: DataTypes.DOUBLE,
            require: true
        },
        des_account_id: {
            type: DataTypes.INTEGER(10),
            require: true
        },
        des_initial_balance: {
            type: DataTypes.DOUBLE,
            require: true
        },
        amount: {
            type: DataTypes.DOUBLE,
            require: true
        },
        fee: {
            type: DataTypes.DOUBLE,
            require: true,
            defaultValue: 0.00
        },
        src_remain_balance: {
            type: DataTypes.DOUBLE,
            require: true
        },
        des_remain_balance: {
            type: DataTypes.DOUBLE,
            require: true
        },
        transaction_timestamp: {
            type: DataTypes.DATE,
            require: true
        }
    })
    return transaction
}
=======
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
>>>>>>> 312b40bdd04f0fba56b5b30a82e7ca4d667f5736
