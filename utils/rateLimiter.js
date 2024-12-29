import { LRUCache } from 'lru-cache';

const rateLimit = (options) => {
  const tokenCache = new LRUCache({
    max: options.max || 100,
    ttl: options.windowMs || 15 * 60 * 1000,
  });

  return async (req, res) => {
    const token = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'default-token';
    const tokenCount = tokenCache.get(token) || [0];

    if (tokenCount[0] === 0) {
      tokenCache.set(token, tokenCount);
    }
    tokenCount[0] += 1;

    const currentUsage = tokenCount[0];
    const isRateLimited = currentUsage > (options.max || 100);

    res.setHeader('X-RateLimit-Limit', options.max || 100);
    res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : options.max - currentUsage);

    if (isRateLimited) {
      throw new Error('Rate limit exceeded');
    }
  };
};

export default rateLimit;
