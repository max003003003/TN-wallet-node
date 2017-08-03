*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
Suite Teardown  Transfer Money Success     7582983660    4600    1111111111    0    100    0    4500    100

*** Variables ***
${URL}    http://127.0.0.1:3000

*** Test cases ***
Check if Phansawuth can topup sccessfully
    Topup Money Success     7582983660    4500    100    4600

Check if the topup transaction exists in database
    ${resp}=    Get Request    TN-wallet-node    /transactions/${TRANSACTION_ID}
    Transactions Should Contain    ${resp}    ${TRANSACTION_ID}    topup    1111111111    100    7582983660    4500    100    0    0    4600    SUCCESS

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

Topup Money Success
    [Arguments]    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=topup     des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}

Transfer Money Success
    [Arguments]    ${src_acc_id}    ${src_initial_balance}    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=transfer     src_acc_id=${src_acc_id}    src_initial_balance=${src_initial_balance}    des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    fee=${fee}    src_remain_balance=${src_remain_balance}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}
