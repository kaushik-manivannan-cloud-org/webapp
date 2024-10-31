import statsd from '../services/metricsService.js';

export const metricsMiddleware = (req, res, next) => {
  // Clean route path for metric name (remove dynamic parameters)
  const route = req.originalUrl.substring(1).replace(/:/g, '').replace(/\//g, '_').replace(/^_/, '') || 'unknown';
  const method = req.method.toLowerCase();
  const metricKey = `api.${method}.${route}`;

  // Count API calls
  statsd.increment(`${metricKey}.count`, 1, { sampleRate: 1.0 });

  // Time API calls
  // Record start time
  const startTime = process.hrtime();

  // Once the response is finished, record the response time
  res.on('finish', () => {
    const duration = process.hrtime(startTime);
    const responseTime = duration[0] * 1000 + duration[1] / 1000000; // Convert to milliseconds
    statsd.timing(`${metricKey}.duration`, responseTime);
  });

  next();
};

export default metricsMiddleware;