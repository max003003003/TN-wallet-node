*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Get transactions success
    Create Session    TN-wallet-node    ${URL}
    ${resp}=    Get Request    TN-wallet-node    /transactions/1
    Transactions Should Contain    ${resp}    1    transfer    1234567890    200    9876543210    4700    200    0    0    4900

*** Keywords ***
Transactions Should Contain
    [Arguments]    ${resp}     ${id}    ${type}    ...
    ${src_account_id}    ${src_initial_balance}     ${des_account_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Item    ${resp.json()[0]}    id    ${id}
    Dictionary Should Contain Item    ${resp.json()[0]}    type    ${type}
    Dictionary Should Contain Item    ${resp.json()[0]}    src_account_id    ${src_account_id}
    Dictionary Should Contain Item    ${resp.json()[0]}    src_initial_balance    ${src_initial_balance}
    Dictionary Should Contain Item    ${resp.json()[0]}    des_account_id    ${des_account_id}
    Dictionary Should Contain Item    ${resp.json()[0]}    des_initial_balance    ${des_initial_balance}
    Dictionary Should Contain Item    ${resp.json()[0]}    amount    ${amount}
    Dictionary Should Contain Item    ${resp.json()[0]}    fee    ${fee}
    Dictionary Should Contain Item    ${resp.json()[0]}    src_remain_balance    ${src_remain_balance}
    Dictionary Should Contain Item    ${resp.json()[0]}    des_remain_balance    ${des_remain_balance}

