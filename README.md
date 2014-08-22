# ng-elif

A simple collection of control flow directives: `ng-if`, `ng-else-if`, and `ng-else`.

All directives support animations via `$animate`. `ng-if` can be used on the same element as `ng-repeat`,
just like the "real" `ng-if` that it overrides. The primary caveat is that a given if/else-if/else construct
must exist in the same AngularJS scope (hence it doesn't make sense to say that either
`ng-else-if` or `ng-else` work with `ng-repeat`, as `ng-repeat` introduces a new
scope -- obviously you can use it *within* an `ng-repeat`, or any other directive). 
Similarly, while using an `ng-if` on an `ng-include` is supported, note that
`ng-include` introduces a new scope, so that the `ng-if` is actually not on
the same scope as it would appear based solely on the structure of the DOM.  This
means that the following won't work because, despite appearances,
`ng-if` and `ng-else` are actually in *sibling* scopes:

```html
  <div ng-if="someTest" ng-include="'someTemplate'"></div>
  <div ng-else="someTest" ng-include="'someOtherTemplate'"></div>
```

Check out a [live demo](http://plnkr.co/edit/XSPP3jZL8eehu9G750ME?p=preview).

## Dependencies

1. AngularJS.

## Installation

* Load `elif.js`.

* Add `elif` as a dependency to your angular module.

```javascript
  angular.module('yourModule', [
    // ... other dependencies ...
    'elif'
  ]);
```

* Use `ng-if`, `ng-else-if`, and `ng-else` in your templates.  You can also
  use `ng-elif` as an alias for `ng-else-if` if you prefer.

## Example

```html
  <div ng-if="someCondition">
    ...
  </div>
  <p>
    Some random junk in the middle.
  </p>
  <div ng-else-if="someOther && condition">
    ...
  </div>
  <div ng-else-if="moreConditions">
    ...
  </div>
  <div ng-else>
    ...
  </div>
  
  <p>
    More nonsense.
  </p>
  
  <h1 ng-if="anotherIfElse">...</h1>
  <h1 ng-elif="elifForPythonProgrammers">...</h1>
  <h1 ng-else>...</h1>
```

It's a pretty silly example I suppose.
