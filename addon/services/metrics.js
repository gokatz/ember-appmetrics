import Ember from 'ember';

const { typeOf, Service } = Ember;

export default Service.extend({
  isMarkSupportedBrowser: true,
  isNowSupportedBrowser: true,

  secondaryPerformanceObj: {},
  metricsObj: {},

  init() {

    // detecting the browser's Compatibility over window.performance.mark and window.performance.now

    if (!(window.performance && window.performance.mark)) {
      console.warn('Performance.mark is not supported in this browser. Hence falling back to performance.now()');
      this.set('isMarkSupportedBrowser', false);

      if (!(window.performance && window.performance.now)) {
        console.warn('Performance.now is also not supported. Hence falling back to javascript Date API');
        this.set('isNowSupportedBrowser', false);
      }
    }
  },

  start(eventName) {

    if (typeOf(eventName) !== 'string') {
      console.error('Expected type String for invoking `start`');
      return -1;
    }

    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');
    secondaryPerformanceObj[eventName] = secondaryPerformanceObj[eventName] || {};
    let eventObj = secondaryPerformanceObj[eventName];


    if (this.get('isNowSupportedBrowser')) {
      if (this.get('isMarkSupportedBrowser')) {
        performance.mark(`eam:mark_${eventName}_start`);
      } else {
        eventObj.start = window.performance.now();
      }
    } else {
      eventObj.start = new Date().valueOf();
    }

    return;
  },

  end(eventName) {

    if (typeOf(eventName) !== 'string') {
      console.error('Expected type String for invoking `end`');
      return -1;
    }

    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');
    secondaryPerformanceObj[eventName] = secondaryPerformanceObj[eventName] || {}; // creating a new entry if not already present
    let eventObj = secondaryPerformanceObj[eventName];

    let metricObj = this.get('metricsObj');
    metricObj[eventName] = metricObj[eventName] || []; // creating a new entry if not already present
    let metricArray = metricObj[eventName];

    if (this.get('isNowSupportedBrowser')) {
      let startMark = `eam:mark_${eventName}_start`;
      let endMark = `eam:mark_${eventName}_end`;

      if (this.get('isMarkSupportedBrowser')) {
        performance.mark(endMark);
        performance.measure(`eam:${eventName}`, startMark, endMark);
      } else {
        eventObj.end = window.performance.now();
      }
    } else {
      eventObj.end = new Date().valueOf();
    }

    /*
    pushing to the `metricsObj` here, since pushing in measure method will leads to have duplicate entires when
    the measure api is invoked by the consuming application
    */
    let duration = this.measure(eventName);
    metricArray.push(duration);
    return duration;
  },

  measure(eventName) {
    if (typeOf(eventName) !== 'string') {
      console.error('Expected type String for invoking `measure`');
      return -1;
    }

    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');
    let eventObj = secondaryPerformanceObj[eventName] || {};

    let duration;

    if (this.get('isMarkSupportedBrowser')) {
      let perfEntries = performance.getEntriesByName(`eam:${eventName}`);
      // poping up the last entry pushed into the array
      let entry = perfEntries[perfEntries.length - 1];
      if (entry) {
        duration = entry.duration;
      }
    } else {
      duration = eventObj.end - eventObj.start;
      eventObj.duration = duration;
    }
    return typeOf(duration) === 'number' ? duration : -1;
  },

  getAllMetrics(eventName) {
    /*
      getAllMetrics will return the entires of given event name.
      if no eventName is given, it will return the entire metricsObj
    */

    if (eventName) {
      return this.get(`metricsObj.${eventName}`) || {};
    }
    return this.get('metricsObj') || {};
  },

  clearAllMetrics() {
    if (this.get('isMarkSupportedBrowser')) {
      let eventNames = Object.keys(this.get('metricsObj') || {});

      eventNames.forEach((eventName) => {
        this.clearMetric(eventName);
      });
    }
    this.set('secondaryPerformanceObj', {});
    this.set('metricsObj', {});
  },

  clearMetric(eventName) {
    if (this.get('isMarkSupportedBrowser')) {
      performance.clearMeasures(`eam:${eventName}`);
    }
    let secondaryPerformanceObj = this.get('secondaryPerformanceObj') || {};
    delete secondaryPerformanceObj[eventName];

    let metricsObj = this.get('metricsObj') || {};
    delete metricsObj[eventName];

  }

});
