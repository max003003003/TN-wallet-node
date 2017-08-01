module.exports = function (sequelize, DataTypes) {
    const bank = sequelize.define('tb_bank', {
        bank_id: {
            type: DataTypes.STRING(3),
            primaryKey: true
        },
        bank_model: {
            type: DataTypes.STRING,
            require: true
        },
        

    })
    return bank
}
