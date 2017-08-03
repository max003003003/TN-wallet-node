*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    DatabaseLibrary

Suite Setup    Connect To Database    pymysql    tnwallet    root    root    188.166.214.163    3306
Test Setup    Create Session    TN-wallet-node    ${URL}

*** Variables ***
${URL}    http://127.0.0.1:3000

*** Test cases ***
Check if Thanaporn can transfer to Phansawuth 
    Set balance of     6302335476     500    
    Set balance of     7582983660     500 
    Transfer Money Success     6302335476    500    7582983660    500    500    0    0    1000
    GL should exists    6302335476    500    500
    GL should exists    7582983660    500    500
    Delete transaction of    6302335476   
    Delete GL of    6302335476
    Delete GL of    7582983660

*** Keywords ***
Transfer Money Success
    [Arguments]    ${src_acc_id}    ${src_initial_balance}    ${des_acc_id}    ${des_initial_balance}    ${amount}    ${fee}    ${src_remain_balance}    ${des_remain_balance}
    &{data}=   Create Dictionary   type=transfer     src_acc_id=${src_acc_id}    src_initial_balance=${src_initial_balance}    des_acc_id=${des_acc_id}    des_initial_balance=${des_initial_balance}    amount=${amount}    fee=${fee}    src_remain_balance=${src_remain_balance}    des_remain_balance=${des_remain_balance}
    &{headers}=  Create Dictionary  Content-Type=application/x-www-form-urlencoded
    ${resp}=  Post Request  TN-wallet-node    /transactions		data=${data}    headers=${headers}
    ${ID}=    Get From Dictionary    ${resp.json()}    transaction_id
    Should Be Equal As Strings  ${resp.status_code}  200
    Set Global Variable    ${TRANSACTION_ID}    ${ID}

Set balance of     
    [Arguments]    ${account_id}    ${balance}
    Execute Sql String    UPDATE tb_users SET balance = ${balance} WHERE account_id = ${account_id}

GL should exists
    [Arguments]    ${account_id}    ${dr_amount}    ${cr_amount}
    Check If Exists In Database    SELECT account_id FROM tb_GLs WHERE account_ID = ${account_id} AND dr_amount = ${dr_amount} AND cr_amount = ${cr_amount}

Delete transaction of
    [Arguments]    ${account_id}
    Execute Sql String    DELETE FROM tb_transactions WHERE src_account_id = ${account_id}

Delete GL of
    [Arguments]    ${account_id}
    Execute Sql String    DELETE FROM tb_GLs WHERE account_ID = ${account_id}