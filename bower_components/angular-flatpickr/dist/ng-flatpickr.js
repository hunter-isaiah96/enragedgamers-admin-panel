(function(root, factory) {
  'use strict';
  root['angular-flatpickr'] = factory(root.angular, root.flatpickr);
}(this, function(angular, flatpickr) {

  'use strict';
  var ngFlatpickr = angular.module('angular-flatpickr', []);
  ngFlatpickr.directive('ngFlatpickr', [function() {
    return {
      require: 'ngModel',
      restrict : 'A',
      scope : {
        fpOpts : '&',
        fpOnSetup : '&'
      },
      link : function(scope, element, attrs, ngModel) {
        var vp;
        if (scope.fpOpts()) {
          vp = flatpickr(element[0], scope.fpOpts());
        } else {
          vp = flatpickr(element[0]);
        }

        if (scope.fpOnSetup) {
          scope.fpOnSetup({
            fpItem : vp
          });
        }
        element.on('click', function (e) {
          scope.$apply(function() {
            ngModel.$setViewValue(vp.selectedDateObj);
          });
        });
      }
    };
  }]);

  return ngFlatpickr;

}));
