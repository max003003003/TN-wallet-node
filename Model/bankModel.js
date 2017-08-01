module.exports = function (sequelize, DataTypes) {
    const bank = sequelize.define('tb_bank', {
        bank_id: {
            type: DataTypes.STRING(3),
            primaryKey: true
        },
        dr_amount: {
            type: DataTypes.DOUBLE,
            require: true
        },
        

    })
    return bank
}
