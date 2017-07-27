require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()

var walletController = require('../Controller/walletController');
const model = require('../Model')

describe('testAccountExists',function(){
    it('account exist', async ()=>{
        expect.assertions(1);
        await walletController.checkAccountExist('1234567890').then((result)=>{
            expect(result).toBe(true);
        })
    })
    it('account does not exist', async ()=>{
        expect.assertions(1);
        await walletController.checkAccountExist('5555555555').then((result)=>{
            expect(result).toBe(false);
        })
    })
})

describe('testAccountHasEnoughBalance',function(){
    it('account has enough balance', async ()=>{
        expect.assertions(1);
        await walletController.checkEnoughBalance('1234567890',0).then((result)=>{
            expect(result).toBe(true);
        })
    })
    it('account does not have enough balance', async ()=>{
        expect.assertions(1);
        await walletController.checkEnoughBalance('1234567890',6000).then((result)=>{
            expect(result).toBe(false);
        })
    })
})

describe('testAccountHasLimitBalance',function(){
    it('account can transfer', async ()=>{
        expect.assertions(1);
        await walletController.checkLimitBalance('1234567890',10).then((result)=>{
            expect(result).toBe(true);
        })
    })
    it('account cannot transfer', async ()=>{
        expect.assertions(1);
        await walletController.checkLimitBalance('1234567890',6000).then((result)=>{
            expect(result).toBe(false);
        })
    })
})