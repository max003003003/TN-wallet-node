const model = require('../Model')
const GLService={
    createForTransactionTransferTo: (amount, SourceId, transactionId)=>{
      return {
        Debit:{
          Action: 'Saving',
          Amount: amount,
          Type: 'L'
        },
        Credit:{
          Action: 'Cash',
          Amount: amount,
          Type: 'A'
        },
        SourceId: SourceId,
        TransactionId: transactionId
      }
    },
    createForTransactionRecieveFrom: (amount, DestinationId, transactionId)=>{
      return {
        Debit:{
          Action: 'Cash',
          Amount: amount,
          Type: 'A'
        },
        Credit:{
          Action: 'Saving',
          Amount: amount,
          Type: 'L'
        },
        DestinationId: DestinationId,
        TransactionId: transactionId
      }
    },
    checkBalanceforGL: (GLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)=> {
      let DebitAmount = GLobjectTransactionTransferTo.Debit.Amount + GLobjectTransactionRecieveFrom.Debit.Amount;
      let CreditAmount = GLobjectTransactionTransferTo.Credit.Amount + GLobjectTransactionRecieveFrom.Credit.Amount;
      if (DebitAmount == CreditAmount) {
        return true;
      }
      return false;
    },
    insertGL: ()=>{}

}

module.exports = GLService
