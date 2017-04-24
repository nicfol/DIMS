angular.module('app', ['ngRoute', 'ngResource'])

    //---------------
    // Services
    //---------------

    // Use as Todos.get....Todos.update...
/*
    am.factory('Todos', ['$resource', function($resource){
        // $resource provides get,save,query,remove, delete, but is missing update
        return $resource('/todos/:id', null, {
            'update': { method:'PUT' }
        });
    }]);
*/
    //---------------
    // Controllers
    //---------------

    .controller('TodoController', ['$scope', '$resource', function ($scope,$resource) {
        var Todos = $resource('/todos/:id', null, {
            'update': { method:'PUT' }
        });
        $scope.editing = [];
        //$scope.todos =myTodo.query();
        $scope.todos = Todos.query(); // fires a "get /todos" (from $resource)

        $scope.save = function(){
            if(!$scope.newTodo || $scope.newTodo.length < 1) return;
            var todo = new Todos({ name: $scope.newTodo, completed: false });

            todo.$save(function(){ //save todo object on server
                $scope.todos.push(todo); // push todo data into array todos
                $scope.newTodo = ''; // clear textbox
            });
        }

        $scope.update = function(index){
            var todo = $scope.todos[index];
            Todos.update({id: todo._id}, todo);
            $scope.editing[index] = false;
        }

        $scope.edit = function(index){
            $scope.editing[index] = angular.copy($scope.todos[index]);
        }

        $scope.cancel = function(index){
            $scope.todos[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        }

        $scope.remove = function(index){
            var todo = $scope.todos[index];
            Todos.remove({id: todo._id}, function(){
                $scope.todos.splice(index, 1);
            });
        }
    }])

    .controller('TodoDetailCtrl', ['$scope', '$routeParams', '$location','$resource',
        function ($scope, $routeParams, $location,$resource) {
        var Todos = $resource('/todos/:id', null, {
            'update': { method:'PUT' }
        });
        $scope.todo = Todos.get({id: $routeParams.id });

        $scope.update = function(){
            Todos.update({id: $scope.todo._id}, $scope.todo, function(){
                $location.url('/');
            });
        }

        $scope.remove = function(){
            Todos.remove({id: $scope.todo._id}, function(){
                $location.url('/');
            });
        }
    }])

    //---------------
    // Routes
    //---------------

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/todos.html',
                controller: 'TodoController'
            })

            .when('/:id', {
                templateUrl: '/views/todosDetailed.html',
                controller: 'TodoDetailCtrl'
            });
    }]);