(function ($, window, document, undefined) {

    'use strict';

    $(function () {

        /* ---------------------------------------- */
        /* chancing default position alertify */


        function setupAlertify(){
            alertify.set('notifier','position', 'top-right');
        }
        setupAlertify();

        /* ---------------------------------------- */
        /* http://caniuse.com/#feat=online-status   */

        /* webkit */
        function updateOnlineStatus(){
            $("html").removeClass("online offline");
            var condition = navigator.onLine ? "online" : "offline";
            $("html").addClass(condition);
        }

        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();

        /* firefox */
        function connectionChanged(event){
            if(navigator.connection.bandwidth !== 0) {
                $("html").removeClass("offline");
                $("html").addClass("online");
            } else {
                $("html").removeClass("online");
                $("html").addClass("offline");
            }
        }

        if(navigator.connection !== undefined){
            navigator.connection.addEventListener('change', connectionChanged, false);
        }

        // https://github.com/h5bp/mobile-boilerplate/blob/v4.1.0/js/plugins.js
        // Avoid `console` errors in browsers that lack a console.
        var method;
        var noop = function noop() {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }

        // var myElement = document.getElementById('myElement');
        //
        // // create a simple instance
        // // by default, it only adds horizontal recognizers
        // var mc = new Hammer(myElement);


    });

})(jQuery, window, document);

(function() {
    'use strict';

    angular
        .module('app', [
            'ngAnimate',
            'ui.router'
        ]).config(config);

    config.$inject = ['$stateProvider','$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('home',{
                url: "/",
                templateUrl: "partials/mainlayout.html",
                controller: 'mainController',
                controllerAs : 'main'
            });
        }

})();