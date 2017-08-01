require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()

var walletController = require('../Controller/walletController');
var transactionService = require('../Controller/transactionService')
const model = require('../Model')

describe('testGetAccountInfo', function(){
    it('should succesfully get account name, surname and balance', async ()=> {
        var result = await walletController.getAccountInfo(8888888881,['name','surname','balance'])
        expect(result[0].dataValues.name).toBe('unitTest')
        expect(result[0].dataValues.surname).toBe('Test')
        expect(result[0].dataValues.balance).toBe(1000)
    })
})


describe('testAccountExists', function () {
    it('account exist', async () => {
        expect.assertions(1);
        await walletController.checkAccountExist('1234567890').then((result) => {
            expect(result).toBe(true);
        })
    })
    it('account does not exist', async () => {
        expect.assertions(1);
        await walletController.checkAccountExist('5555555555').then((result) => {
            expect(result).toBe(false);
        })
    })
})

describe('testAccountHasEnoughBalance', function () {
    it('account has enough balance', async () => {
        expect.assertions(1);
        await walletController.checkEnoughBalance('1234567890', 0).then((result) => {
            expect(result).toBe(true);
        })
    })
    it('account does not have enough balance', async () => {
        expect.assertions(1);
        await walletController.checkEnoughBalance('1234567890', 6000).then((result) => {
            expect(result).toBe(false);
        })
    })
})

describe('testLimitBalance', function () {
    it('account can transfer', async () => {
        expect.assertions(1);
        await walletController.checkLimitBalance('1234567890', 10).then((result) => {
            expect(result).toBe(true);
        })
    })
    it('account cannot transfer', async () => {
        expect.assertions(1);
        await walletController.checkLimitBalance('1234567890', 6000).then((result) => {
            expect(result).toBe(false);
        })
    })
})
//not done yet, internal functions are all passed Q:need to test this aggregate?

// describe('testInsertTransaction', function () {
//     it('transfer success', async () => {
//         const trans = {
//             type: "transfer",
//             src_account_id: 8888888881,
//             src_initial_balance: 5000,
//             des_account_id: 8888888882,
//             des_initial_balance: 4500,
//             amount: 500,
//             fee: 0.0,
//             src_remain_balance: 4500,
//             des_remain_balance: 5000
//         }
//         var result = await walletController.insertTransaction(trans)
//         expect(Number.isInteger(result)).toBe(true)
//         console.log(result)
//         console.log(transactionService.deleteTransactionsInstance(result))
//     })
// })
