const model = require('../Model')
const GLService = {
    createForTransactionTransferTo: (amount, sourceId, transactionId) => {
        return {
            debit: {
                action: 'Saving',
                amount: amount,
                type: 'L'
            },
            credit: {
                action: 'Cash',
                amount: amount,
                type: 'A'
            },
            sourceId: sourceId,
            transactionId: transactionId
        }
    },
    createForTransactionRecieveFrom: (amount, destinationId, transactionId) => {
        return {
            debit: {
                action: 'Cash',
                amount: amount,
                type: 'A'
            },
            credit: {
                action: 'Saving',
                amount: amount,
                type: 'L'
            },
            destinationId: destinationId,
            transactionId: transactionId
        }
    },
    checkBalanceforGL: (GLObjectTransactionTransferTo, GLObjectTransactionRecieveFrom) => {
        let debitAmount = GLObjectTransactionTransferTo.debit.amount + GLObjectTransactionRecieveFrom.debit.amount;
        let creditAmount = GLObjectTransactionTransferTo.credit.amount + GLObjectTransactionRecieveFrom.credit.amount;
        if (debitAmount == creditAmount) {
            return true;
        }
        return false;
    },


    insertGL: (GLObject1, GLObject2) => {
        return model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.GL.create(GLObject1, { transaction: t1 }),
                model.GL.create(GLObject2, { transaction: t1 })
            ])
        })

    }

}

module.exports = GLService
