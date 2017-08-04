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
Check if the added transaction transfefr is recored in GL table
    Transfer Money Success     ${SOURCE_ACCOUNT}    500    ${DESTINATION_ACCOUNT}    500    500    0    0    1000
    GL should exists    ${SOURCE_ACCOUNT}    ${TRANSACTION_ID}    500    500
    GL should exists    ${DESTINATION_ACCOUNT}    ${TRANSACTION_ID}    500    500

Check if the added transactio top up is recorded in GL table
    Topup Money Success     ${DESTINATION_ACCOUNT}    4500    100    4600
    GL should exists    ${DESTINATION_ACCOUNT}    ${TRANSACTION_ID}    100    100
