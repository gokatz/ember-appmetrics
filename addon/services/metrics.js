import Ember from 'ember';

const { typeOf } = Ember;

export default Ember.Service.extend({
  isMarkSupportedBrowser: true,
  isNowSupportedBrowser: true,

  secondaryPerformanceObj: {},

  init() {
    if (!(window.performance && window.performance.mark)) {
      console.log('Performance.mark is not supported in this browser. Hence falling back to performance.now()');
      this.set('isMarkSupportedBrowser', false);

      if (!(window.performance && window.performance.now)) {
        console.log('Performance.now is also not supported. Hence falling back to javascript Date API');
        this.set('isNowSupportedBrowser', false);

      }
    }
  },

  start(eventName) {
    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');
    secondaryPerformanceObj[eventName] = secondaryPerformanceObj[eventName] || {};
    let eventObj = secondaryPerformanceObj[eventName];

    if (typeOf(eventName) !== 'string') {
      throw 'Expected type String for invoking `start`';
    }

    if (this.get('isNowSupportedBrowser')) {
      if (this.get('isMarkSupportedBrowser')) {
        performance.mark(`mark_${eventName}_start`);
      } else {
        eventObj.start = window.performance.now();
      }
    } else {
      eventObj.start = new Date().valueOf();
    }

    return;
  },

  end(eventName) {
    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');

    secondaryPerformanceObj[eventName] = secondaryPerformanceObj[eventName] || {};
    let eventObj = secondaryPerformanceObj[eventName];

    if (typeOf(eventName) !== 'string') {
      throw 'Expected type String for invoking `end`';
    }

    if (this.get('isNowSupportedBrowser')) {
      let startMark = `mark_${eventName}_start`;
      let endMark = `mark_${eventName}_end`;

      if (this.get('isMarkSupportedBrowser')) {
        performance.mark(endMark);
        performance.measure(eventName, startMark, endMark);
      } else {
        eventObj.end = window.performance.now();
      }
    } else {
      eventObj.end = new Date().valueOf();
    }
    return;
  },

  measure(eventName) {
    let secondaryPerformanceObj = this.get('secondaryPerformanceObj');
    let eventObj = secondaryPerformanceObj[eventName] || {};
    let duration;

    if (this.get('isMarkSupportedBrowser')) {
      let perfEntries = performance.getEntriesByName(eventName);
      // poping up the last entry pushed into teh array
      let entry = perfEntries[perfEntries.length - 1];
      if (entry) {
        duration = entry.duration;
      }
    } else {
      duration = eventObj.end - eventObj.start;
    }

    return duration || -1;
  }

});
