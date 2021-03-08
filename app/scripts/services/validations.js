'use strict';
var app = angular.module('nodejsMysqlAngularjsFrontApp');
app.factory('validacaoDeCampos', function(){
   
    this.validacaoDeCampos = function(){
        if(angular.element('#documentoInput').val() == '' || angular.element('#dataNascimentoInput').val() == '' ||
        angular.element('#nomeInput').val() == ''){
          swal("Campos em branco", " Por favor informe todos os dados dos campos! ", "warning");
      return 0;
  }else{
      return 1;
  }}

});