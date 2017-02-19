angular.module("SM", [require("../../lib/index.js")])
        .controller("SMController", function($scope) {
            $scope.console = [];
            $scope.$watch("yourVariable", function(date) {
                $scope.console.push(date);
            });
        });