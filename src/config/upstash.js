import { Redis } from '@upstash/redis'
import { RateLimit } from '@upstash/ratelimit'
import 'dotenv/config';

const redis = new Redis({
redis : Redis.fromEnv(),
limiter: RateLimit.slidingWindow(4, "60 minutes"),
});

export const ratelimit = new RateLimit({redis,
  limiter: RateLimit.slidingWindow(4, "60 seconds"),
});

export default ratelimit ;
