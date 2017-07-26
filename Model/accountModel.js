module.exports = function (sequelize, DataTypes) {
    const account = sequelize.define('tb_user', {
        account_id: { type: DataTypes.INTEGER(10),
          autoIncrement: true,
          primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            require: true
        },
        surname: {
            type: DataTypes.STRING,
            require: true
        },
        citizen_id: {
            type: DataTypes.STRING(13),
            require: true
        },
        email:{
            type: DataTypes.STRING,
            require: true
        },
        tel:{
            type: DataTypes.STRING(10),
            require: true
        },
        username:{
            type: DataTypes.STRING,
            require: true
        },
        password:{
            type: DataTypes.STRING,
            require: true
        },
        balance:{
            type: DataTypes.DOUBLE,
            require: true,
            defaultValue: 0.00

        },
        register_timestamp : {
            type: DataTypes.DATE,
            require: true
        }


    })
    return account
}