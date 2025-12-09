import { ratelimit } from '../config/upstash.js';

const rateLimiter = async (req, res, next) => {
    try {
        // Skip rate limiting for preflight and in development to ease testing
        if (req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production') {
            return next();
        }
        // Use user id or IP address as identifier; fallback to IP
       // const identifier = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'anonymous';

        // Check the rate limit for this identifier.
        // `ratelimit` was configured with a limiter (slidingWindow(10, "60 s")).
        
        // Note :- in a  real-world app you'd like to put the userId or IP address as your key.
        const key = req.headers['x-user-id'] || req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'anonymous';
        const { success } = await ratelimit.limit(String(key));

        if (!success) {
            return res.status(429).json({ message: 'Too many requests, please try again later.' });
        }
        next();
    } catch (error) {
        console.error('Rate Limiter Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default rateLimiter;