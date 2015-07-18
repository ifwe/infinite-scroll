/*jshint expr: true*/
define(['src/taggedInfiniteScroll', 'angular/mocks'], function() {
  describe('Module: tagged.directives.infiniteScroll', function() {
    beforeEach(module('tagged.directives.infiniteScroll', function($provide){
      $document = angular.element(document);
      $provide.decorator('$window', function($delegate){
        return {
          triggerHandler: function(evt){
            $delegate.triggerHandler(evt);
          },
          scrollY: 0,
          innerHeight: 0,
          addEventListener: function(type, fn, useCapture){
            $delegate.addEventListener(type, fn, useCapture);
          },
          removeEventListener: function(type, fn, useCapture){
            $delegate.removeEventListener(type, fn, useCapture);
          },
          attachEvent: function(type, fn){
            $delegate.attachEvent('on' + type, fn);
          },
          detachEvent: function(type, fn){
            $delegate.detachEvent('on' + type, fn);
          }
        };
      });
      $provide.value('$document', $document);
    }));

    var testDoesNotGetMore = function(scroll) {
      return function() {
        this.stubWindow[0].scrollY = scroll;
        this.stubWindow.triggerHandler('scroll');
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.false;
      };
    };

    var testDoesNotGetMoreInterwebExploder = function(scroll) {
      return function() {
        this.stubWindow[0].pageYOffset = scroll;
        this.stubWindow.triggerHandler('scroll');
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.false;
      };
    };

    var testDoesGetMore = function(scroll) {
      return function() {
        this.stubWindow[0].scrollY = scroll;
        this.stubWindow.triggerHandler('scroll');
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.true;
      };
    };

    var testDoesGetMoreInterwebExploder = function(scroll) {
      return function() {
        this.stubWindow[0].pageYOffset = scroll;
        this.stubWindow.triggerHandler('scroll');
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.true;
      };
    };

    describe('basic functionality', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()">content</div>');
        this.elem.css({
          height: '1000px',
        });
        this.scope = $rootScope.$new();
        this.scope.more = angular.noop;
        sinon.spy(this.scope, 'more');
        this.compile = $compile;
        this.document = $document;
        this.timeout = $timeout;
        this.window = $window;

        this.stubWindow = angular.element(this.window);
        this.stubWindow[0].innerHeight = 300;
        this.document.find('body').append(this.elem);
        this.document.find('body').css({
          'margin': '0',
          'padding': '0'
        });
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        this.elem.remove();
      });

      angular.forEach([0, 100, 200, 300, 400, 500, 600], function(scroll) {
        it('does not get more if scrolled to ' + scroll + ' / 1000', testDoesNotGetMore(scroll));
      });

      angular.forEach([700, 800, 900, 1000], function(scroll) {
        it('gets more when scrolled to ' + scroll + ' / 1000', testDoesGetMore(scroll));
      });

      describe('Interweb Exploder support', function() {
        angular.forEach([0, 100, 200, 300, 400, 500, 600], function(scroll) {
          it('does not get more if scrolled to ' + scroll + ' / 1000', testDoesNotGetMoreInterwebExploder(scroll));
        });

        angular.forEach([700, 800, 900, 1000], function(scroll) {
          it('gets more when scrolled to ' + scroll + ' / 1000', testDoesGetMoreInterwebExploder(scroll));
        });
      });

      it('removes window scroll handler when element is removed', function() {
        sinon.spy(this.stubWindow, 'unbind');
        this.scope.$broadcast('$destroy');
        this.stubWindow.unbind.called.should.be.true;
      });
    });

    describe('page section offset from top by 500px', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()">content</div>');
        this.elem.css({
          height: '1000px'
        });
        this.scope = $rootScope.$new();
        this.scope.more = angular.noop;
        sinon.spy(this.scope, 'more');
        this.compile = $compile;
        this.document = $document;
        this.timeout = $timeout;
        this.window = $window;
        this.stubWindow = angular.element(this.window);
        this.stubWindow[0].innerHeight = 300;
        this.document.find('body').append(this.elem);
        this.document.find('body').css({
          'margin-top': '500px',
          'padding': '0'
        });
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        this.elem.remove();
      });

      angular.forEach([600, 700, 800, 900, 1000], function(scroll) {
        it('does not get more if scrolled to ' + scroll + ' / 1500', testDoesNotGetMore(scroll));
      });

      angular.forEach([1200, 1300], function(scroll) {
        it('gets more when scrolled to ' + scroll + ' / 1500', testDoesGetMore(scroll));
      });
    });

    describe('scroll distance offset of 100px', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()" tagged-infinite-scroll-distance="100">content</div>');
        this.elem.css({
          height: '1000px'
        });
        this.scope = $rootScope.$new();
        this.scope.more = angular.noop;
        sinon.spy(this.scope, 'more');
        this.compile = $compile;
        this.document = $document;
        this.timeout = $timeout;
        this.window = $window;
        this.stubWindow = angular.element(this.window);
        this.stubWindow[0].innerHeight = 300;
        this.document.find('body').append(this.elem);
        this.document.find('body').css({
          'margin': '0',
          'padding': '0'
        });
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        this.elem.remove();
      });

      angular.forEach([400, 500], function(scroll) {
        it('does not get more if scrolled to ' + scroll + ' / 1000', testDoesNotGetMore(scroll));
      });

      angular.forEach([600, 700], function(scroll) {
        it('gets more when scrolled to ' + scroll + ' / 1000', testDoesGetMore(scroll));
      });
    });

    describe('disabled', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()" tagged-infinite-scroll-disabled="obj.isDisabled">content</div>');
        this.elem.css({
          height: '1000px'
        });
        this.scope = $rootScope.$new();
        this.scope.more = angular.noop;
        sinon.spy(this.scope, 'more');
        this.scope.obj = { isDisabled: true };
        this.compile = $compile;
        this.document = $document;
        this.timeout = $timeout;
        this.window = $window;
        this.stubWindow = angular.element(this.window);
        this.stubWindow[0].innerHeight = 300;
        this.document.find('body').append(this.elem);
        this.document.find('body').css({
          'margin': '0',
          'padding': '0'
        });
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        this.elem.remove();
      });

      angular.forEach([600, 700, 800, 900, 1000], function(scroll) {
        it('does not get more if infinite scroll is disabled when scrolled to ' + scroll + ' / 1000px', testDoesNotGetMore(scroll));
      });

      var testDoesGetMoreWhenReenabled = function(scroll) {
        return function() {
          this.stubWindow[0].scrollY = scroll;
          this.stubWindow.triggerHandler('scroll');
          this.timeout.flush();
          this.scope.$apply();
          this.scope.more.called.should.be.false;
          this.scope.obj.isDisabled = false;
          this.scope.$apply();
          // 2nd timer, if any
          try { this.timeout.flush(); } catch (e) { }
          this.timeout.verifyNoPendingTasks();
          this.scope.more.called.should.be.true;
        };
      };

      var testDoesNotGetMoreWhenReenabled = function(scroll) {
        return function() {
          this.stubWindow[0].scrollY = scroll;
          this.stubWindow.triggerHandler('scroll');
          this.timeout.flush();
          this.scope.$apply();
          this.scope.more.called.should.be.false;
          this.scope.obj.isDisabled = false;
          this.scope.$apply();
          // 2nd timer, if any
          try { this.timeout.flush(); } catch (e) { }
          this.timeout.verifyNoPendingTasks();
          this.scope.more.called.should.be.false;
        };
      };

      angular.forEach([300, 400, 500, 600], function(scroll) {
        it('does not get more if infinite scroll is reenabled when scrolled to ' + scroll + ' / 1000px', testDoesNotGetMoreWhenReenabled(scroll));
      });

      angular.forEach([700, 800, 900, 1000], function(scroll) {
        it('gets more if infinite scroll is reenabled when scrolled to ' + scroll + ' / 1000px', testDoesGetMoreWhenReenabled(scroll));
      });
    });

    ('enabled', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()" tagged-infinite-scroll-disabled="isDisabled">content</div>');
        this.elem.css({
          height: '1000px'
        });
        this.scope = $rootScope.$new();
        this.scope.more = angular.noop;
        sinon.spy(this.scope, 'more');
        this.scope.isDisabled = false;
        this.compile = $compile;
        this.document = $document;
        this.timeout = $timeout;
        this.window = $window;
        this.stubWindow = angular.element(this.window);
        this.stubWindow[0].innerHeight = 300;
        this.document.find('body').append(this.elem);
        this.document.find('body').css({
          'margin': '0',
          'padding': '0'
        });
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        this.elem.remove();
      });

      angular.forEach([700, 800, 900, 1000], function(scroll) {
        it('gets more if infinite scroll is enabled and scrolled to ' + scroll + ' / 1000px', testDoesGetMore(scroll));
      });
    });
  });
});
