'use strict';

/**
 * @ngdoc overview
 * @name savedoYoApp
 * @description
 * # savedoYoApp
 *
 * Main module of the application.
 */
angular
  .module('savedoApp', [
    'ngResource',
    'LocalStorageModule',
    'transactionsModule'

  ])

  .config(
    function (localStorageServiceProvider){
      localStorageServiceProvider.setPrefix('savedoData');//.setStorageType('localStorage');
    }
  );
