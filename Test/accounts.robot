*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Get account success
    ${resp}=    Get Request    TN-wallet-node    /accounts/4564564566
    Account Should Contain    ${resp}    4564564566    Test1    Test    2000
    

*** Keywords ***
Account Should Contain
    [Arguments]    ${resp}     ${account_id}    ${name}    ${surname}    ${balance}
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Item       ${resp.json()[0]}     account_id    ${account_id}
    Dictionary Should Contain Item       ${resp.json()[0]}     name    ${name}
    Dictionary Should Contain Item       ${resp.json()[0]}     surname    ${surname}
    Dictionary Should Contain Item       ${resp.json()[0]}     balance    ${balance}