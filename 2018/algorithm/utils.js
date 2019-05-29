const { PerformanceObserver, performance } = require('perf_hooks');

exports.benchmark = (...args) => fn => new Promise((res) => {
  let observer = new PerformanceObserver(items => {
    let duration = items.getEntries()[0].duration;
    performance.clearMarks();
    observer.disconnect();
    observer = undefined;
    res(duration);
  });

  observer.observe({ entryTypes: ['measure'] });

  performance.clearMarks();
  performance.mark('start');
  fn(...args);
  performance.mark('end');
  performance.measure('', 'start', 'end');
});
