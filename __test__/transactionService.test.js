require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()
var walletController = require('../Controller/walletController')
var transactionService = require('../Controller/transactionService');
const model = require('../Model')

describe('testInsertTransactionInstance', function(){
    it("should succesfully insert a transaction instance", async ()=>{
        var result = await transactionService.insertTransactionInstance()
        expect(Number.isInteger(result.dataValues.id)).toBe(true)
        transactionService.deleteTransactionsInstance(result.dataValues.id)
    })
})

describe('testUpdateTransactionsInstance',function(){
    it("should succesfully update the transaction status", async ()=>{
        const dummy = {
            type: "transfer",
            src_account_id: 8888888881,
            src_initial_balance: 1000,
            des_account_id: 8888888882,
            des_initial_balance: 1000,
            amount: 500,
            fee: 0.0,
            src_remain_balance: 500,
            des_remain_balance: 1500
        }
        var newTransaction = await transactionService.insertTransactionInstance(dummy)
        var result = await transactionService.updateTransactionsInstance(newTransaction.dataValues.id,"SUCCESS")
        expect(result).toEqual([1])
        transactionService.deleteTransactionsInstance(newTransaction.dataValues.id)
    })
})

describe('testDeleteTransactionInstance', function(){
    it('should successfully delete a success transaction and the related GL ', async ()=>{
        const dummy = {
            type: "topup",
            src_account_id: 9999999991,
            src_initial_balance: 1000,
            des_account_id: 9999999992,
            des_initial_balance: 1000,
            amount: 500,
            fee: 0.0,
            src_remain_balance: 500,
            des_remain_balance: 1500
        }
        var newTransaction = await transactionService.insertTransactionInstance(dummy)
        var result = await transactionService.deleteTransactionsInstance(newTransaction.dataValues.id)
        console.log(result)
        expect(result).toBe(1)
    })
})

describe('testsUpdateAccount',function(){
    it("should succesfully update both accounts",async ()=>{
        var result = await transactionService.updateAccount(8888888881,900,8888888882,1100)
        expect(result).toEqual([[1],[1]])
        await transactionService.updateAccount(8888888881,1000,8888888882,1000)
    })
})



