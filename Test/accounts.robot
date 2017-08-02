*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    TN-wallet-node    ${URL}
*** Variables ***
${URL}    http://127.0.0.1:3000
*** Test cases ***
Check if Thanaporn's account exits in database
    ${resp}=    Get Request    TN-wallet-node    /accounts/6302335476
    Account Should Contain    ${resp}    6302335476    Thanaporn    Suwathanawongchai
    
Check if Phansawuth's account exits in database
    ${resp}=    Get Request    TN-wallet-node    /accounts/7582983660
    Account Should Contain    ${resp}    7582983660    Phansawuth    Jenthaworn

*** Keywords ***
Account Should Contain
    [Arguments]    ${resp}     ${account_id}    ${name}    ${surname}
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Item       ${resp.json()[0]}     account_id    ${account_id}
    Dictionary Should Contain Item       ${resp.json()[0]}     name    ${name}
    Dictionary Should Contain Item       ${resp.json()[0]}     surname    ${surname}