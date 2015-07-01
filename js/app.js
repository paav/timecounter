(function($) {
  var app = angular.module('timeCounter', []);

  app.controller('MainCtrl', function($scope) {
    var self = this, startTime, intervalHandle, parseTime, setDisplay, timerTick,
        updateTime, taskDesc, idleTime = 0, IDLE_TIME_LIMIT = 10000,
        idleInterval, lastIdle, dropIdle = false;

    $scope.clockIsRunning = false;
    startTime = -1;
    intervalHandle = null;
    $scope.timeOnClock = "00:00:00";
    $scope.taskDesc = "Do nothing";
    $scope.isOverunning = false;

    $(document).on('mousemove keypress', function() {
      if (idleTime > IDLE_TIME_LIMIT) {
        lastIdle = idleTime;
        self.lastIdle = msToString(lastIdle);
        $('#myModal').modal('show');
      }

      idleTime = 0;
    });

    setDisplay = function(timeInMs) {
      var hours, minutes, seconds;

      return $scope.timeOnClock = msToString(timeInMs);
    };

    msToString = function(timeInMs) {
      var hours, minutes, seconds;
      
      hours = Math.floor(timeInMs / 3600000);
      minutes = Math.floor((timeInMs - (hours * 3600000)) / 60000);
      seconds = Math.floor((timeInMs - (minutes * 60000)) / 1000);

      return ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2) +
        ":" + ("00" + seconds).slice(-2);
    };

    updateTime = function() {
      var timeLeft;

      timeLeft = new Date().getTime() - startTime;

      return setDisplay(timeLeft);
    };

    timerTick = function() {
      idleTime = idleTime + 500;

      return $scope.$apply(function() {
        return updateTime();
      });
    };

    $scope.start = function() {
      startTime = new Date().getTime();
      $scope.clockIsRunning = true;
      updateTime();

      return intervalHandle = setInterval(timerTick, 500);
    };

    $scope.stop = function() {
      $scope.clockIsRunning = false;

      addHistoryItem();

      clearInterval(intervalHandle);
      $scope.isOverunning = false;

      return $scope.timeOnClock = "00:00:00";
    };

    $scope.dropIdle = function() {
      $('#myModal').modal('hide');
      startTime += lastIdle;
    };

    addHistoryItem = function() {
      var $newHistItem = $('.history-item-template')
        .clone()
        .attr('class', 'history-item')
        .appendTo('.history');
      $newHistItem
        .find('.history-item-desc').text($scope.taskDesc).end()
        .find('.history-item-time').text($scope.timeOnClock);
    };
  });
}).call(this, jQuery);
