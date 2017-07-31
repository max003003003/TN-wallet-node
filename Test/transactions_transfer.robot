*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
Test Setup    Transfer Money Success     7897897899    2000    1231231233    4700    200    0    1800    4900
Test Teardown    Transfer Money Success     1231231233    4900    7897897899    1800    200    0    4700    2000

*** Variables ***
${URL}    http://127.0.0.1:3000

*** Test cases ***
Get transactions success
    ${resp}=    Get Request    TN-wallet-node    /transactions/${TRANSACTION_ID}
    Transactions Should Contain    ${resp}    ${TRANSACTION_ID}    transfer    7897897899    2000    1231231233    4700    200    0    1800    4900    SUCCESS

*** Keywords ***
Transactions Should Contain
    [Arguments]    ${resp}     ${id}    ${type}    ${src_account_id}    ${src_initial_balance}     ${des_account_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}    ${transaction_status}
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Item    ${resp.json()}    id    ${id}
    Dictionary Should Contain Item    ${resp.json()}    type    ${type}
    Dictionary Should Contain Item    ${resp.json()}    src_account_id    ${src_account_id}
    Dictionary Should Contain Item    ${resp.json()}    src_initial_balance    ${src_initial_balance}
    Dictionary Should Contain Item    ${resp.json()}    des_account_id    ${des_account_id}
    Dictionary Should Contain Item    ${resp.json()}    des_initial_balance    ${des_initial_balance}
    Dictionary Should Contain Item    ${resp.json()}    amount    ${amount}
    Dictionary Should Contain Item    ${resp.json()}    fee    ${fee}
    Dictionary Should Contain Item    ${resp.json()}    src_remain_balance    ${src_remain_balance}
    Dictionary Should Contain Item    ${resp.json()}    des_remain_balance    ${des_remain_balance}
    Dictionary Should Contain Item    ${resp.json()}    transaction_status    ${transaction_status}

Transfer Money Success
    [Arguments]    ${src_acc_id}    ${src_initial_balance}    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=transfer     src_acc_id=${src_acc_id}    src_initial_balance=${src_initial_balance}    des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    fee=${fee}    src_remain_balance=${src_remain_balance}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}
