import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import 'dotenv/config';

// Initialize Redis client from environment variables
// Expected envs:
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

// Configure a sliding window limiter: 4 requests per 60 seconds
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(4, '60 s'),
  analytics: true,
  prefix: 'rate-limit',
});

export default ratelimit;
