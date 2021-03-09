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


    $http.get(baseUrl).then(function (response) {
        $rootScope.tasks = response.data.dataTask;
    }, function (err) {
        console.log(err);
    });

    const validacaoDeCampos = function () {
        if (angular.element('#responsibleEmailInput').val() == '' || angular.element('#responsibleInput').val() == '' ||
            angular.element('#descriptionInput').val() == '' || angular.element('#statusInput').val() == '') {
            swal("Campos em branco", " Por favor informe todos os dados dos campos! ", "warning");
            validacao = 0;
        } else {
            validacao = 1;
        }

        if (angular.element('#statusInput').val() != 'p' && angular.element('#statusInput').val() != 'c') {
            validacao = 0;
        }

        if (angular.element('#statusInput').val() == 'p' || angular.element('#statusInput').val() == 'c') {
            validacao = 1;
        }

    }

    const apagarCampos = function () {
        $scope.statusInput = null;
        $scope.descriptionInput = null;
        $scope.responsibleInput = null;
        $scope.responsibleEmailInput = null;
    }

    $scope.incluirQualquerTarefa = function () {
        var auxArray = [];
        var objTask;
        $http.get("http://cat-fact.herokuapp.com/facts").then(function (res) {
            auxArray = res.data.slice(0, 3);

            for (var i = 0; i < 3; i += 1) {
                objTask = {
                    "responsible": "Eu",
                    "responsibleEmail": "eu@me.com",
                    "description": (auxArray[i].text).substring(0, 35),
                    "comeToPending": 0,
                    "status": "p"
                }
                $http.post(baseUrl, objTask).then(function (response) {
                    if (response) {
                        $http.get(baseUrl).then(function (response) {
                            $rootScope.tasks = response.data.dataTask;
                        }, function (err) {
                            console.log(err);
                        });
                    };
                },
                    function (error) {
                        swal("Infelizmente as tarefas não foram adicionadas", " Tente novamente mais tarde. ", "error");
                        console.log(error);
                        return;
                    });
            }
            swal("Tarefas adicionadas", " Adicionadas com Sucesso! ", "success");


        });


    }

    $scope.incluir = function () {
        validacaoDeCampos();

        var status = $scope.selectStatus;

        if (validacao == 1) {
            //var documento = angular.element('#documentoInput').val().replace(/\D/g, '');
            $http.post("http://apilayer.net/api/check?access_key=9c3a308e83057808906c5fb1f769057c&email=" + angular.element('#responsibleEmailInput').val()).then(function (res) {

                var objTask = {
                    "responsible": angular.element('#responsibleInput').val(),
                    "responsibleEmail": angular.element('#responsibleEmailInput').val(),
                    "description": angular.element('#descriptionInput').val(),
                    "comeToPending": 0,
                    "status": angular.element('#statusInput').val()
                }
                if (res.data.mx_found == true && res.data.format_valid == true) {

                    $http.post(baseUrl, objTask).then(function (response) {
                        if (response) {
                            $http.get(baseUrl).then(function (response) {
                                $rootScope.tasks = response.data.dataTask;
                            }, function (err) {
                                console.log(err);
                            });
                            swal("Adicionado", " Adicionado com Sucesso! ", "success");
                            apagarCampos();
                        };
                    },
                        function (error) {
                            console.log(error);
                        });

                } else {
                    if (res.data.did_you_mean != undefined) {
                        swal(" Seu email não é válido!", "Você informou o email " + angular.element('#responsibleEmailInput').val() + ", mas acho que você tentou digitar " + res.data.did_you_mean + ', devido a isso troquei o email na caixa de texto. Tente novamente.', "error");
                        $scope.responsibleEmailInput = res.data.did_you_mean;
                    } else {
                        $http.post(baseUrl, objTask).then(function (response) {
                            if (response) {
                                $http.get(baseUrl).then(function (response) {
                                    $rootScope.tasks = response.data.dataTask;
                                }, function (err) {
                                    console.log(err);
                                });
                                swal("Adicionado", " Adicionado com Sucesso! ", "success");
                                apagarCampos();
                            };
                        },
                            function (error) {
                                console.log(error);
                            });
                    }
                }
            })
        }
    };



    $scope.modalEditar = function (eTask) {

        var modalInstance = $uibModal.open({
            templateUrl: 'views/editTasks.html',
            controller: 'editarCtrl',
        })
        sessionStorage.eTask = JSON.stringify(eTask);
        sessionStorage.key = $rootScope.tasks.indexOf(eTask);
    }
}]).controller('editarCtrl', function ($scope, $uibModalInstance, $http) {
    $scope.eTask = JSON.parse(sessionStorage.eTask);
    $scope.statusInputE = $scope.eTask.status;
    $scope.eTask.enablePassword = '';
    sessionStorage.idEdicao = $scope.eTask.id;

    $scope.verifyStatusUpdate = function () {
        $scope.eTask.enablePassword = false;
        var comeToPending = $scope.eTask.comeToPending;
        if ($scope.eTask.status == 'c' && angular.element('#statusInputE').val() == 'p') {
            console.log('tem que aumentar')
            comeToPending = comeToPending + 1;
            $scope.eTask.comeToPending = comeToPending;
            if (comeToPending <= 2) {
                $scope.eTask.enablePassword = true;
            }
        }
    }


    $scope.alterarComoSurpervisor = function () {
        console.log($scope.eTask.passwordE)
        if ($scope.eTask.passwordE == "TrabalheNaSaipos") {
            
            $scope.alterar();
        } else {
            swal("Senha inválida!", " Tenta novamente ", "error");
        }
    }

    $scope.alterar = function () {
        var comeToPending = $scope.eTask.comeToPending;

        var objTask = {
            "responsible": angular.element('#responsibleInputE').val(),
            "responsibleEmail": angular.element('#responsibleEmailInputE').val(),
            "description": angular.element('#descriptionInputE').val(),
            "comeToPending": comeToPending,
            "status": angular.element('#statusInputE').val()
        }
        $http.put(baseUrl + '/' + sessionStorage.idEdicao, objTask).then(function (response) {
            if (response) {
                for (var i = 0; i < $scope.tasks.length; i++) {
                    if ($scope.tasks[i].id == sessionStorage.idEdicao) {
                        $scope.tasks[i].responsible = objTask.responsible;
                        $scope.tasks[i].responsibleEmail = objTask.responsibleEmail;
                        $scope.tasks[i].description = objTask.description;
                        $scope.tasks[i].comeToPending = objTask.comeToPending;
                        $scope.tasks[i].status = objTask.status;
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