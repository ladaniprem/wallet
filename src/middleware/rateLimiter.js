import { ratelimit } from '../config/upstash.js';

const rateLimiter = async (req, res, next) => {
    try {
        // Use user id or IP address as identifier; fallback to IP
       // const identifier = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'anonymous';

        // Check the rate limit for this identifier.
        // `ratelimit` was configured with a limiter (slidingWindow(10, "60 s")).
        
        // Note :- in a  real-world app you'd like to put the userId or IP address as your key.
        const { success } = await ratelimit.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json
            (
                {
                     message: 'Too many requests, please try again later.' 
                    }
                );
        }
        next();
    } catch (error) {
        console.error('Rate Limiter Error:', error);
        return res.status(500).json
        (
            {
                message: 'Internal Server Error'
            }
        );
    }
};

export default rateLimiter;