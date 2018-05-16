const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  // performance.clearMarks();
});
obs.observe({ entryTypes: ['measure', 'mark'] });

performance.mark('A');
performance.mark('B');
performance.measure('A to B', 'A', 'B');
performance.measure('A to', 'A', 'B');
