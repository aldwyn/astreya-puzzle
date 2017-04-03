Array.prototype.shuffle = function() {
    var i, j, tmp;
    var deepCopy = this.map(function(item) {
        return item;
    });

    for (i = deepCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = deepCopy[i];
        deepCopy[i] = deepCopy[j];
        deepCopy[j] = tmp;
    }

    return deepCopy;
}

Array.prototype.isEqualTo = function(arr) {
    if (this.length != arr.length) {
        return false;
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this[i] !== arr[i]) {
                return false;
            }
        }
    }
    return true;
}


var puzzleApp = angular.module('puzzleApp', []).config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

puzzleApp.controller('PuzzleController', function PuzzleController($scope, $http, $window) {
    $scope.movesCounter = 0;
    $scope.timeInSeconds = 0;
    $scope.stopWatch = '00:00:00'
    $scope.puzzleNumberPool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.randomizedPool = $scope.puzzleNumberPool.shuffle();
    
    // up, right, down, left
    // -1 means no place to move
    $scope.validMoves = [
        [-1,  1,  3, -1],
        [-1,  2,  4,  0],
        [-1, -1,  5,  1],
        [ 0,  4,  6, -1],
        [ 1,  5,  7,  3],
        [ 2, -1,  8,  4],
        [ 3,  7, -1, -1],
        [ 4,  8, -1,  6],
        [ 5, -1, -1,  7],
    ];

    swal({title: 'Start?', allowEscapeKey: false}, function(isConfirm) {
        if (isConfirm) {
            $scope.timer = setInterval(function() {
                $scope.timeInSeconds++;
                var date = new Date(null);
                date.setSeconds($scope.timeInSeconds);
                $scope.stopWatch = date.toISOString().substr(11, 8);
                $scope.$apply();
            }, 1000);
        }
    });

    $scope.onDragStart = function(event) {
        var currNum = parseInt($(event.target).data('number'));
        event.dataTransfer.setData('draggedNum', currNum);
        var currNumIndex = $scope.randomizedPool.indexOf(currNum);
        var currValidMoves = $scope.validMoves[currNumIndex];
        for (var i = 0; i < 9; i++) {
            if (currValidMoves.indexOf(i) !== -1) {
                $($('.puzzle-num').get(i)).addClass('valid-move');
            } else if (currValidMoves.indexOf(i) === -1 && i !== currNumIndex) {
                $($('.puzzle-num').get(i)).addClass('invalid-move');
            }
        }
    }

    $scope.onDragEnd = function(event) {
        event.preventDefault();
        $('.puzzle-num').removeClass('valid-move');
        $('.puzzle-num').removeClass('invalid-move');
    }

    $scope.onDrop = function(event) {
        var src = parseInt(event.dataTransfer.getData('draggedNum'));
        var dest = parseInt($(event.toElement).data('number'));
        var srcIndex = $scope.randomizedPool.indexOf(src);
        var destIndex = $scope.randomizedPool.indexOf(dest);
        var currValidMoves = $scope.validMoves[srcIndex];
        if (destIndex !== -1 && currValidMoves.indexOf(destIndex) !== -1) {
            $scope.randomizedPool[destIndex] = src;
            $scope.randomizedPool[srcIndex] = dest;
            $scope.movesCounter++;
            $scope.$apply();
            $scope.checkPuzzleWin();
        }
    }

    $scope.checkPuzzleWin = function() {
        if ($scope.randomizedPool.isEqualTo($scope.puzzleNumberPool)) {
            setTimeout(function() {
                clearInterval($scope.timer);
                swal({
                    title: 'Puzzle solved!',
                    type: 'input',
                    closeOnConfirm: false,
                    allowEscapeKey: false,
                    showLoaderOnConfirm: true,
                    imageUrl: 'static/puzzle/images/fireworks.gif',
                    imageSize: '229x117',
                    inputPlaceholder: 'Enter your name...'
                },
                function(inputValue) {
                    if (inputValue === false) return false;
                    if (inputValue === '') {
                        swal.showInputError('Your name should be provided.');
                        return false;
                    } else {
                        setTimeout(function() {
                            $scope.createPuzzleResult($scope.timeInSeconds, $scope.movesCounter, inputValue);
                        }, 500);
                    }
                });
            }, 500);
        }
    }

    $scope.createPuzzleResult = function(timeInSeconds, movesCounter, playerName) {
        $http({
            method: 'POST',
            url: '/api/puzzle-completion',
            data: {
                'completion_time_in_seconds': timeInSeconds,
                'moves_count': movesCounter,
                'player_name': playerName,
            }
        }).then(function(response) {
            var timeInSecondsStr = timeInSeconds + ' second' + ((timeInSeconds > 1) ? 's' : '');
            var movesCounterStr = movesCounter + ' move' + ((movesCounter > 1) ? 's' : '');
            swal({
                title: 'Good job, ' + playerName + '!',
                type: 'success',
                html: true,
                text: 'You completed <strong>' + movesCounterStr + '</strong> in just ' +
                    '<strong>' + timeInSecondsStr + '</strong>.',
                allowEscapeKey: false,
                confirmButtonText: 'See top scores',
                showCancelButton: true,
                cancelButtonText: 'Play again',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                $window.location.href = (isConfirm) ? '/top-scores': '/';
            });
        });
    } 
});

