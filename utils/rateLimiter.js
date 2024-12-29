import LRU from 'lru-cache';

const rateLimit = (options) => {
  const tokenCache = new LRU({
    max: options.max || 100,
    ttl: options.windowMs || 15 * 60 * 1000,
  });

  return {
    check: (res, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

        return isRateLimited ? reject() : resolve();
      }),
  };
};

export default rateLimit;