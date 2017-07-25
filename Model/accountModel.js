 module.exports = function(sequelize, DataTypes){
        const account = sequelize.define('account',{
            name: DataTypes.STRING
        })

        
        return account
 }