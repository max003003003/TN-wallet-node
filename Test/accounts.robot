*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Get account success
    ${resp}=    Get Request    TN-wallet-node    /accounts/1234567890
    Account Should Contain    ${resp}    1234567890    Thanaporn    Sumpaotong
Get account2 success
    ${resp}=    Get Request    TN-wallet-node    /accounts/9876543210
    
    Account Should Contain    ${resp}    9876543210    Thanaporn    Suwathanawongchai

*** Keywords ***
Account Should Contain
    [Arguments]    ${resp}     ${account_id}    ${name}    ${surname}
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Item       ${resp.json()[0]}     account_id    ${account_id}
    Dictionary Should Contain Item       ${resp.json()[0]}     name    ${name}
    Dictionary Should Contain Item       ${resp.json()[0]}     surname    ${surname}