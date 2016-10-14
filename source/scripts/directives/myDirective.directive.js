/**
 * @desc order directive that is specific to the order module at a company named Acme
 * @example <div acme-order-calendar-range></div>
 */

(function() {
    'use strict';

    angular
        .module('app')
        .directive('acmeOrderCalendarRange', orderCalendarRange);

    function orderCalendarRange() {
        /* implementation details */
    }

})();