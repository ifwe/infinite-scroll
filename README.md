[![Build Status](https://travis-ci.org/tagged/infinite-scroll.png)](https://travis-ci.org/tagged/infinite-scroll)

Infinite Scroll for AngularJS
=============================
By [Tagged](http://www.tagged.com)

Easily add infinite scroll support to any container by using the `tagged-infinite-scroll` directive.

Requirements
------------

* AngularJS 1.1.5 - 1.2.x
* jQuery 1.10.x
* Underscore 1.5.x
* RequireJS (Optional)

Demo
----

[View the demo!](http://htmlpreview.github.io/?https://github.com/tagged/infinite-scroll/blob/master/demo/index.html)

Basic Usage
-----

To get started, add `build/taggedInfiniteScroll-min.js` to your webpage:

    <script type="text/javascript" src="path/to/taggedInfiniteScroll-min.js"></script>

And add the module `tagged.directives.infiniteScroll` to your app's dependencies:

    var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);

Next, add the attribute `tagged-infinite-scroll` to any element that will contain the items, and pass in a callback function that will be used to fetch more items. Each time the user scrolls to the bottom of that container, the callback function will be called. The callback function should fetch more items and append them to existing items.

    ## HTML
    <div ng-app="MyApp">
      <div ng-controller="MainController">
        <ul tagged-infinite-scroll="getMore()">
          <li ng-repeat="item in items">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </div>

    ## Javascript
    var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
    app.controller('MainController', ['$scope', '$http', function($scope, $http) {
      $scope.items = [];
      $scope.getMore = function() {
        $scope.items.push({
          title: 'A new item!'
        });
      };
    }]);

Disable During Fetch
--------------------

If your `getMore()` callback fetches more items asynchronously (e.g. AJAX), you'll want to temporarily disable the `tagged-infinite-scroll` directive. Otherwise, the directive may fire your callback too many times during the async action.

To support async callbacks, assign an expression to the `tagged-infinite-scroll-disabled` attribute. When the expression is falsy, the directive will not fire your callback.

**Note:** This is also useful for disabling infinite-scroll when/if the user has reached the end of all available items.

    ## HTML
    <div ng-app="MyApp">
      <div ng-controller="MainController">
        <ul tagged-infinite-scroll="getMore()" tagged-infinite-scroll-disabled="fetching || disabled">
          <li ng-repeat="item in items">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </div>

    ## Javascript
    var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
    app.controller('MainController', ['$scope', '$http', function($scope, $http) {
      $scope.page = 1;
      $scope.items = [];
      $scope.fetching = false;
      $scope.disabled = false;
      $scope.getMore = function() {
        $scope.page++;
        $scope.fetching = true;
        $http.get('/my/endpoint', { page : $scope.page }).then(function(items) {
          $scope.fetching = false;
          if (items.length) {
            $scope.items = $scope.items.concat(items);
          } else {
            $scope.disabled = true;
          }
        });
      };
    }]);

Optimistic Fetching
-------------------

Your callback can be fired optimisticly before the user reaches the bottom to help improve perceived performance. To enable this, use the attribute `tagged-infinite-scroll-distance`. When set, the callback will fire once the user has reached that number of pixels from the bottom of the container.

    ## HTML
    <div ng-app="MyApp">
      <div ng-controller="MainController">
        <ul tagged-infinite-scroll="getMore()" tagged-infinite-scroll-distance="500">
          <li ng-repeat="item in items">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </div>

Using RequireJS
---------------

This directive can be loaded as an AMD module if you're using RequireJS. There are a few requirements:

1. You must add paths to `angular` and `underscore` in your RequireJS config.
2. You must shim `angular` to export `angular`, and it must be dependent on `jquery` (path to jquery does not matter).
3. You must shim `underscore` to export `_`.

At minimum, your requirejs config must include this:

    requirejs.config({
      paths: {
        'angular': 'path/to/angular',
        'underscore': 'path/to/underscore'
      },
      shim: {
        'angular': {
          'exports': 'angular',
          'deps': ['path/to/jquery']
        },
        'underscore': {
          'exports': '_'
        }
      }
    });

Once configured, you can `require()` the original source file `src/taggedInfiniteScroll` in your app:

    define(['angular', 'path/to/src/taggedInfiniteScroll'], function(angular) {
      var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
      // ... //
    });

Development
-----------

**Requirements**
* nodejs 1.10.x
* npm 1.2.32

To set up the development environment, run these commands once:

    # Global dependencies
    $ npm install --global grunt-cli bower

    # Local node dependencies (karma, etc.)
    $ npm install

    # 3rd-party libraries (Angular, jQuery, etc.)
    $ bower install

** Running Tests**
Once the development environment has been set up, tests can be run in a number of ways:

    # Run all tests once
    $ grunt test

    # Run tests in development mode (enables file watcher to automatically rerun tests)
    $ grunt dev

**Building Production Files**

    # Build production files in `/build`
    $ grunt build

**Contributions welcome!**
All we ask is that pull requests include unit tests. Thanks!
