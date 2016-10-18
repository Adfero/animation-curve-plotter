var app = angular.module('anim-curve-plotter', [
  'ui.router',
  'LocalStorageModule'
]);

angular.module('anim-curve-plotter')
  .factory('EqStorage',['localStorageService',function(localStorageService) {
    return {
      'getEquations': function() {
        return localStorageService.get('equations') || [];
      },
      'putEquations': function(equations) {
        localStorageService.set('equations',equations);
      }
    }
  }])
  .controller('AppController',['EqStorage','$scope','$element',function(EqStorage,$scope,$element) {
    $scope.equations = EqStorage.getEquations();
    $scope.$watch('equations',function() {
      EqStorage.putEquations($scope.equations);
      $scope.drawEquations();
    },true);
    $scope.errorClass = function(equation) {
      return equation.error ? 'has-error' : null;
    }
    $scope.addEquation = function() {
      $scope.equations.push({
        'text':'x',
        'error': false,
        'color': randomColor()
      });
    }
    $scope.removeEquation = function(i) {
      $scope.equations.splice(i, 1);
    }
    $scope.drawEquations = function() {
      var _step = 0.01;
      var _min = -1;
      var _max = 2;
      var canvas = $element.find('canvas')[0];
      var ctx = canvas.getContext('2d');

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      function getX(x) {
        return (((x + 1)/3) * canvas.width);
      }
      function getY(y) {
        return (((y + 1)/3) * -canvas.height) + canvas.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#AAA';
      for(var p = _min; p <= _max; p += 0.1) {
        ctx.beginPath();
        ctx.moveTo(getX(_min),getY(p));
        ctx.lineTo(getX(_max),getY(p));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(getX(p),getY(_min));
        ctx.lineTo(getX(p),getY(_max));
        ctx.stroke();
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(getX(0),getY(_min));
      ctx.lineTo(getX(0),getY(_max));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(getX(_min),getY(0));
      ctx.lineTo(getX(_max),getY(0));
      ctx.stroke();

      ctx.lineWidth = 1;
      $scope.equations.forEach(function(equation) {
        try {
          ctx.strokeStyle = equation.color;
          var lastPoint = null;
          for(var x = _min; x <= _max; x += _step) {
            var thisPoint = {
              'x': getX(x),
              'y': getY(eval(equation.text))
            };
            if (lastPoint) {
              ctx.beginPath();
              ctx.moveTo(lastPoint.x,lastPoint.y);
              ctx.lineTo(thisPoint.x,thisPoint.y);
              ctx.stroke();
            }
            lastPoint = thisPoint;
          }
          equation.error = false;
        } catch(e) {
          equation.error = true;
        }
      });

      ctx.beginPath();
      ctx.arc(getX(1), getY(1), 4, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    $scope.drawEquations();
  }])
  .config(['$urlRouterProvider','$stateProvider','localStorageServiceProvider',function($urlRouterProvider,$stateProvider,localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('anim-curve-plotter');
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('months', {
      url: '/:eq',
      templateUrl: 'partials/app.html',
      controller: 'AppController'
    })
  }])
  .run(function($state) {});
