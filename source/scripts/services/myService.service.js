(function() {
    'use strict';

    // factory
    angular
        .module('app')
        .factory('dataService', dataService);

    /* recommended */
    function dataService() {
        var someValue = '';
        var service = {
            save: save,
            someValue: someValue,
            validate: validate,
            someValues : someValues
        };
        return service;

        ////////////

        function someValues() {
            return "{ leo : 'test'}";
        }

        function save() {
            /* */
            //console.log("SAVE");
        }

        function validate() {
            /* */
        }
    }

})();