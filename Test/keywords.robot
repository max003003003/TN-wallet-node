*** Keywords ***
Setup Session and Database
    Connect To Database    pymysql    tnwallet    root    root    188.166.214.163    3306
    Create Session    TN-wallet-node    ${URL}

Set balance
    Set balance of     ${SOURCE_ACCOUNT}     4700    
    Set balance of     ${DESTINATION_ACCOUNT}     4500 

Set balance of     
    [Arguments]    ${account_id}    ${balance}
    Execute Sql String    UPDATE tb_users SET balance = ${balance} WHERE account_id = ${account_id}

Clear Database
    Delete transaction of    ${TRANSACTION_ID}   
    Delete GL of    ${TRANSACTION_ID}
    Delete GL of    ${TRANSACTION_ID}

Delete transaction of
    [Arguments]    ${transaction_id}
    Execute Sql String    DELETE FROM tb_transactions WHERE id = ${transaction_id}

Delete GL of
    [Arguments]    ${transaction_id}
    Execute Sql String    DELETE FROM tb_GLs WHERE transaction_ID = ${transaction_id}

Transfer Money Success
    [Arguments]    ${src_acc_id}    ${src_initial_balance}    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=transfer     src_acc_id=${src_acc_id}    src_initial_balance=${src_initial_balance}    des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    fee=${fee}    src_remain_balance=${src_remain_balance}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}

Topup Money Success
    [Arguments]    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=topup     des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}

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
    
GL should exists
    [Arguments]    ${account_id}    ${dr_amount}    ${cr_amount}
    Check If Exists In Database    SELECT account_id FROM tb_GLs WHERE account_ID = ${account_id} AND dr_amount = ${dr_amount} AND cr_amount = ${cr_amount}
