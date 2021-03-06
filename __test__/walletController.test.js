require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()

var walletController = require('../Controller/walletController');
var transactionService = require('../Controller/transactionService')
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

describe('testGetAccountInfo', function () {
    it('should return all accounts list when account_id is null', async () => {
        var result = await walletController.getAccountInfo(null, ['name', 'surname', 'balance'])
        expect(result.length > 0).toBe(true)
    })
    it('should succesfully get account name, surname and balance', async () => {
        var result = await walletController.getAccountInfo(8888888881, ['name', 'surname', 'balance'])
        expect(result[0].dataValues.name).toBe('unitTest')
        expect(result[0].dataValues.surname).toBe('Test')
        expect(result[0].dataValues.balance).toBe(1000)
    })
})

describe('testInsertAccount', function () {
    it('should succesfully insert accounts', async () => {
        const dummy = [{
            account_id: 7777777771,
            name: "unitTestForInsertAccount",
            surname: "Test",
            citizen_id: "1010101010101",
            email: "thanaporn@gmail.com",
            tel: "0860755482",
            username: "Oh.tnp",
            password: "12345A",
            balance: 5000.0,
            register_timestamp: '2017-07-25 09:29:00'
        }]
        var result = await walletController.insertAccount(dummy)
        expect(result[0].dataValues.account_id).toBe(7777777771)
        expect(result[0].dataValues.name).toBe("unitTestForInsertAccount")
        walletController.model.account.destroy(
            { where: { account_id: result[0].dataValues.account_id } }
        )
    })
})

describe('testTnsertBank', function () {
    it('should sucesfully insert bank(s)', async () => {
        const dummy = [{
            bank_id: "003",
            name: "MyDummyBank"
        }]
        var result = await walletController.insertBank(dummy)
        expect(result[0].dataValues.bank_id).toBe('003')
        walletController.model.bank.destroy(
            { where: { bank_id: '003' } }
        )
    })
})

describe('testGetTransactionInfo', function () {
    it('should succesfully get the required transaction', async () => {
        const trans = {
            type: "transfer",
            src_account_id: 8888888885,
            src_initial_balance: 1000,
            des_account_id: 8888888886,
            des_initial_balance: 1000,
            amount: 500,
            fee: 0.0,
            src_remain_balance: 500,
            des_remain_balance: 1500
        }
        var dummyTarnsaction = await transactionService.insertTransactionInstance(trans)
        var result = await walletController.getTransactionInfo(dummyTarnsaction.dataValues.id)
        expect(result[0].dataValues.id).toBe(dummyTarnsaction.dataValues.id)
        expect(result[0].dataValues.src_account_id).toBe('8888888885')
        expect(result[0].dataValues.des_account_id).toBe('8888888886')
        expect(result[0].dataValues.amount).toBe(500)
        transactionService.deleteTransactionsInstance(dummyTarnsaction.dataValues.id)
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

describe('testCheckDifferentAccount', function () {
    it('two account are different', async () => {
        var result = await walletController.checkDifferentAccount('1234567890', '1234567891')
        expect(result).toBe(true);

    })
    it('two account are same', async () => {
        var result = await walletController.checkDifferentAccount('1234567890', '1234567890')
        expect(result).toBe(false);

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

//Maybe change
describe('testInsertTransaction', function () {
    it('transfer success', async () => {
        const trans = {
            type: "transfer",
            src_account_id: 8888888883,
            src_initial_balance: 1000,
            des_account_id: 8888888884,
            des_initial_balance: 1000,
            amount: 500,
            fee: 0.0,
            src_remain_balance: 500,
            des_remain_balance: 1500
        }
        var result = await walletController.insertTransaction(trans)
        expect(Number.isInteger(result)).toBe(true)
        model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.transaction.destroy({ where: { id: result } }, { transaction: t1 }),
                model.GL.destroy({ where: { transaction_ID: result } }, { transaction: t1 })
            ])
        })
    })
    it('transfer failed', async () => {
        const trans = {
            type: "transfer",
            src_account_id: 1888888881,
            src_initial_balance: 1500,
            des_account_id: 2888888882,
            des_initial_balance: 500,
            amount: 500,
            fee: 0.0,
            src_remain_balance: 1000,
            des_remain_balance: 1000
        }
        var result = await walletController.insertTransaction(trans)
        expect(result).toBe("transfer failed")
        model.transaction.destroy({
            where: {
                src_account_id: 1888888881,
                src_initial_balance: 1500,
                des_account_id: 2888888882,
                des_initial_balance: 500,
                amount: 500,
            }
        })
    })
    it('transfer fee 20 success checkbalance success', async () => {
        const trans = {
            type: "transfer",
            src_account_id: 6999999993,
            src_initial_balance: 1000,
            des_account_id: 6999999994,
            des_initial_balance: 1000,
            amount: 500,
            fee: 20.0,
            src_remain_balance: 480,
            des_remain_balance: 1500
        }
        var result = await walletController.insertTransaction(trans)
        console.log('---------------------------------', result)
        expect(Number.isInteger(result)).toBe(true)
        model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.transaction.destroy({ where: { id: result } }, { transaction: t1 }),
                

            ])
        })
        deleteGL(result)



    })
})


describe('testInsertGL', function () {
    
    it('insertGL : fee is positive & transfer GL record successfully', async () => {
        let inputSrc_account_id = 6999999993;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 20;
        let inputType = 'transfer';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is positive : transfer GL record successfully')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is positive & transfer GL record fail', async () => {
        let inputSrc_account_id = null; //account that doesn't exist
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 20;
        let inputType = 'transfer';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is positive : transfer GL record fail')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is zero & topup GL record successfully', async () => {
        let inputSrc_account_id = 1111111111;// top up account
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 0;
        let inputType = 'topup';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is zero : topup GL record successfully')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is zero & topup GL record fail', async () => {
        let inputSrc_account_id = null;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 0;
        let inputType = 'topup';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is zero : topup GL record fail')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is zero & transfer GL record successfully', async () => {
        let inputSrc_account_id = 6999999993;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 0;
        let inputType = 'transfer';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is zero : transfer GL record successfully')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is zero & transfer GL record fail', async () => {
        let inputSrc_account_id = null;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 0;
        let inputType = 'transfer';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is zero : transfer GL record fail')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is negative record fail', async () => {
        let inputSrc_account_id = 6999999993;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = -20;
        let inputType = 'transfer';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is negative : record fail')
        deleteGL(inputTransaction_id)
    })

    it('insertGL : fee is zero & type not recognized GL record fail', async () => {
        let inputSrc_account_id = 6999999993;
        let inputDes_account_id = 6999999994;
        let inputAmount = 500;
        let inputTransaction_id = '99999';
        let inputbankID = '001';
        let inputFee = 0;
        let inputType = 'transfe';
        var result = await walletController.insertGL(inputSrc_account_id, inputDes_account_id, inputAmount, inputTransaction_id, inputbankID, inputFee, inputType)
        expect(result).toBe('fee is zero : type not recognized : GL record fail')
        deleteGL(inputTransaction_id)
    })
})


