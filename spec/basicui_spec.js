'use strict';

/*note we're using US currency in these tests*/

describe('Savedo App', function() {

  beforeEach(function() {
      
    var menuMakePayments = element(by.id('menuOptionShowMakePayments'));
    var menuShowAddPayee = element(by.id('menuOptionShowAddPayee'));
    });

  /* environment sanity check... */
  it('should have a title', function() {
    browser.get('http://localhost:9000');
    expect(browser.getTitle()).toEqual('Savedo Customer System');
  });


  it('should show Balances window when clicking menu option.', function(){
    browser.get('http://localhost:9000');
    var mainShowBalance = element(by.id('menuOptionShowBalances'));
    mainShowBalance.click().then(function(){
      expect(element(by.id('checkingAmount')).isDisplayed()).toBeTruthy();
      expect(element(by.id('checkingAmount')).getText()).toEqual('$0.00');
      expect(element(by.id('savingsAmount')).getText()).toEqual('$0.00');
    })
  });


  it('should show say we have no Payees when first clicking Make Payments.', function(){
    browser.get('http://localhost:9000');
    var menuMakePayments = element(by.id('menuOptionShowMakePayments'));
    menuMakePayments.click().then(function() {
      expect(element(by.id('noPayeesAlert')).isDisplayed()).toBeTruthy();
    }); 
  });


/*
  Give a customer opening the web app,
  When they click on Create Payee
  Then they see a form to create a new payee and can enter the Payee name, Bank and IBAN
  */
  it('should show open Create Payee window when clicking menu option.', function(){
    browser.get('http://localhost:9000');
    var menuShowAddPayee = element(by.id('menuOptionShowAddPayee'));

    menuShowAddPayee.click().then(function(){

      expect(element(by.id('payeeNameInput')).isDisplayed()).toBeTruthy();
      expect(element(by.id('payeeBankInput')).isDisplayed()).toBeTruthy();
      expect(element(by.id('payeeIBANInput')).isDisplayed()).toBeTruthy();

    })
  });

  it('should validate data in Create Payee window.', function()
  {
    browser.get('http://localhost:9000');
    var menuShowAddPayee = element(by.id('menuOptionShowAddPayee'));
    menuShowAddPayee.click().then(function(){

      //put bad data into iban info...
      element(by.id('payeeIBANInput')).sendKeys('xxxxxxxx');
      expect(element(by.id('ibanErrorInfo')).isDisplayed()).toBeTruthy();

    });
  });

  it('should disable Create Payee submit button when there is missing data.', function()
  {
    browser.get('http://localhost:9000');
    var menuShowAddPayee = element(by.id('menuOptionShowAddPayee'));
    var savePayeeButton = element(by.id('savePayeeButton'));

    menuShowAddPayee.click().then(function(){
    expect(savePayeeButton.getAttribute('disabled')).toBeTruthy();
    });
  });

  it('should let us create a payee with valid data.', function(){
    browser.get('http://localhost:9000');
    var menuShowAddPayee = element(by.id('menuOptionShowAddPayee'));
    var savePayeeButton = element(by.id('savePayeeButton'));

    menuShowAddPayee.click().then(function(){
      expect(savePayeeButton.getAttribute('disabled')).toBeTruthy();

      //send valid data...
      element(by.id('payeeNameInput')).sendKeys('New Payee');
      element(by.id('payeeBankInput')).sendKeys('Bankotest');
      element(by.id('payeeIBANInput')).sendKeys('fo11111111111111');
      expect(savePayeeButton.getAttribute('disabled')).toBeFalsy();
      savePayeeButton.click().then(function(){
        
        //var cmd = "localStorage.getItem('savedoData.payees');";
        
        browser.executeScript("return localStorage.getItem('savedoData.payees');").then( function(retValue){
                console.log("\n\n\n\n******\n",retValue,"\n\n\n\n*******");
                expect(retValue).toEqual('[{"payeeName":"New Payee","bank":"Bankotest","iban":"fo11111111111111"}]');
        });
      });
    });
  });




/*Given a customer opening the web app,
  When they click on Make Payment,
  Then they see a form that allows them to choose a Payee, enter an amount and a date.
  */

  it('should let us let us see Make Payments window after a payee has been added.', function(){
    browser.get('http://localhost:9000');
    var menuMakePayments = element(by.id('menuOptionShowMakePayments'));
    menuMakePayments.click().then(function() {
      expect(element(by.id('noPayeesAlert')).isDisplayed()).toBeFalsy();
    }); 
  });


  it('should not let us submit a payment with bad data.', function(){
    browser.get('http://localhost:9000');
    var menuMakePayments = element(by.id('menuOptionShowMakePayments'));
    var savePaymentButton = element(by.id('savePaymentButton'));

    menuMakePayments.click().then(function() {
      
      //var payeeInput = element(by.id('payeeInput')); // select id?
      var paymentAmountInput = element(by.id('paymentAmountInput'))
      var paymentDateInput = element(by.id('paymentDateInput'))


      paymentAmountInput.sendKeys('xxxxxxx');
      expect(savePaymentButton.getAttribute('disabled')).toBeTruthy();

      paymentAmountInput.sendKeys('-1');
      expect(savePaymentButton.getAttribute('disabled')).toBeTruthy();

      //TODO: how to test this if it's not visible?
      //paymentDateInput.click();
      //expect(savePaymentButton.getAttribute('disabled')).toBeTruthy();

      paymentAmountInput.sendKeys('');
      expect(savePaymentButton.getAttribute('disabled')).toBeTruthy();

      element(by.cssContainingText('option', 'New Payee')).click();
      expect(savePaymentButton.getAttribute('disabled')).toBeTruthy();
    }); 
  });

  it('should reflect new values in balances after localStorage has been changed.', function(){
      browser.get('http://localhost:9000');
    var mainShowBalance = element(by.id('menuOptionShowBalances'));

     browser.executeScript("localStorage.setItem('savedoData.checkingBalance', '200');").then( function(){
        mainShowBalance.click().then(function(){
        expect(element(by.id('checkingAmount')).isDisplayed()).toBeTruthy();
        expect(element(by.id('checkingAmount')).getText()).toEqual('$200.00');
           });

          });
  });

  //test responsive layout
  it ('should show the smaller menu and icon when the device window is small.', function(){
    browser.manage().window().setSize(320, 480);
    browser.get('http://localhost:9000');

    //expect(element(by.id('smallNavMenuButton'))).isDisplayed().toBeTruthy();

    element(by.id('smallNavMenuButton')).click();
    
    expect(element(by.id('mobileOptionShowBalances')).isDisplayed()).toBeTruthy();
    expect(element(by.id('mobileOptionShowMakePayments')).isDisplayed()).toBeTruthy();
    expect(element(by.id('mobileOptionShowAddPayee')).isDisplayed()).toBeTruthy();

  });



});
