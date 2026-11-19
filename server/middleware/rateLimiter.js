// In-memory sliding-window rate limiter (zero-dependency)
const rateLimitStores = new Map();

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests. Please try again later.'
} = {}) => {
  return (req, res, next) => {
    // Determine client IP safely
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitStores.get(key);
    if (!record || now - record.startTime > windowMs) {
      record = { startTime: now, count: 1 };
      rateLimitStores.set(key, record);
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({ 
        error: message, 
        retryAfter: retryAfterSeconds 
      });
    }

    next();
  };
};

// Periodic cleanup of stale records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStores.entries()) {
    if (now - record.startTime > 30 * 60 * 1000) {
      rateLimitStores.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();
