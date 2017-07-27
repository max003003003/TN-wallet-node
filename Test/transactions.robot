*** Settings ***
Library    RequestsLibrary
Library    Collections
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Get transactions success
    Create Session    TN-wallet-node    ${URL}
    ${resp}=    Get Request    TN-wallet-node    /transactions/1
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Key    ${resp.json()[0]}    id
    Dictionary Should Contain Key    ${resp.json()[0]}    type
    Dictionary Should Contain Key    ${resp.json()[0]}    src_account_id
    Dictionary Should Contain Key    ${resp.json()[0]}    src_initial_balance
    Dictionary Should Contain Key    ${resp.json()[0]}    des_account_id
    Dictionary Should Contain Key    ${resp.json()[0]}    des_initial_balance
    Dictionary Should Contain Key    ${resp.json()[0]}    amount
    Dictionary Should Contain Key    ${resp.json()[0]}    fee
    Dictionary Should Contain Key    ${resp.json()[0]}    src_remain_balance
    Dictionary Should Contain Key    ${resp.json()[0]}    des_remain_balance
    Dictionary Should Contain Key    ${resp.json()[0]}    transaction_timestamp
    Dictionary Should Contain Key    ${resp.json()[0]}    createdAt
    Dictionary Should Contain Key    ${resp.json()[0]}    updatedAt

