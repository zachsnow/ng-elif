# ng-elif

A simple collection of control flow directives: `nge-if`, `nge-else-if`, and `nge-else`.
Supports animations via `$animate`. `nge-if` can be used in on the same element as `ng-repeat`,
just like `ng-if`. The primary caveat is that a given if/else-if/else construct
must exist in the same AngularJS scope (hence it doesn't make sense to say that either
`nge-else-if` or `nge-else` work with `ng-repeat`, as `ng-repeat` introduces a new
scope -- obviously you can use it *within* an `ng-repeat`, or any other directive). 

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

* Use `nge-if`, `nge-else-if`, and `nge-else` in your templates.

## Example

```html
  <div nge-if="someCondition">
    ...
  </div>
  <p>
    Some random junk in the middle.
  </p>
  <div nge-else-if="someOther && condition">
    ...
  </div>
  <div nge-else-if="moreConditions">
    ...
  </div>
  <div nge-else>
    ...
  </div>
  
  <p>
    More nonsense.
  </p>
  
  <h1 nge-if="anotherIfElse">...</h1>
  <h1 nge-else>...</h1>
```

It's a pretty silly example I suppose.
