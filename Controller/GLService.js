require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()
const model = require('../Model')
const GLService = {
    getGL: () => {
        return model.GL.findAll({})
    },
    createForTransactionTransferTo: (amount, sourceId, transactionId, bankId) => {
        return {
            dr_action: 'Saving',
            dr_amount: amount,
            dr_type: 'L',
            cr_action: 'Cash',
            cr_amount: amount,
            cr_type: 'A',
            account_ID: sourceId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createForTransactionRecieveFrom: (amount, destinationId, transactionId, bankId) => {
        return {
            dr_action: 'Cash',
            dr_amount: amount,
            dr_type: 'A',
            cr_action: 'Saving',
            cr_amount: amount,
            cr_type: 'L',
            account_ID: destinationId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createFeeForTransactionTransferTo: (fee, sourceId, transactionId, bankId) => {
        return {
            dr_action: 'Saving',
            dr_amount: fee,
            dr_type: 'L',
            cr_action: 'Cash',
            cr_amount: fee,
            cr_type: 'A',
            account_ID: sourceId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createFeeForTransactionRecieveFrom: (fee, destinationId, transactionId, bankId) => {
        return {
            dr_action: 'Cash',
            dr_amount: fee,
            dr_type: 'A',
            cr_action: 'Fee',
            cr_amount: fee,
            cr_type: 'R',
            account_ID: bankId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    checkBalanceforGL: (GLObjectTransactionTransferTo, GLObjectTransactionRecieveFrom) => {
        let debitAmount = GLObjectTransactionTransferTo.dr_amount + GLObjectTransactionRecieveFrom.dr_amount;
        let creditAmount = GLObjectTransactionTransferTo.cr_amount + GLObjectTransactionRecieveFrom.cr_amount;
        let transferToAccountID = GLObjectTransactionTransferTo.account_ID;
        let recieveFromAccountID = GLObjectTransactionRecieveFrom.account_ID;
        if ((debitAmount === creditAmount)&& transferToAccountID!=null && recieveFromAccountID!=null ) {
            return true;
        }
        return false;
    },
    insertGL: (ArrayOfGLObject) => {
        return model.sequelize.transaction((t1) => {
            const operation = ArrayOfGLObject.map( obj =>  model.GL.create(obj, { transaction: t1 }))
            return model.sequelize.Promise.all(operation)
        })
    },


}
module.exports = GLService
