*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Post transactions success
    &{data}=   Create Dictionary   type=transfer     src_acc_id=1234567890    src_initial_balance=2000    des_acc_id=9876543210    des_initial_balance=4700    amount=200    fee=0    src_remain_balance=1800    des_remain_balance=4900
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    Should Be Equal As Strings  ${resp.status_code}  200
Get transactions success
    ${resp}=    Get Request    TN-wallet-node    /transactions/1
    Transactions Should Contain    ${resp}    1    transfer    1234567890    2000    9876543210    4700    200    0    1800    4900    SUCCESS

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

