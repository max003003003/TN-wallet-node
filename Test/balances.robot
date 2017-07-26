*** Settings ***
Library    RequestsLibrary
Library    Collections
*** Test cases ***
Get balance success
    Create Session    TN-wallet-node    http://127.0.0.1:3000
    ${resp}=    Get Request    TN-wallet-node    /balances/1234567890
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Key    ${resp.json()[0]}    account_id
    Dictionary Should Contain Key    ${resp.json()[0]}    balance