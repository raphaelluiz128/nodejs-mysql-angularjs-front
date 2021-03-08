'use strict';

/**
 * @ngdoc function
 * @name nodejsMysqlAngularjsFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 */


var app = angular.module('nodejsMysqlAngularjsFrontApp');
var validacao;
var baseUrl = 'https://apiead.herokuapp.com/api/clientes';

var options = [
    'Pendente', 'Concluída'
];

app.controller('MainCtrl', ['$scope', '$http', '$uibModal', '$rootScope', function ($scope, $http, $uibModal, $rootScope, data) {
    $rootScope.clientes = {};
    
    $rootScope.options =  options;

    $http.get(baseUrl).then(function (response) {
        $rootScope.clientes = response.data;
    }, function (err) {
        console.log(err);
    });

    const validacaoDeCampos = function () {
        if (angular.element('#responsibleEmailInput').val() == '' || angular.element('#responsibleInput').val() == '' ||
            angular.element('#descriptionInput').val() == '') {
            swal("Campos em branco", " Por favor informe todos os dados dos campos! ", "warning");
            validacao = 0;
        } else {
            validacao = 1;
        }

    }

    $scope.incluir = function () {
        validacaoDeCampos();
        var opcoes = [];
        console.log($scope.selectStatus);
        opcoes = $scope.selectStatus;
 
        if (validacao == 1) {
            //var documento = angular.element('#documentoInput').val().replace(/\D/g, '');
            var tamanhoClientes = $rootScope.tasks.length;
            var objTask = {
                "responsible": angular.element('#responsibleInput').val(),
                "responsibleInput": angular.element('#responsibleEmailInput').val(),
                "descriptionInput": angular.element('#descriptionInput').val(),
                "status": opcoes
            }
                    var key = tasks + 1;
                    $http.post(baseUrl + '/', objCliente).then(function (response) {
                        if (response) {
                            $rootScope.clientes.push(response.data);
                            swal("Adicionado", " Adicionado com Sucesso! ", "success");
                        };
                    });
                }
    };


    $scope.remover = function (cliente) {
        
                var key = $rootScope.clientes.indexOf(cliente);
                $http.delete(baseUrl + '/delete/' + cliente._id).then(function (response) {
                    if (response) {
                        if (key !== -1) {
                            $rootScope.clientes.splice(key, 1);
                            swal("Removido!", " Removido com Sucesso! ", "success");
                        }
                    }
                });   
    };


    $scope.modalEditar = function (eCliente) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/editarCliente.html',
            controller: 'editarCtrl',
        })
        sessionStorage.eCliente = JSON.stringify(eCliente);
        sessionStorage.key = $rootScope.clientes.indexOf(eCliente);
    }
}]).controller('editarCtrl', function ($scope, $uibModalInstance, $http) {

    $scope.eCliente = JSON.parse(sessionStorage.eCliente);
    sessionStorage.idEdicao = $scope.eCliente._id;


    $scope.alterar = function () {
        var documento = angular.element('#documentoInputE').val().replace(/\D/g, '');
        var objCliente = {
            "nome": angular.element('#nomeInputE').val(),
            "dataNascimento": angular.element('#dataNascimentoInputE').val(),
            "documento": documento,
            "servicos": ["Aplicativo Android"]
        }
   
                $http.put(baseUrl + '/editar/' + sessionStorage.idEdicao, objCliente).then(function (response) {
                    if (response) {
                        for (var i = 0; i < $scope.clientes.length; i++) {
                            if ($scope.clientes[i]._id == sessionStorage.idEdicao) {
                                $scope.clientes[i].nome = objCliente.nome;
                                $scope.clientes[i].dataNascimento = objCliente.dataNascimento;
                                $scope.clientes[i].documento = objCliente.documento;
                                swal("Alterado!", " Dados alterados com Sucesso! ", "success");
                            };
                        };
                    }
                });   

        $uibModalInstance.close();
    };
    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancel');
    };


});