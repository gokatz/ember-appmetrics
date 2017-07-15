import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import wait from '../../helpers/wait';

const { typeOf } = Ember;

moduleFor('service:metrics', 'Unit | Service | metrics');

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});


test('Test "start" method on "mark" supported browsers', function (assert) {
  var done = assert.async();

  let service = this.subject();
  service.start('app_dashboard_0');

  if (service.get('isMarkSupportedBrowser')) {
    let startMark = window.performance.getEntriesByName('eam:mark_app_dashboard_0_start', 'mark');
    assert.ok(startMark.length, 'performance entry has been marked');
  } else {
    let msg = 'Sorry this browser on which the test is running is not a window performance supported one. Try to run this test in latest chrome or firefox';
    assert.equal(1,1, msg);
  }

  done();

});

test('Test "start" method on "now" supported browsers', function (assert) {
  var done = assert.async();

  let service = this.subject();
  service.set('isMarkSupportedBrowser', false);

  service.start('app_dashboard_1');
  let appDashboardEntry = service.get('secondaryPerformanceObj').app_dashboard_1;
  assert.equal(typeOf(appDashboardEntry.start), 'number' , '"app_dashboard_1" has start entry in secondaryPerformanceObj after calling "start" on "now" supported browsers');

  done();

});

test('Test "start" method on classic browsers which doesn`t support "now" and "mark"', function (assert) {
  var done = assert.async();

  let service = this.subject();
  service.set('isMarkSupportedBrowser', false);
  service.set('isNowSupportedBrowser', false);

  service.start('app_dashboard_2');
  let appDashboardEntry = service.get('secondaryPerformanceObj').app_dashboard_2;
  assert.equal(typeOf(appDashboardEntry.start), 'number' , '"app_dashboard_2" has start entry in secondaryPerformanceObj after calling "start" on old browsers');

  done();

});


test('Test "start" - wrong invocation', function (assert) {
  var done = assert.async();

  let service = this.subject();
  let status = service.start();

  assert.equal(status, -1 , 'Caught the wrong invocation of "start"');

  done();

});

test('Test "end" method on "mark" supported browsers', function (assert) {
  var done = assert.async();

  let service = this.subject();

  service.start('app_dashboard_3');
  wait(100);
  let duration = service.end('app_dashboard_3');

  assert.equal(typeOf(duration), 'number' , '"end" method return a numeric duration');
  assert.ok(duration >= 0, 'returned valid duration');

  if (service.get('isMarkSupportedBrowser')) {
    let eventEntires = window.performance.getEntriesByName('eam:app_dashboard_3');
    assert.equal(eventEntires.length, 1, '"start" method adds an entry in window.performance if the browser supports the same');

    let appDashboardEntry = service.get('secondaryPerformanceObj').app_dashboard_3;
    assert.notOk(appDashboardEntry.start && typeOf(appDashboardEntry.start) === 'number', 'secondaryPerformanceObj has no "start" time');
    assert.notOk(appDashboardEntry.end  && typeOf(appDashboardEntry.end) === 'number', 'secondaryPerformanceObj has no "end" time');
    assert.notOk(typeOf(appDashboardEntry.duration) === 'number', 'secondaryPerformanceObj has no duration');

  } else {
    let msg = 'Sorry this browser on which the test is running is not a window performance supported one. Try to run this test in latest chrome or firefox';
    assert.equal(1,1, msg);
  }

  done();

});

test('Test "end" method on "now" supported browsers', function (assert) {
  var done = assert.async();

  let service = this.subject();
  service.set('isMarkSupportedBrowser', false);

  service.start('app_dashboard_4');
  wait(100);
  let duration = service.end('app_dashboard_4');

  assert.equal(typeOf(duration), 'number' , '"end" method return a numeric duration');
  assert.ok(duration >= 0, 'returned valid duration');

  let appDashboardEntry = service.get('secondaryPerformanceObj').app_dashboard_4;
  assert.ok(appDashboardEntry.start && typeOf(appDashboardEntry.start) === 'number', 'secondaryPerformanceObj has "start" time');
  assert.ok(appDashboardEntry.end  && typeOf(appDashboardEntry.end) === 'number', 'secondaryPerformanceObj has "end" time');
  assert.ok(typeOf(appDashboardEntry.duration) === 'number', 'secondaryPerformanceObj has duration');

  done();

});

test('Test "end" method on old classic browsers', function (assert) {
  var done = assert.async();

  let service = this.subject();
  service.set('isMarkSupportedBrowser', false);
  service.set('isNowSupportedBrowser', false);

  service.start('app_dashboard_5');
  wait(100);
  let duration = service.end('app_dashboard_5');

  assert.equal(typeOf(duration), 'number' , '"end" method return a numeric duration');
  assert.ok(duration >= 0, 'returned valid duration');

  let appDashboardEntry = service.get('secondaryPerformanceObj').app_dashboard_5;
  assert.ok(appDashboardEntry.start && typeOf(appDashboardEntry.start) === 'number', 'secondaryPerformanceObj has "start" time');
  assert.ok(appDashboardEntry.end  && typeOf(appDashboardEntry.end) === 'number', 'secondaryPerformanceObj has "end" time');
  assert.ok(typeOf(appDashboardEntry.duration) === 'number', 'secondaryPerformanceObj has duration');

  done();

});

test('Test "end" - wrong invocation', function (assert) {
  var done = assert.async();

  let service = this.subject();
  let status = service.end();

  assert.equal(status, -1 , 'Caught the wrong invocation of "end"');
  done();

});


test('Test "measure" method', function (assert) {
  var done = assert.async();

  let service = this.subject();

  service.start('app_dashboard_6');
  wait(100);
  service.end('app_dashboard_6');
  let duration = service.measure('app_dashboard_6');

  assert.equal(typeOf(duration), 'number' , '"measure" method return a numeric duration');
  assert.ok(duration >= 0, 'returned valid duration');

  done();

});

test('Test "measure" - wrong invocation', function (assert) {
  var done = assert.async();

  let service = this.subject();
  let status = service.measure();

  assert.equal(status, -1 , 'Caught the wrong invocation of "measure"');
  done();

});

test('Test "getAllMetrics"  method', function (assert) {
  var done = assert.async();

  let service = this.subject();

  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');

  let appDashboardMetrics = service.getAllMetrics('app_dashboard_7');

  assert.equal(typeOf(appDashboardMetrics), 'array' , '"measure" method return an array');
  assert.equal(appDashboardMetrics.length, 3 , 'returned array contains all the 3 entires app_dashboard_7');

  done();

});

test('Test "clearMetric"  method', function (assert) {
  var done = assert.async();

  let service = this.subject();

  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');

  service.clearMetric('app_dashboard_7');
  assert.notOk(service.get('secondaryPerformanceObj').app_dashboard_7 , 'app_dashboard_7 has been deleted from secondaryPerformanceObj');
  assert.ok(service.get('secondaryPerformanceObj').app_dashboard_8 , 'but app_dashboard_8 has not been deleted');

  if (service.get('isMarkSupportedBrowser')) {
    let perfFor7 = window.performance.getEntriesByName('app_dashboard_7');
    let perfFor8 = window.performance.getEntriesByName('app_dashboard_8');
    assert.notOk(perfFor7.length, 'no entires found for app_dashboard_7 in window performance object');
    assert.notOk(perfFor8.length, 'but entires exist for app_dashboard_8');
  }

  done();

});

test('Test "clearAllMetrics"  method', function (assert) {
  var done = assert.async();

  let service = this.subject();

  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');
  wait(100);
  service.start('app_dashboard_8');
  service.end('app_dashboard_8');
  wait(100);
  service.start('app_dashboard_7');
  service.end('app_dashboard_7');


  service.clearAllMetrics();
  assert.notOk(service.get('secondaryPerformanceObj').app_dashboard_7 , 'app_dashboard_7 has been deleted from secondaryPerformanceObj after clearAllMetrics');
  assert.notOk(service.get('secondaryPerformanceObj').app_dashboard_8 , 'app_dashboard_8 has been deleted from secondaryPerformanceObj after clearAllMetrics');

  if (service.get('isMarkSupportedBrowser')) {
    let perfFor7 = window.performance.getEntriesByName('app_dashboard_7');
    let perfFor8 = window.performance.getEntriesByName('app_dashboard_8');
    assert.notOk(perfFor7.length, 'no entires found for app_dashboard_7 in window performance object after clearAllMetrics');
    assert.notOk(perfFor8.length, 'no entires found for app_dashboard_8 in window performance object after clearAllMetrics');
  }
  done();

});
