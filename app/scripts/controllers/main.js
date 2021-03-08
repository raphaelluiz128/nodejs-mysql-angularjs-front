'use strict';

/**
 * @ngdoc function
 * @name nodejsMysqlAngularjsFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 */


var app = angular.module('nodejsMysqlAngularjsFrontApp');
var validacao;
var baseUrl = 'http://localhost:3002/tasks';



app.controller('MainCtrl', ['$scope', '$http', '$uibModal', '$rootScope', function ($scope, $http, $uibModal, $rootScope, data) {
    $rootScope.tasks = [];
    
    $scope.options = [{
        id: 1,
        label: 'Pendente',
      }, {
        id: 2,
        label: 'Concluída',
      }];

    $http.get(baseUrl).then(function (response) {
        $rootScope.tasks = response.data.dataTask;
    }, function (err) {
        console.log(err);
    });

    const validacaoDeCampos = function () {
        if (angular.element('#responsibleEmailInput').val() == '' || angular.element('#responsibleInput').val() == '' ||
            angular.element('#descriptionInput').val() == '' || $scope.selectStatus == null) {
            swal("Campos em branco", " Por favor informe todos os dados dos campos! ", "warning");
            validacao = 0;
        } else {
            validacao = 1;
        }

    }

    const apagarCampos = function () {
        $scope.selectStatus = null;
        $scope.descriptionInput = null;
        $scope.responsibleInput = null;
        $scope.responsibleEmailInput = null;
    }
    
    $scope.incluir = function () {
        validacaoDeCampos();
        
        var status = $scope.selectStatus;
 
        if (validacao == 1) {
            //var documento = angular.element('#documentoInput').val().replace(/\D/g, '');
            var tamanhoTasks = $rootScope.tasks.length;
            $http.post("http://apilayer.net/api/check?access_key=9c3a308e83057808906c5fb1f769057c&email="+angular.element('#responsibleEmailInput').val()).then(function(res){
                if(res.data.mx_found == true && res.data.format_valid == true){
                var objTask = {
                    "responsible": angular.element('#responsibleInput').val(),
                    "responsibleEmail": angular.element('#responsibleEmailInput').val(),
                    "description": angular.element('#descriptionInput').val(),
                    "status": status.label
                }
                        //var key = tasks + 1;
                        $http.post(baseUrl, objTask).then(function (response) {
                            if (response) {
                                $rootScope.tasks.push(response.data);
                                swal("Adicionado", " Adicionado com Sucesso! ", "success");
                                apagarCampos();
                            };
                        },
                        function(error){
                            console.log(error); 
                       }) ;
            
        }else{
            swal(" Seu email não é válido!", "Você informou o email "+ angular.element('#responsibleEmailInput').val() +", mas acho que você tentou digitar"+res.data.did_you_mean+', devido a isso troquei o email na caixa de texto. Tente novamente.', "error");
            $scope.responsibleEmailInput = res.data.did_you_mean;
        }
    })
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