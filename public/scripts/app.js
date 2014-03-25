'use strict'

var nirc = angular.module("nirc", []);

nirc.controller("ChatCtrl", function($scope, socket) {
    while ( ! $scope.myName) {
        $scope.myName = prompt("Name: ");
    }
    $scope.message = "";
    $scope.messages = [];
    //
    // introduce yourself
    socket.emit('login', $scope.myName);
    //
    // Listeners
    socket.on('message', function (data) {
        $scope.messages.push(data);
    });
    socket.on('participants', function (data) {
        $scope.participants = data;
    });
    //
    // scope functions
    $scope.submit = function(){
        socket.emit('message', {msg: $scope.message});
        $scope.messages.push({name: $scope.myName, msg: $scope.message});
        $scope.message = "";
    };

    $(window).bind('beforeunload', function() {
        socket.emit('logout', {});
    });
})

nirc.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
