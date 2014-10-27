[![Build Status](https://travis-ci.org/tagged/infinite-scroll.png)](https://travis-ci.org/tagged/infinite-scroll)
[![Dependency Status](https://gemnasium.com/tagged/infinite-scroll.png)](https://gemnasium.com/tagged/infinite-scroll)
[![Coverage Status](https://coveralls.io/repos/tagged/infinite-scroll/badge.png)](https://coveralls.io/r/tagged/infinite-scroll)

# Infinite Scroll for AngularJS
A simple, yet powerful angular directive for adding infinite scroll support to any container. The `tagged-infinite-scroll` directive has support for fetching more items in a list, disabling subsequent fetches until the current fetch completes, and optimistically fetching the next set of results before the user even reaches the bottom of the container.

[View the demo!](http://htmlpreview.github.io/?https://github.com/tagged/infinite-scroll/blob/master/demo/index.html)

The `tagged-infinite-scroll` directive uses your callback to fetch more results. In this example, the callback is `getMore()` which simply fetches the next page and appends the new items.
```js
var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.page = 1;
  $scope.items = [];
  $scope.fetching = false;

  // Fetch more items
  $scope.getMore = function() {
    $scope.page++;
    $scope.fetching = true;
    $http.get('/my/endpoint', { page : $scope.page }).then(function(items) {
      $scope.fetching = false;
      // Append the items to the list
      $scope.items = $scope.items.concat(items);
    });
  };
}]);
```
```html
<div ng-app="MyApp">
  <div ng-controller="MainController">
    <ul tagged-infinite-scroll="getMore()">
      <li ng-repeat="item in items">
        {{ item.title }}
      </li>
    </ul>
  </div>
</div>
```

### Disable During Fetch
During an AJAX event, you probably want to avoid triggering `getMore()` until the current request finishes. Otherwise, the directive may fire your callback too many times during the async action. The `tagged-infinite-scroll-disabled` attribute can help you block subsequent fetches.

**Note:** This is also useful for disabling infinite-scroll when/if the user has reached the end of all available items.

```js
var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.page = 1;
  $scope.items = [];
  $scope.fetching = false;
  $scope.disabled = false;
  $scope.getMore = function() {
    $scope.page++;
    $scope.fetching = true; // Block fetching until the AJAX call returns
    $http.get('/my/endpoint', { page : $scope.page }).then(function(items) {
      $scope.fetching = false;
      if (items.length) {
        $scope.items = $scope.items.concat(items);
      } else {
        $scope.disabled = true; // Disable further calls if there are no more items
      }
    });
  };
}]);
```
```html
<div ng-app="MyApp">
  <div ng-controller="MainController">
    <ul tagged-infinite-scroll="getMore()" tagged-infinite-scroll-disabled="fetching || disabled">
      <li ng-repeat="item in items">
        {{ item.title }}
      </li>
    </ul>
  </div>
</div>
```

### Optimistic Fetching
Before the user actually reaches the bottom of the page your callback can be triggered optimistically to help improve perceived performance. Optimistic fetching is enabled using the `tagged-infinite-scroll-distance` attribute. The callback will fire once the user has reached that number of pixels from the bottom of the container.

```html
<div ng-app="MyApp">
  <div ng-controller="MainController">
    <ul tagged-infinite-scroll="getMore()" tagged-infinite-scroll-distance="500">
      <li ng-repeat="item in items">
        {{ item.title }}
      </li>
    </ul>
  </div>
</div>
```


## Getting Started

To get started, add `taggedInfiniteScroll-min.js` to your webpage:
```html
<script type="text/javascript" src="path/to/taggedInfiniteScroll-min.js"></script>
```

And add the module `tagged.directives.infiniteScroll` to your app's dependencies:
```js
var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
```

Then simply add the `tagged-infinite-scroll` attribute to any element that will contain a list of items and provide a callback function to fetch more items. Each time the user scrolls to the bottom of that container, the callback function will be called. The callback function should fetch more items and append them to existing items.

### Requirements

* AngularJS 1.1.5 - 1.3.0
* RequireJS (Optional)

### Using RequireJS
This directive can be loaded as an AMD module if you're using RequireJS. There are a few requirements:

1. You must add paths to `angular` in your RequireJS config.
2. You must shim `angular` to export `angular`.

At minimum, your requirejs config must include this:
```js
requirejs.config({
  paths: {
    'angular': 'path/to/angular'
  },
  shim: {
    'angular': {
      'exports': 'angular'
    }
  }
});
```

Once configured, you can `require()` the original source file `src/taggedInfiniteScroll` in your app:
```js
define(['angular', 'path/to/src/taggedInfiniteScroll'], function(angular) {
  var app = angular.module('MyApp', ['tagged.directives.infiniteScroll']);
  
  // ...

});
```

## Development

**Requirements**
* nodejs 1.10.x
* npm 1.2.32

To set up the development environment, run these commands once:

```bash
# Global dependencies
$ npm install --global grunt-cli bower

# Local node dependencies (karma, etc.)
$ npm install

# 3rd-party libraries (Angular)
$ bower install
```

**Running Tests**
Once the development environment has been set up, tests can be run in a number of ways:

```bash
# Run all tests once
$ grunt test

# Run tests in development mode (enables file watcher to automatically rerun tests)
$ grunt dev
```

**Building Production Files**
```bash
# Build production files in `./`
$ grunt build
```

## Contributing
Contributions welcome! All we ask is that pull requests include unit tests. Thanks!

Copyright 2013 Tagged, Inc.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tagged/infinite-scroll/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

