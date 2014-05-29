(function(){
  var elif = angular.module('elif', []);
    
  // This is copied from AngularJS because it is not
  // part of the public interface.
  var getBlockElements = function(nodes){
    if(!nodes || !nodes.length){
      return $();
    }
    
    var startNode = nodes[0];
    var endNode = nodes[nodes.length - 1];
    
    if(startNode === endNode){
      return $(startNode);
    }
  
    var element = startNode;
    var elements = [element];
  
    do {
      element = element.nextSibling;
      if(!element){
        break;
      }
      elements.push(element);
    }
    while(element !== endNode);
  
    return $(elements);
  };
  
  elif.factory('elif', [
    function(){
      // By requiring the scope have it's own copy of `elif.conditionals`
      // we avoid if/else-if/else structures that span AngularJS scopes.
      var getConditionals = function(scope){
        if(angular.hasOwnProperty.call(scope, 'elif.conditionals')){
          var conditionals = scope['elif.conditionals'];
          return conditionals[conditionals.length - 1];
        }
      };
      
      return {
        create: function(scope, fn, callback){
          var conditionals = [{
            fn: fn,
            callback: callback || angular.identity
          }];
          
          scope.$watch(function(){
            var i;
            var index = -1;
            
            // Find first matching if/else-if.
            for(i = 0; i < conditionals.length; i++){
              if(conditionals[i].fn()){
                conditionals[i].callback(true);
                index = i;
                i++;
                break;
              }
              else {
                conditionals[i].callback(false);
              }
            }
            
            // Mark the rest of the if/else-ifs as not matched.
            for(; i < conditionals.length; i++){
              conditionals[i].callback(false);
            }
            
            // Handle else, if there is one.
            conditionals.fallthrough && conditionals.fallthrough(index === -1);
            
            return index;
          });
          
          // Keep track of if/else-if/else structures per AngularJS scope.
          if(!angular.hasOwnProperty.call(scope, 'elif.conditionals')){
            scope['elif.conditionals'] = [];
          }
          scope['elif.conditionals'].push(conditionals);
        },
        extend: function(scope, fn, callback){
          var conditionals = getConditionals(scope);
          if(!conditionals){
            throw new Error('elif.extend: no if found at this level');
          }
          if(conditionals.fallthrough){
            throw new Error('elif.extend: else-if after else');
          }
          
          conditionals.push({
            fn: fn,
            callback: callback
          });
        },
        fallthrough: function(scope, fn, callback){
          var conditionals = getConditionals(scope);
          if(!conditionals){
            throw new Error('elif.fallthrough: no if found at this level');
          }
          if(conditionals.fallthrough){
            throw new Error('elif.fallthrough: else already found at this level');
          }
          conditionals.fallthrough = callback;
        }
      };
    }
  ]);
  
  // This implementation is basically the built-in `ng-if`, hooked into the `elif` service.
  var elifDirective = function(name, method, getter){
    elif.directive(name, [
      '$animate',
      '$document',
      '$injector',
      'elif',
      function($animate, $document, $injector, elif){
        getter = getter && $injector.invoke(getter);
        
        return {
          transclude: 'element',
          restrict: 'A',
          priorty: 600,
          terminal: true,
          link: function(scope, element, attrs, ctrls, transcludeFn){
            var watchFn = getter && getter(scope, element, attrs);
            var childScope;
            var childElement;
            var previousElements;
            
            elif[method](scope, watchFn, function(value, conditionals){
              if(value){
                if(!childScope){
                  childScope = scope.$new();
                  transcludeFn(childScope, function(clone){
                    clone[clone.length + 1] = $document[0].createComment(' end ' + name + ': ' + attrs[name] + ' ');
                    childElement = clone;
                    $animate.enter(clone, element.parent(), element);
                  });
                }
              }
              else {
                if(childScope){
                  childScope.$destroy();
                  childScope = null;
                }
                if(previousElements){
                  previousElements.remove();
                  previousElements = null;
                }
                if(childElement){
                  previousElements = getBlockElements(childElement);
                  $animate.leave(previousElements, function(){
                    previousElements = null;
                  });
                  childElement = null;
                }
              }
            });
          }
        };
      } 
    ]);
  };
  
  // Reads the attribute given by `name` and converts it to a boolean.
  var getter = function(name){
    return [
      '$parse',
      function($parse){
        return function(scope, element, attrs){
          var testFn = $parse(attrs[name]);
          return function(){
            return !!testFn(scope);
          };
        };
      }
    ];
  };
  
  // We rely on the built-in `ng-if` directive to actually perform
  // the transclusion, and simply tie it in to the `elif` service.
  elif.directive('ngIf', [
    '$injector',
    'elif',
    function($injector, elif){
      getter = $injector.invoke(getter('ngIf'));
      return {
        priority: 600,
        link: function(scope, element, attrs){
          var watchFn = getter(scope, element, attrs);
          elif.create(scope, watchFn);
        }
      }
    }
  ]);
  
  // Else-if and else perform their own transclusions.
  elifDirective('ngElseIf', 'extend', getter('ngElseIf'));
  elifDirective('ngElif', 'extend', getter('ngElif'));
  
  elifDirective('ngElse', 'fallthrough');
})();
