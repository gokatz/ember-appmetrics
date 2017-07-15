# ember-appmetrics 🐹

[![Build Status](https://travis-ci.org/gokatz/ember-appmetrics.svg?branch=master)](https://travis-ci.org/gokatz/ember-appmetrics)

Ember library used to measure various metrics in your Ember app with ultra simple APIs. Especially useful for [RUM](https://en.wikipedia.org/wiki/Real_user_monitoring) in Ember SPAs.

## Installation  💻
For Ember CLI >= `0.2.3`:
```shell
ember install ember-appmetrics
```
For Ember CLI < `0.2.3`:
```shell
ember install:addon ember-appmetrics
```

## Compatibility
This addon is tested against the latest stable Ember version.

## Usage  🏹

Inject the metrics service like `'metrics: Ember.inject.service()'` into the class where you want to measure the performance or use initializers if you are going with one-time injection.

Addon provides three API for measuring the performance of a given period.
- `start` : need to call this API with an event name as an argument to mark the starting point.
- `end` : need to call this API with an event name as an argument to mark the ending point and it returns the duration for the corresponding mark.
- `measure` : will return the latest calculated time for the given event. This API will be deprecated in the future release in the favor of `end` API as the `end` method itself return the duration.


- `getAllMetrics` :

1. will return an object containing all the previously measured metrics and its duration, if no arguments were passed.
2. will return an array containing all the duration for the given metric name if the metric name is given as arguments.

- `clearAllMetrics` : Will clear out all the performance marks and measures.  

```js
    this.get('metrics').start('accounts_page');
    Ember.run.scheduleOnce('afterRender', () => {
      let accountsPageRenderDuration = this.get('metrics').end('accounts_page');
      console.log(accountsPageRenderDuration); // will return the duration to for this render performance in milliseconds.
    });
```

## Browser support 🌏

Since fall back mechanism of all level has been handled in the addon itself, the only thing addon need is that the browser must have Date API, which is supported in all major and minor browsers.

PS: In Safari, the User Timing API (performance.mark()) is not available, so the DevTools timeline will not be annotated with marks.

## Installation  💻

* `git clone` this repository
* `npm install`
* `bower install`

## Running 👟👟

* `ember server`
* Visit your app at http://localhost:4301.

## Running Tests 💉

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Contribution 👨‍👧‍👦

Missing something? Let's work together to get that done 😉
