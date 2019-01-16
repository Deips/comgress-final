(function() {
    'use strict';

    angular
        .module('comgress')
        .controller('MisEventosController', MisEventosController);

    /** @ngInject */
    function MisEventosController(EventoFactory) {
        var vm = this;

        activate();

        function activate() {
            //Muestra los eventos donde el usuario se unió
            EventoFactory.getUserEventos().then(function(data) {
              vm.eventos = data;
            });
        }
    }
})();
