(function() {
    'use strict';

    angular
        .module('app')
        .controller('mainController', mainController);

    mainController.$inject =['$scope','$log','dataService'];

    function mainController ($scope, $log,dataService) {
        /* jshint validthis: true */
        var vm = this;
        vm.title = 'Some Title';
        vm.test = dataService.someValues();
        vm.items = ["A", "List", "Of", "Items"];


        var activate = function() {
            // dataService.save();
            console.log(">",$scope);
        };

        activate();
    }

})();
