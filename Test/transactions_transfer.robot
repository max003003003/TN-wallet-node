*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    DatabaseLibrary
Resource    ./keywords.robot

Suite Setup    Setup Session and Database
Test Setup    Set balance
Test Teardown    Clear Database

*** Variables ***
${URL}    http://127.0.0.1:3000
${SOURCE_ACCOUNT}    6302335476
${DESTINATION_ACCOUNT}    7582983660

*** Test cases ***
Check if Thanaporn can transfer to Phansawuth 
    Transfer Money Success     ${SOURCE_ACCOUNT}    4700    ${DESTINATION_ACCOUNT}    4500    500    0    4200    5000
    ${resp}=    Get Request    TN-wallet-node    /transactions/${TRANSACTION_ID}
    Transactions Should Contain    ${resp}    ${TRANSACTION_ID}    transfer    ${SOURCE_ACCOUNT}    4700    ${DESTINATION_ACCOUNT}    4500    500    0    4200    5000    SUCCESS
