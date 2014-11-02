'use strict';

describe('Controller: TransactionsController', function () {

  // load the controller's module
  beforeEach(module('savedoApp') , module('LocalStorageModule'));
  var TransactionsController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.newPayee = { payeeName: 'Jasmine Test', bank: 'Test Bank', iban: 'FA001111111111'};

    TransactionsController = $controller('TransactionsController', {
      $scope: scope, 
    });
  }));


//TEST SUITE:
  // test savePayment()
  it ('should let us save a new payment to a controller array', function(){
    var oldLength = scope.payments.length;
    scope.newPayment = {};
    scope.savePayment();
    expect(scope.payments.length).toBe(oldLength + 1);
  });

  // test savePayee()
  it ('should let us save a new payee to a controller array', function() {
    var oldPayeesCount = scope.payees.length;
    scope.saveNewPayee();
    expect(scope.payees.length).toBe(oldPayeesCount + 1);
  });

  it ('should let us push payment data to localStorage', function(){
    scope.payments = [];
    scope.checkingBalance = 0;
    scope.newPayment = {amount: 5 };
    scope.savePayment();
    scope.readDataFromLocalStore();
    expect(scope.payments[0].amount).toBe(5);
  });

  it('should let us push a payee to localStorage', function(){ 
    scope.newPayee = { payeeName: 'a new test payee' };
    scope.saveNewPayee();
    scope.readDataFromLocalStore();
    var payeelength = scope.payees.length;
    expect(scope.payees[payeelength - 1].payeeName).toBe('a new test payee');
  });


});
 