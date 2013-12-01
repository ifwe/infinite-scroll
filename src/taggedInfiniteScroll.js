define(['angular', 'underscore'], function(angular, _) {
  "use strict";

  // Allows a container to support infinite scroll
  // Based on: http://binarymuse.github.io/ngInfiniteScroll/
  var module = angular.module('tagged.directives.infiniteScroll', []);

  module.directive('taggedInfiniteScroll', ['$window', '$timeout', function($window, $timeout) {
    var SCROLL_THROTTLE = 50;

    return function(scope, elem, attrs) {
      var $win = angular.element($window);
      var enabled = true;
      var scrollDistance = 0;

      var onScroll = _.throttle(function() {
        if (!enabled) return;

        var windowHeight = $win.height();
        var elementBottom = elem.offset().top + elem.height();
        var windowBottom = windowHeight + $win.scrollTop();
        var remaining = elementBottom - windowBottom;
        var shouldGetMore = (remaining - scrollDistance <= 0);

        if (shouldGetMore) getMore();
      }, SCROLL_THROTTLE);

      var getMore = function() {
        $timeout(function() {
          scope.$eval(attrs.taggedInfiniteScroll);
        });
      };

      if (attrs.taggedInfiniteScrollDistance) {
        scope.$watch(attrs.taggedInfiniteScrollDistance, function(value) {
          scrollDistance = parseInt(value, 10);
        });
      }

      if (attrs.taggedInfiniteScrollDisabled) {
        scope.$watch(attrs.taggedInfiniteScrollDisabled, function(value) {
          enabled = !value;

          // Check immediately if we need more items upon reenabling.
          onScroll();
        });
      }

      $win.bind('scroll', onScroll);

      // Remove window scroll handler when this element is removed.
      scope.$on('$destroy', function() {
        $win.unbind('scroll', onScroll);
      });

      // Check on next event loop to give the browser a moment to paint.
      // Otherwise, the calculations may be off.
      $timeout(onScroll);
    };
  }]);
});
