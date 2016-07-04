//slot1: coffee maker, teapot, espresso machine
//slot2: coffee filter, tea strainer, espresso tamper
//slot3: coffee grounds, loose tea, ground espresso beans

var slotInfo = {
  slot1: ['Coffee Maker', 'Teapot', 'Espresso Machine'],
  slot2: ['Coffee Filter', 'Tea Strainer', 'Espresso Tamper'],
  slot3: ['Coffee Grounds', 'Loose Tea', 'Ground Espresso Beans']
};

var slotSpin = function (info) {
  var temp = Math.random();
  if(temp <= 0.33) {
    return info[0];
  }
  if (temp > 0.33 && temp <= 0.66) {
    return info[1];
  }
  if (temp > 0.66) {
    return info[2];
  }
}


angular.module('app', [])
.controller('slotsCtrl', ['$scope', function($scope) {
  $scope.slot1 = "Tea";
  $scope.slot2 = "Tea Strainer";
  $scope.slot3 = "Loose Tea";

  $scope.spin = function () {
    $scope.slot1 = slotSpin(slotInfo.slot1);
    $scope.slot2 = slotSpin(slotInfo.slot2);
    $scope.slot3 = slotSpin(slotInfo.slot3);    
  };


}])