var app = angular.module("app", ["ngRoute", "ngResource"])
        .config(['$routeProvider', function ($routeProvider)
            {
                $routeProvider.when('/costlist', {
                    templateUrl: 'templates/listcost.html',
                    controller: 'ListCostCtrl'
                })
                        .when('/createcost', {
                            templateUrl: 'templates/createcost.html',
                            controller: 'CreateCostCtrl'
                        })
                        .when('/consumptiontlist', {
                            templateUrl: 'templates/listconsumption.html',
                            controller: 'ListConsumptionCtrl'
                        })
                        .when('/createconsumption', {
                            templateUrl: 'templates/createconsumption.html',
                            controller: 'CreateConsumptionCtrl'
                        })
                        .when('/reloadlist', {
                            templateUrl: 'templates/listreload.html',
                            controller: 'ListReloadCtrl'
                        })
                        .when('/createreload', {
                            templateUrl: 'templates/createreload.html',
                            controller: 'CreateReloadCtrl'
                        })
                        .when('/balance', {
                            templateUrl: 'templates/balancemobile.html',
                            controller: 'BalanceCtrl'
                        })
                        .otherwise({redirectTo: '/costlist'});
            }])
        .controller('ListCostCtrl', ['$scope', 'Costs', '$route', function ($scope, Costs, $route)
            {
                Costs.get(function (data) {
                    $scope.costs = data.response;
                });

                $scope.remove = function (id) {
                    Costs.delete({id: id}).$promise.then(function (data) {
                        if (data.response) {
                            $route.reload();
                        }
                    })
                }
            }])
        .controller('CreateCostCtrl', ['$scope', 'Costs', function ($scope, Costs)
            {
                $scope.settings = {
                    pageTitle: "Crear Costo",
                    action: "Crear"
                };

                $scope.cost = {
                    Cost: "",
                    DateCost: ""
                };

                $scope.submit = function () {
                    Costs.save({cost: $scope.cost}).$promise.then(function (data) {
                        if (data.response) {
                            angular.copy({}, $scope.cost);
                            $scope.settings.success = "El costo ha sido creado correctamente";
                        }
                    })
                }
            }])

        .factory('Costs', ["$resource", function ($resource) {
                return $resource("http://confeccioneslamilla.com/estebanprueba/cirest/index.php/costs/:id", {id: "@_id"}, {
                    update: {method: "PUT", params: {id: "@_id"}}
                })
            }])

        .controller('ListConsumptionCtrl', ['$scope', 'Consumptions', '$route', function ($scope, Consumptions, $route)
            {
                Consumptions.get(function (data) {
                    $scope.consumptions = data.response;
                });

                $scope.remove = function (id) {
                    Consumptions.delete({id: id}).$promise.then(function (data) {
                        if (data.response) {
                            $route.reload();
                        }
                    })
                }
            }])
        .controller('CreateConsumptionCtrl', ['$scope', 'Consumptions', function ($scope, Consumptions)
            {
                $scope.settings = {
                    pageTitle: "Crear Consumo",
                    action: "Crear"
                };

                $scope.consumption = {
                    Seconds: "",
                    ConsumptionDate: ""
                };

                $scope.submit = function () {
                    Consumptions.save({consumption: $scope.consumption}).$promise.then(function (data) {
                        if (data.response) {
                            angular.copy({}, $scope.consumption);
                            $scope.settings.success = "El consumo ha sido creado correctamente";
                        }
                    })
                }
            }])

        .factory('Consumptions', ["$resource", function ($resource) {
                return $resource("http://confeccioneslamilla.com/estebanprueba/cirest/index.php/consumptions/:id", {id: "@_id"}, {
                    update: {method: "PUT", params: {id: "@_id"}}
                })
            }])

        .controller('ListReloadCtrl', ['$scope', 'Reloads', '$route', function ($scope, Reloads, $route)
            {
                Reloads.get(function (data) {
                    $scope.reloads = data.response;
                });

                $scope.remove = function (id) {
                    Reloads.delete({id: id}).$promise.then(function (data) {
                        if (data.response) {
                            $route.reload();
                        }
                    })
                }
            }])
        .controller('CreateReloadCtrl', ['$scope', 'Reloads', 'Costs', function ($scope, Reloads, Costs)
            {
                //"use strict";
                var precio = 0;
                var maxIdCost = 0;
                $scope.settings = {
                    pageTitle: "Realizar Recarga",
                    action: "Recargar"
                };

                $scope.reload = {
                    Value: "",
                    TotalSeconds: "",
                    Mobile: "",
                    ReloadDate: "",
                    FK_COSTS_ID: ""
                };

                Costs.get(function (data) {
                    var datafin = data.response;
                    var costos = new Array();
                    for (var costs in datafin) {
                        costos.push(datafin[costs].Id);
                        //console.log(datafin[costs].Id);
                    }
                    maxIdCost = Math.max.apply(null, costos);

                    for (var costs in datafin) {
                        if (datafin[costs].Id == maxIdCost) {
                            precio = datafin[costs].Cost;
                        }
                    }
                });

                $scope.submit = function () {

                    function asegurar()
                    {
                        var rc = confirm("¿Seguro que desea Recargar?");
                        return rc;
                    }
                    if (asegurar()) {
                        $scope.reload.FK_COSTS_ID = maxIdCost;
                        $scope.reload.TotalSeconds = Math.round($scope.reload.Value / precio);
                        console.log($scope.reload.TotalSeconds);
                        Reloads.save({reload: $scope.reload}).$promise.then(function (data) {
                            if (data.response) {
                                angular.copy({}, $scope.reload);
                                $scope.settings.success = "La recarga se ha realizado exitosamente";
                            }
                        });
                    }
                }
            }])

        .factory('Reloads', ["$resource", function ($resource) {
                return $resource("http://confeccioneslamilla.com/estebanprueba/cirest/index.php/reloads/:id", {id: "@_id"}, {
                    update: {method: "PUT", params: {id: "@_id"}}
                })
            }])

        .controller('BalanceCtrl', ['$scope', 'Reloads', '$route', function ($scope, Reloads, $route)
            {
                //"use strict";
                $scope.settings = {
                    pageTitle: "Realizar Recarga",
                    action: "Recargar"
                };

                Reloads.get(function (data) {
                    $scope.reloads = data.response;
                });
                
                            
            }])

        .factory('Reloads', ["$resource", function ($resource) {
                return $resource("http://confeccioneslamilla.com/estebanprueba/cirest/index.php/reloads/:id", {id: "@_id"}, {
                    update: {method: "PUT", params: {id: "@_id"}}
                });
            }]);