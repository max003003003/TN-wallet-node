const model = require('../Model')
const GLService = {
    createForTransactionTransferTo: (amount, SourceId, transactionId) => {
        return {
            Debit: {
                Action: 'Saving',
                Amount: amount,
                Type: 'L'
            },
            Credit: {
                Action: 'Cash',
                Amount: amount,
                Type: 'A'
            },
            SourceId: SourceId,
            TransactionId: transactionId
        }
    },
    createForTransactionRecieveFrom: (amount, DestinationId, transactionId) => {
        return {
            Debit: {
                Action: 'Cash',
                Amount: amount,
                Type: 'A'
            },
            Credit: {
                Action: 'Saving',
                Amount: amount,
                Type: 'L'
            },
            DestinationId: DestinationId,
            TransactionId: transactionId
        }
    },
    checkBalanceforGL: (GLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom) => {
        let DebitAmount = GLobjectTransactionTransferTo.Debit.Amount + GLobjectTransactionRecieveFrom.Debit.Amount;
        let CreditAmount = GLobjectTransactionTransferTo.Credit.Amount + GLobjectTransactionRecieveFrom.Credit.Amount;
        if (DebitAmount == CreditAmount) {
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
