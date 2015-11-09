(function () {
  'use strict';

  var text = function(e){
    return angular.element(e).text();
  };

  var countsModule = angular.module('counts', []);
  countsModule.factory('counts', function($rootScope){
    var service = {
      counts: {},
      reset: function(){
        service.counts = {};
      },
      count: function(name){
        return service.counts[name] || 0;
      },
      incr: function(name, value){
        if(arguments.length === 1){
          value = name;
          name = 'count';
        }
        service.counts[name] = service.count(name) + 1;
        return value;
      }
    };
    $rootScope.incr = service.incr;
    return service;
  });
  countsModule.directive('ngCountLink', [
    'counts',
    function(counts){
      return {
        link: function(scope, element, attrs){
          counts.incr(attrs.ngCountLink ? attrs.ngCountLink + 'Link' : 'link', true);
        }
      }
    }
  ]);

  describe('ng-if', function () {
    beforeEach(module('elif'));
    beforeEach(module('counts'));

    it('should be empty when the condition is false', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element('<div><div ng-if="incr(0, val)"><span ng-count-link>Content</span></div></div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.val = false;
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();

      // There are 4 watch invocations per apply instead of 2 due to the default implementation of ng-if.
      expect(counts.counts[0]).toBe(4);
      expect(counts.counts.link).toBeUndefined();

      scope.val = true;
      scope.$apply();

      expect(text(el[0].querySelector('[ng-if]'))).toBe("Content");
      expect(counts.counts[0]).toBe(8);
      expect(counts.counts.link).toBe(1);

      scope.val = false;
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(counts.counts[0]).toBe(12);
      expect(counts.counts.link).toBe(1);
    }));

    it('should be non-empty when the condition is true', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element('<div><div ng-if="incr(true)"><span ng-count-link>Content</span></div></div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(text(el[0].querySelector('[ng-if]'))).toBe("Content");
      expect(counts.counts.count).toBeGreaterThan(0);
      expect(counts.counts.link).toBe(1);
    }));

  });

  describe('ng-elif', function () {
    beforeEach(module('elif'));
    beforeEach(module('counts'));

    it('elif and else should be empty when the if is true', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element(
        '<div>' +
        '<div ng-if="incr(0, v1)"><span ng-count-link="if">If Content</span></div>' +
        '<div ng-elif="incr(1, v2)"><span ng-count-link="elif">Elif Content</span></div>' +
        '<div ng-else><span ng-count-link="else">Else Content</span></div>' +
        '</div>'
      );
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.v1 = scope.v2 = true;
      scope.$apply();

      expect(text(el[0].querySelector('[ng-if]'))).toBe("If Content");
      expect(el[0].querySelector('[ng-elif]')).toBeNull();
      expect(el[0].querySelector('[ng-else]')).toBeNull();
      expect(counts.counts[0]).toBe(4);
      expect(counts.counts[1]).toBeUndefined();
      expect(counts.counts.ifLink).toBe(1);
      expect(counts.counts.elifLink).toBeUndefined();
      expect(counts.counts.elseLink).toBeUndefined();

      scope.v1 = false;
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(text(el[0].querySelector('[ng-elif]'))).toBe("Elif Content");
      expect(el[0].querySelector('[ng-else]')).toBeNull();
      expect(counts.counts[0]).toBe(8);
      expect(counts.counts[1]).toBe(2);
      expect(counts.counts.ifLink).toBe(1);
      expect(counts.counts.elifLink).toBe(1);
      expect(counts.counts.elseLink).toBeUndefined();

      scope.v2 = false;
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(el[0].querySelector('[ng-elif]')).toBeNull();
      expect(text(el[0].querySelector('[ng-else]'))).toBe("Else Content");
      expect(counts.counts[0]).toBe(11);
      expect(counts.counts[1]).toBe(4);
      expect(counts.counts.ifLink).toBe(1);
      expect(counts.counts.elifLink).toBe(1);
      expect(counts.counts.elseLink).toBe(1);
    }));

    it('if and else should be empty when the elif is true and if is not', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element(
        '<div>' +
        '<div ng-if="incr(0, false)"><span ng-count-link="if">If Content</span></div>' +
        '<div ng-elif="incr(1, true)"><span ng-count-link="elif">Elif Content</span></div>' +
        '<div ng-else><span ng-count-link="else">Else Content</span></div>' +
        '</div>'
      );
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(text(el[0].querySelector('[ng-elif]'))).toBe("Elif Content");
      expect(el[0].querySelector('[ng-else]')).toBeNull();
      expect(counts.counts[0]).toBeGreaterThan(0);
      expect(counts.counts[1]).toBeGreaterThan(0);
      expect(counts.counts.ifLink).toBeUndefined();
      expect(counts.counts.elifLink).toBe(1);
      expect(counts.counts.elseLink).toBeUndefined();
    }));

    it('if and elif should be empty when the else matches', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element(
        '<div>' +
        '<div ng-if="incr(0, false)"><span ng-count-link="if">If Content</span></div>' +
        '<div ng-elif="incr(1, false)"><span ng-count-link="elif">Elif Content</span></div>' +
        '<div ng-else><span ng-count-link="else">Else Content</span></div>' +
        '</div>'
      );
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(el[0].querySelector('[ng-elif]')).toBeNull();
      expect(text(el[0].querySelector('[ng-else]'))).toBe("Else Content");
      expect(counts.counts[0]).toBeGreaterThan(0); // Invoked.
      expect(counts.counts[1]).toBeGreaterThan(0); // Invoked.
      expect(counts.counts.ifLink).toBeUndefined(); // But not linked.
      expect(counts.counts.elifLink).toBeUndefined(); // Not linked.
      expect(counts.counts.elseLink).toBe(1);
    }));
  });



  describe('ng-else', function () {
    beforeEach(module('elif'));
    beforeEach(module('counts'));

    it('else should be empty when the condition is true', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element('<div><div ng-if="incr(true)"><div ng-count-link="if">If Content</div></div><div ng-else><span ng-count-link="else">Else Content</span></div></div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(text(el[0].querySelector('[ng-if]'))).toBe("If Content");
      expect(el[0].querySelector('[ng-else]')).toBeNull();
      expect(counts.counts.count).toBeGreaterThan(0);
      expect(counts.counts.ifLink).toBe(1);
      expect(counts.counts.elseLink).toBeUndefined();
    }));

    it('else should be non-empty when the condition is false', inject(function($compile, $rootScope, counts){
      counts.reset();

      var el = angular.element('<div><div ng-if="incr(false)"><span ng-count-link="if">If Content</span></div><div ng-else="else"><span ng-count-link="else">Else Content</span></div></div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(el[0].querySelector('[ng-if]')).toBeNull();
      expect(text(el[0].querySelector('[ng-else]'))).toBe("Else Content");
      expect(counts.counts.count).toBeGreaterThan(0);
      expect(counts.counts.ifLink).toBeUndefined();
      expect(counts.counts.elseLink).toBe(1);
    }));
  });


})();
