var GLService = require('../Controller/GLService')

describe('testcreateForTransactionTransferTo', function(){
    it("should succesfully createForTransactionTransferTo object", ()=>{
        inputamount = 500;
        inputSourceId = 1111111111;
        inputtransactionId = '001';
        var expectedresult = {
          Debit:{
            Action: 'Saving',
            Amount: 500,
            Type: 'L'
          },
          Credit:{
            Action: 'Cash',
            Amount: 500,
            Type: 'A'
          },
          SourceId: 1111111111,
          TransactionId: '001'
        };
        var result = GLService.createForTransactionTransferTo(inputamount, inputSourceId, inputtransactionId)
        expect(result).toEqual(expectedresult)
    })
})

describe('testcreateForTransactionRecieveFrom', function(){
    it("should succesfully createForTransactionRecieveFrom object", ()=>{
        inputamount = 500;
        inputDestinationId = 1234567890;
        inputtransactionId = '001';
        var expectedresult = {
          Debit:{
            Action: 'Cash',
            Amount: 500,
            Type: 'A'
          },
          Credit:{
            Action: 'Saving',
            Amount: 500,
            Type: 'L'
          },
          DestinationId: 1234567890,
          TransactionId: '001'
        };
        var result = GLService.createForTransactionRecieveFrom(inputamount, inputDestinationId, inputtransactionId)
        expect(result).toEqual(expectedresult)
    })
})

describe('testcheckBalanceforGL', function(){
    it("should succesfully checkBalanceforGL", ()=>{
        var inputGLobjectTransactionTransferTo = {
          Debit:{
            Action: 'Saving',
            Amount: 500,
            Type: 'L'
          },
          Credit:{
            Action: 'Cash',
            Amount: 500,
            Type: 'A'
          },
          SourceId: 1111111111,
          TransactionId: '001'
        };
        var GLobjectTransactionRecieveFrom = {
          Debit:{
            Action: 'Cash',
            Amount: 500,
            Type: 'A'
          },
          Credit:{
            Action: 'Saving',
            Amount: 500,
            Type: 'L'
          },
          DestinationId: 1234567890,
          TransactionId: '001'
        };
        var result = GLService.checkBalanceforGL(inputGLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)
        expect(result).toBe(true)
    })
})
