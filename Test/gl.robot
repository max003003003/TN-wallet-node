*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    DatabaseLibrary
Resource    ./keywords.robot

Suite Setup    Setup Session and Database
Test Setup    Set balance
# Test Teardown    Clear Database

*** Variables ***
${URL}    http://127.0.0.1:3000
${SOURCE_ACCOUNT}    6302335476
${DESTINATION_ACCOUNT}    7582983660

*** Test cases ***
Check if the transaction is added in GL table
    Transfer Money Success     ${SOURCE_ACCOUNT}    500    ${DESTINATION_ACCOUNT}    500    500    0    0    1000
    GL should exists    ${SOURCE_ACCOUNT}    500    500
    GL should exists    ${DESTINATION_ACCOUNT}    500    500

    Topup Money Success     ${DESTINATION_ACCOUNT}    4500    100    4600
    GL should exists    ${DESTINATION_ACCOUNT}    100    100
