var GLService = require('../Controller/GLService')
const model = require('../Model')
let deleteGL = (transacID) => {
  return model.sequelize.transaction((t1) => {
    return model.sequelize.Promise.all([
      model.GL.destroy({
        where: {
          transaction_ID: transacID
        }
      }, { transaction: t1 })
    ])
  })
}

describe('testGetGL', function () {
  it('should get all GL', async () => {
      // inputAmount = 500;
      // inputSourceId = 1111111111;
      // inputTransactionId = '001';
      // inputBankId = '001'
      // var expectedResult = {
      //   dr_action: 'Saving',
      //   dr_amount: 500,
      //   dr_type: 'L',
      //   cr_action: 'Cash',
      //   cr_amount: 500,
      //   cr_type: 'A',
      //   account_ID: 1111111111,
      //   transaction_ID: '001',
      //   bank_ID: '001'
      // };
      // var res = await GLService.createForTransactionTransferTo(inputAmount, inputSourceId, inputTransactionId, inputBankId)
      var result = await GLService.getGL()
      // console.log("++++++++++++++++++++", result)
      expect(result.length > 0).toBe(true)
      // deleteGL(res.transaction_ID)
    })
  })

  describe('testcreateForTransactionTransferTo', function () {
    it("should succesfully createForTransactionTransferTo object", () => {
      inputAmount = 500;
      inputSourceId = 1111111111;
      inputTransactionId = '001';
      inputBankId = '001'
      var expectedResult = {
        dr_action: 'Saving',
        dr_amount: 500,
        dr_type: 'L',
        cr_action: 'Cash',
        cr_amount: 500,
        cr_type: 'A',
        account_ID: 1111111111,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.createForTransactionTransferTo(inputAmount, inputSourceId, inputTransactionId, inputBankId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('testcreateForTransactionRecieveFrom', function () {
    it("should succesfully createForTransactionRecieveFrom object", () => {
      inputAmount = 500;
      inputDestinationId = 1234567890;
      inputTransactionId = '001';
      inputBankId = '001'
      var expectedResult = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',
        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L',
        account_ID: 1234567890,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.createForTransactionRecieveFrom(inputAmount, inputDestinationId, inputTransactionId, inputBankId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('testcheckBalanceforGL', function () {
    it("should succesfully checkBalanceforGL", () => {
      var inputGLobjectTransactionTransferTo = {
        dr_action: 'Saving',
        dr_amount: 500,
        dr_type: 'L'
        ,
        cr_action: 'Cash',
        cr_amount: 500,
        cr_type: 'A'
        , account_ID: 1111111111,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var GLobjectTransactionRecieveFrom = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',

        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L'
        ,
        account_ID: 1234567890,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.checkBalanceforGL(inputGLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)
      expect(result).toBe(true)
    })
    it('should return false', () => {
      var inputGLobjectTransactionTransferTo = {
        dr_action: 'Saving',
        dr_amount: 500,
        dr_type: 'L'
        ,
        cr_action: 'Cash',
        cr_amount: 400,
        cr_type: 'A'
        , account_ID: 1111111111,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var GLobjectTransactionRecieveFrom = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',

        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L'
        ,
        account_ID: 1234567890,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.checkBalanceforGL(inputGLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)
      expect(result).toBe(false)
    })
  })

  describe('testCreateFeeForTransactionTransferTo', function () {
    it("should succesfully CreateFeeForTransactionTransferTo object", () => {
      inputFee = 20;
      inputSourceId = 1111111111;
      inputTransactionId = '001';
      inputBankId = '001'
      var expectedResult = {
        dr_action: 'Saving',
        dr_amount: 20,
        dr_type: 'L',
        cr_action: 'Cash',
        cr_amount: 20,
        cr_type: 'A',
        account_ID: 1111111111,
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.createFeeForTransactionTransferTo(inputFee, inputSourceId, inputTransactionId, inputBankId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('testCreateFeeForTransactionRecieveFrom', function () {
    it("should succesfully CreateFeeForTransactionRecieveFrom object", () => {
      inputFee = 20;
      inputDestinationId = '001';
      inputTransactionId = '001';
      inputBankId = '001'
      var expectedResult = {
        dr_action: 'Cash',
        dr_amount: 20,
        dr_type: 'A',
        cr_action: 'Fee',
        cr_amount: 20,
        cr_type: 'R',
        account_ID: '001',
        transaction_ID: '001',
        bank_ID: '001'
      };
      var result = GLService.createFeeForTransactionRecieveFrom(inputFee, inputDestinationId, inputTransactionId, inputBankId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('testInsertGL', function () {

    it('insertGL case fee = 20', async () => {
      const GLObject1 = {
        dr_action: 'Saving',
        dr_amount: 500,
        dr_type: 'L',
        cr_action: 'Cash',
        cr_amount: 500,
        cr_type: 'A',
        account_ID: 6999999993,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      const GLObject2 = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',
        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L',
        account_ID: 6999999994,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      const GLObject3 = {
        dr_action: 'Saving',
        dr_amount: 20,
        dr_type: 'L',
        cr_action: 'Cash',
        cr_amount: 20,
        cr_type: 'A',
        account_ID: 6999999993,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      const GLObject4 = {
        dr_action: 'Cash',
        dr_amount: 20,
        dr_type: 'A',
        cr_action: 'Fee',
        cr_amount: 20,
        cr_type: 'R',
        account_ID: '001',
        transaction_ID: '99999',
        bank_ID: '001'
      };
      // const trans = {
      //   type: "transfer",
      //   src_account_id: 6999999993,
      //   src_initial_balance: 1000,
      //   des_account_id: 6999999994,
      //   des_initial_balance: 1000,
      //   amount: 500,
      //   fee: 20.0,
      //   src_remain_balance: 480,
      //   des_remain_balance: 1500
      // }
      let res = await GLService.insertGL4(GLObject1, GLObject2, GLObject3, GLObject4)
      console.log('---------------------------------', res)
      expect(res.length).toBe(4)
      deleteGL('99999')



    })
    it('insertGL case fee = 0', async () => {
      const GLObject1 = {
        dr_action: 'Saving',
        dr_amount: 500,
        dr_type: 'L',
        cr_action: 'Cash',
        cr_amount: 500,
        cr_type: 'A',
        account_ID: 6999999993,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      const GLObject2 = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',
        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L',
        account_ID: 6999999994,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      let res = await GLService.insertGL2(GLObject1, GLObject2)
      console.log('---------------------------------', res)
      expect(res.length).toBe(2)
      deleteGL('99999')



    })
    it('insertGL case topup', async () => {
      const GLObject2 = {
        dr_action: 'Cash',
        dr_amount: 500,
        dr_type: 'A',
        cr_action: 'Saving',
        cr_amount: 500,
        cr_type: 'L',
        account_ID: 6999999994,
        transaction_ID: '99999',
        bank_ID: '001'
      };
      let res = await GLService.insertGL1(GLObject2)
      console.log('---------------------------------', res)
      expect(res.length).toBe(1)
      deleteGL('99999')



    })


  })
