# ember-appmetrics

[![Build Status](https://travis-ci.org/gokatz/ember-appmetrics.svg?branch=master)](https://travis-ci.org/gokatz/ember-appmetrics)

The ember version of [appmetrics.js](https://github.com/ebidel/appmetrics.js). Used to measure various things in your Ember app with ever simple APIs.

## Installation
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

## Usage

Inject the metrics service like `'metrics: Ember.inject.service()'` into the class where you want to measure the performance or use initializers if you are going with one-time injection.

Addon provides three API to measure the performace of a given period.
- `start` : need to call this api with an event name as argument to mark the starting point
- `end` : need to call this api with an event name as argument to mark the ending point
- `measure` : will return the calculated time for the given event

```js
    this.get('metrics').start('accounts_page');
    Ember.run.scheduleOnce('afterRender', () => {
      this.get('metrics').end('accounts_page');
      let accountsPageRenderDuration = this.get('metrics').measure('accounts_page');
      console.log(accountsPageRenderDuration); // will return the duration to for this render performance in milliseconds.
    });
```

## Browser support

Since fall back machanism of all level has been handled in addon itself, the only thing addon needs is that the browser must have Date API, which is supported in all major and minor browsers.

PS: In Safari, the User Timing API (performance.mark()) is not available, so the DevTools timeline will not be annotated with marks.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
