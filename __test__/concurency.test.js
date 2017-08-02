require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()

var walletController = require('../Controller/walletController');
var transactionService = require('../Controller/transactionService')
const model = require('../Model')

describe.skip('testInsertTransaction', function () {
    it('transfer at the same time', async () => {
        const trans = {
            type: "transfer",
            src_account_id: 1888888883,
            src_initial_balance: 1000,
            des_account_id: 2888888884,
            des_initial_balance: 500,
            amount: 100,
            fee: 0.0,
            src_remain_balance: 900,
            des_remain_balance: 600
        }
        const trans1 = {
            type: "transfer",
            src_account_id: 3888888883,
            src_initial_balance: 1000,
            des_account_id: 2888888884,
            des_initial_balance: 600,
            amount: 100,
            fee: 0.0,
            src_remain_balance: 900,
            des_remain_balance: 700
        }
        const trans2 = {
            type: "transfer",
            src_account_id: 1888888885,
            src_initial_balance: 1000,
            des_account_id: 2888888884,
            des_initial_balance: 700,
            amount: 100,
            fee: 0.0,
            src_remain_balance: 900,
            des_remain_balance: 800
        }
        const trans3 = {
            type: "transfer",
            src_account_id: 5888888885,
            src_initial_balance: 1000,
            des_account_id: 2888888884,
            des_initial_balance: 800,
            amount: 100,
            fee: 0.0,
            src_remain_balance: 900,
            des_remain_balance: 900
        }
        const testsSuits = [trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,
            trans, trans1, trans2, trans3,


        ]
        let result = []
        console.log('------------------------')

        testsSuits.map((test) => {
            walletController.transferFund(test).then((v) => {
                result.push({ test: test, result: v })

            })
        })

        await setTimeout(() => { console.log(result) }, 10000)

        // var result = await walletController.transferFund(trans)
        // var result1 = await walletController.transferFund(trans1)
        // var result2 = await walletController.transferFund(trans2)
        // var result3 = await walletController.transferFund(trans3)
        // console.log("---------------------------------")
        // console.log(result, result1, result2, result3)
        //   console.log(result)

        // transactionService.deleteTransactionsInstance(result)
        // transactionService.deleteTransactionsInstance(result1)
        // transactionService.deleteTransactionsInstance(result2)
        // transactionService.deleteTransactionsInstance(result3)
    })
})