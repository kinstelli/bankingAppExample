'use strict';

var transactionsModule = angular.module('transactionsModule', ['ngResource', 'LocalStorageModule' ]);

/* validIban - This Directive does does a simplified IBAN check -- it doesn't do a mod 97 checksum, 
		since Javascript can't handle such large integers without a much more complex algorithm.

	TODO: implement real mod 97 algorithm, or adjust FOSS packages to follow angular module format
*/
transactionsModule.directive('validIban', function(){
  return{
    require:'ngModel',
    link: function(scope, elem, attrs, ctrl){
      
      /*
      	just checking against a simple regex. not genuine IBAN validation.
      */
      function isValidIBANCountryCode(twodigits)
      {
		var assignedAlpha2 = ['AL','AT','AE','AO','AZ','BA','BE','BF','BG','BH',
			'BI','BJ','BR','CG','CH','CI','CM','CR','CV','CY','CZ','DE','DK',
			'DO','DZ','EE','EG','ES','FI','FO','FR','FR','GA','GB','GE','GI',
			'GL','GR','GT','HR','HU','IE','IL','IR','IS','IT','JO','KW','KZ',
			'LB','LT','LU','LV','MC','MD','ME','MG','MK','ML','MR','MT','MU',
			'MZ','NL','NO','PK','PL','PS','PT','PT','QA','RO','RS','SA','SE',
			'SI','SK','SM','SN','TN','TR','UA','VG'];
		return (assignedAlpha2.indexOf(twodigits.toUpperCase() ) > -1);
      }


      function validateIBAN(viewValue){
        if (isValidIBANCountryCode(viewValue.substr(0,2)) && /^([A-Za-z]{2}[0-9]{2}[A-za-z0-9]{8,30})$/.test(viewValue) )
        {
          ctrl.$setValidity('validIBAN',true);
        }
        else{
          ctrl.$setValidity('validIBAN', false);
        }
        return viewValue;
      }

      ctrl.$parsers.unshift(validateIBAN);

    }
  };
});


/**
 * # TransactionsController
 * Handles basic customer info for Savedo Customer screen
*/
transactionsModule.controller('TransactionsController', ['$scope', 'localStorageService',  function( $scope, localStorageService )
{
		//Prototypes - in case we use ngResource at some point. 
		function Payee()
		{
			this.payeeName = '';
			this.bank = ''; 
			this.iban = '';
		}

		function Payment()
		{
			this.payee = '';
			this.amount = '';
			this.postingDate = '';
		}


	    $scope.payees = [];
		$scope.payments = [];

		$scope.checkingBalance = 0;
		$scope.savingsBalance = 0;		

		$scope.alertWindowText = '';
		/* ui state control */
		$scope.curNav = 'init';
		$scope.today = new Date();
		$scope.newPayee = null;
		$scope.newPayment = null;

		$scope.setSampleData = function()
		{
			$scope.checkingBalance = 1020;
			$scope.savingsBalance = 520;
			$scope.payees = [{payeeName:'Your Pal', bank: 'That Bank', iban: '78954738239'}];
		};

		$scope.init = function()
		{
			$scope.curNav = 'init';
			$scope.readDataFromLocalStore();
		};

		$scope.readDataFromLocalStore = function()
		{	if (localStorageService.get('checkingBalance') !== null)
			{
				$scope.checkingBalance =  localStorageService.get('checkingBalance');
			}
			if (localStorageService.get('savingsBalance') !== null)
			{
				$scope.savingsBalance =  localStorageService.get('savingsBalance');
			}
			if (localStorageService.get('payees') !== null)
			{
				$scope.payees =  localStorageService.get('payees');
			}
			if (localStorageService.get('payments') !== null)
			{
				$scope.payments =  localStorageService.get('payments');
			}
		};

		$scope.displayBalancesWindow = function()
		{
			$scope.readDataFromLocalStore();
			$scope.curNav = 'viewBalances';
		};
		
		$scope.displayPaymentWindow = function()
		{
			
				$scope.clearAllAlerts();
				$scope.newPayment = new Payment( );
				$scope.dateOptions = { startDate: new Date() };
				$scope.curNav = 'makePayment';
			
		};

		$scope.savePayment = function()
		{
			$scope.payments.push($scope.newPayment);
			$scope.checkingBalance -= $scope.newPayment.amount;

			//save to localStorage
			if (localStorageService.set('payments', $scope.payments) === true && 
				localStorageService.set('checkingBalance', $scope.checkingBalance) === true &&
				localStorageService.set('savingsBalance', $scope.savingsBalance) === true )
			{
					$scope.didMakePayment = true;
					$scope.curNav = 'showingAlert';
					$scope.savedPaymentAlert = true;
			}


		};

		$scope.checkForExistingPayee = function()
		{
			$scope.addPayeeForm.payeeNameInput.$error.payeeExists = false;
			for(var i = 0; i < $scope.payees.length; i++)
			{
				if ($scope.payees[i].payeeName === $scope.newPayee.payeeName) //payee exists
				{
					$scope.addPayeeForm.payeeNameInput.$error.payeeExists = true;
				}
			}
		};


		$scope.displayPayeeWindow = function()
		{
				/* clear relevant errors and other state */
				$scope.addPayeeForm.payeeNameInput.$error.payeeExists = false;
				$scope.addPayeeForm.$error.validIBAN = false;				
				$scope.didAddPayee = false;
				$scope.clearAllAlerts();

				//init blank Payee obj on scope
				$scope.newPayee = new Payee();
				$scope.curNav = 'addPayee';				
		};


		$scope.saveNewPayee = function()
		{			
			$scope.payees.push($scope.newPayee);			
			if (localStorageService.set('payees', $scope.payees) === true)
			{
					$scope.didAddPayee = true;
					$scope.curNav = 'showingAlert';
					$scope.savedPayeeAlert = true;
			}
		};

		$scope.clearWindows = function()
		{
			$scope.curNav = '';
		};

		$scope.clearAllAlerts = function()
		{
			$scope.savedPayeeAlert = false;
			$scope.savedPaymentAlert = false;
		};

		$scope.toggleMobileMenu = function()
		{
			console.log('toggling mobile menu');
			if ($scope.showingMobileMenu === true)
			{
				$scope.hideMobileMenu();
			}else
			{
				$scope.showingMobileMenu = true;
			}
		};

		$scope.hideMobileMenu = function()
		{
			$scope.showingMobileMenu = false;
		};

}]);

