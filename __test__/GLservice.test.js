var GLService = require('../Controller/GLService')

describe('testcreateForTransactionTransferTo', function(){
    it("should succesfully createForTransactionTransferTo object", ()=>{
        inputAmount = 500;
        inputSourceId = 1111111111;
        inputTransactionId = '001';
        var expectedResult = {
          debit:{
            action: 'Saving',
            amount: 500,
            type: 'L'
          },
          credit:{
            action: 'Cash',
            amount: 500,
            type: 'A'
          },
          sourceId: 1111111111,
          transactionId: '001'
        };
        var result = GLService.createForTransactionTransferTo(inputAmount, inputSourceId, inputTransactionId)
        expect(result).toEqual(expectedResult)
    })
})

describe('testcreateForTransactionRecieveFrom', function(){
    it("should succesfully createForTransactionRecieveFrom object", ()=>{
        inputAmount = 500;
        inputDestinationId = 1234567890;
        inputTransactionId = '001';
        var expectedResult = {
          debit:{
            action: 'Cash',
            amount: 500,
            type: 'A'
          },
          credit:{
            action: 'Saving',
            amount: 500,
            type: 'L'
          },
          destinationId: 1234567890,
          transactionId: '001'
        };
        var result = GLService.createForTransactionRecieveFrom(inputAmount, inputDestinationId, inputTransactionId)
        expect(result).toEqual(expectedResult)
    })
})

describe('testcheckBalanceforGL', function(){
    it("should succesfully checkBalanceforGL", ()=>{
        var inputGLobjectTransactionTransferTo = {
          debit:{
            action: 'Saving',
            amount: 500,
            type: 'L'
          },
          credit:{
            action: 'Cash',
            amount: 500,
            type: 'A'
          },
          sourceId: 1111111111,
          transactionId: '001'
        };
        var GLobjectTransactionRecieveFrom = {
          debit:{
            action: 'Cash',
            amount: 500,
            type: 'A'
          },
          credit:{
            action: 'Saving',
            amount: 500,
            type: 'L'
          },
          destinationId: 1234567890,
          transactionId: '001'
        };
        var result = GLService.checkBalanceforGL(inputGLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)
        expect(result).toBe(true)
    })
})
