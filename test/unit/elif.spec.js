(function () {
  'use strict';

  var $doc;

  var setup = function(){
    var doc = document.implementation.createHTMLDocument();
    $doc = angular.element(doc.body);
    $doc[0].documentElement = $doc[0];

    module('toggles', function($provide){
      $provide.value('$document', $doc);
    });

    inject(function($animate){
      // Override animate so it happens immediately for easier testing.
      $animate.enter = function(clone, __, element){
        element.append(clone);
      };
    });
  };

})();
