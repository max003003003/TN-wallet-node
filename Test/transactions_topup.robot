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
Check if Phansawuth can topup sccessfully
    Topup Money Success     ${DESTINATION_ACCOUNT}    4500    100    4600
    ${resp}=    Get Request    TN-wallet-node    /transactions/${TRANSACTION_ID}
    Transactions Should Contain    ${resp}    ${TRANSACTION_ID}    topup    1111111111    100    ${DESTINATION_ACCOUNT}    4500    100    0    0    4600    SUCCESS
