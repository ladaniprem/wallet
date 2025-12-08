import express from 'express';
import dotenv from 'dotenv';
import { initDB} from './config/db.js';
import transactionsRoute from './routes/transactionsRoute.js';
import rateLimiter from './middleware/rateLimiter.js';
import job from './config/cron.js';
dotenv.config();

const app = express();

if(process.env.NODE_ENV === 'production') job.start();

// middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;
// middleware to parse JSON bodies
// app.use("/api/transactions", transactionsRoute);
// app.use((req, res, next) => {
//     console.log("hello from middleware is",req.method);
//     next();
// });


app.get('/api/health',(req,res) => {
    res.status(200).json({status:"ok"});
});

app.use("/api/transactions", transactionsRoute);
// app.use("/api/products",transactionsRoute); // just for testing purpose

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }); 
}); 


// Rate limitng concepts :-
// rate limiting is a way to control how often someone can do something on a website or app like how many
// times they can refresh a page,make a request to an API,or try to log in within a certain time period log in.
// only 100 request per user every 15 minutes.

// client --> rate limiter --> --> API server
// after the 100 request 101 was blocked by rate limiter and never reach to API server.

// rate limiting helps with 
// preventing abuse:stopping people from trying to hack or overload a system.
// protecting resources:making sure that servers and services don't get overwhelmed with too many requests.
// fair usage:ensuring that all users get a chance to use the service without some users hogging all the resources.
// improving performance:by limiting requests,servers can run more smoothly and efficiently.

