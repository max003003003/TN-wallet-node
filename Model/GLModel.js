module.exports = function (sequelize, DataTypes) {
    const GL = sequelize.define('tb_GL', {
        dr_action: {
            type: DataTypes.STRING,
            require: true
        },
        dr_amount: {
            type: DataTypes.DOUBLE,
            require: true
        },
        dr_type: {
            type: DataTypes.STRING(10),
            require: true
        },
        cr_action: {
            type: DataTypes.STRING,
            require: true
        },
        cr_amount: {
            type: DataTypes.DOUBLE,
            require: true
        },
        cr_type: {
            type: DataTypes.STRING(10),
            require: true
        }
        
    })
    return GL
}
