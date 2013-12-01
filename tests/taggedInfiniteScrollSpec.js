/*jshint expr: true*/
define(['src/taggedInfiniteScroll', 'angular/mocks'], function() {
  describe('Module: tagged.directives.infiniteScroll', function() {
    beforeEach(module('tagged.directives.infiniteScroll'));

    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.clock.restore();
    });

    var testDoesNotGetMore = function(scroll) {
      return function() {
        this.stubWindow.scrollTop.returns(scroll);
        this.stubWindow.trigger('scroll');
        this.clock.tick(50);
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        this.clock.tick(50);
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.false;
      };
    };

    var testDoesGetMore = function(scroll) {
      return function() {
        this.stubWindow.scrollTop.returns(scroll);
        this.stubWindow.trigger('scroll');
        this.clock.tick(50);
        this.timeout.flush();
        this.scope.$apply();
        // 2nd timer, if any
        this.clock.tick(50);
        try { this.timeout.flush(); } catch (e) { }
        this.timeout.verifyNoPendingTasks();
        this.scope.more.called.should.be.true;
      };
    };

    describe('basic functionality', function() {
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
        sinon.stub(this.stubWindow, 'scrollTop');
        sinon.stub(this.stubWindow, 'height').returns(300);
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

      it('removes window scroll handler when element is removed', function() {
        sinon.spy(this.stubWindow, 'unbind');
        this.scope.$broadcast('$destroy');
        this.stubWindow.unbind.called.should.be.true;
      });
    });

    describe('page section offset from top by 500px', function() {
      beforeEach(inject(function($rootScope, $compile, $window, $document, $timeout) {
        this.elem = angular.element('<div tagged-infinite-scroll="more()">content</div>');
        sinon.stub(jQuery.fn, 'offset').returns({top: 500});
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
        sinon.stub(this.stubWindow, 'scrollTop');
        sinon.stub(this.stubWindow, 'height').returns(300);
        sinon.stub(angular, 'element');
        angular.element.withArgs(this.window).returns(this.stubWindow);
        this.compile(this.elem)(this.scope);
        this.scope.$apply();
      }));

      afterEach(function() {
        angular.element.restore();
        jQuery.fn.offset.restore();
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
        sinon.stub(this.stubWindow, 'scrollTop');
        sinon.stub(this.stubWindow, 'height').returns(300);
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
        sinon.stub(this.stubWindow, 'scrollTop');
        sinon.stub(this.stubWindow, 'height').returns(300);
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
          this.stubWindow.scrollTop.returns(scroll);
          this.stubWindow.trigger('scroll');
          this.clock.tick(50);
          this.timeout.flush();
          this.scope.$apply();
          this.scope.more.called.should.be.false;
          this.scope.obj.isDisabled = false;
          this.scope.$apply();
          // 2nd timer, if any
          this.clock.tick(50);
          try { this.timeout.flush(); } catch (e) { }
          this.timeout.verifyNoPendingTasks();
          this.scope.more.called.should.be.true;
        };
      };

      var testDoesNotGetMoreWhenReenabled = function(scroll) {
        return function() {
          this.stubWindow.scrollTop.returns(scroll);
          this.stubWindow.trigger('scroll');
          this.clock.tick(50);
          this.timeout.flush();
          this.scope.$apply();
          this.scope.more.called.should.be.false;
          this.scope.obj.isDisabled = false;
          this.scope.$apply();
          // 2nd timer, if any
          this.clock.tick(50);
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

    describe('enabled', function() {
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
        sinon.stub(this.stubWindow, 'scrollTop');
        sinon.stub(this.stubWindow, 'height').returns(300);
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
