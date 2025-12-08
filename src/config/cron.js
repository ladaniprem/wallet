import cron from 'cron';
import https from 'https';

const job = new cron.CronJob('*/14 * * * *', function() {
    https.get(process.env.API_URL,(res) => {
        if(res.statusCode === 200){
            console.log('Cron job executed successfully at', new Date().toISOString());
        }
        else {
            console.error('Cron job failed with status code:', res.statusCode); 
        }
    })
    .on('error', (e) => {
        console.error('Cron job encountered an error:', e.message);
    });

    /*
    .on(eventName, listener)
Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. 
Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
server.on('connection', (stream) => {
  console.log('someone connected!');
});
Returns a reference to the EventEmitter, so that calls can be chained.
By default, event listeners are invoked in the order they are added. The emitter.prependListener() method can be used as an alternative to add the event listener to the beginning of the listeners array.

import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
 
    */
});
export default job;

//CRON job explanation:

// cron jobs are scheduled tasks that run automatically at specified intervals. They are commonly used for automating repetitive tasks such as data backups, system maintenance, and sending notifications.
//we want to run a cron job every 14 minutes to make a GET request to a specific API endpoint defined in the environment variable API_URL. This can be useful for keeping data synchronized, triggering updates, or performing regular checks on the API's status.

// How to defined a "schedule"?
// You define a schedule using a cron expression, which consists of 5 fields representing different time units: minute, hour, day of month, month, and day of week. Each field can contain specific values, ranges, or special characters to specify when the job should run.

//! MINUTE,HOUR,DAY OF MONTH,MONTH,DAY OF WEEK

// examples && explanation:
// '*/14 * * * *' - Every 14 minutes
// '0 * * * *' - At the start of every hour
// '0 0 * * *' - At midnight every day
// '0 0 * * 0' - At midnight every Sunday
// '0 0 1 * *' - At midnight on the first day of every month
// '* 30 3 15 * *' - At 3:30 AM on the 15th of every month
// '0 9 * * 1-5' - At 9:00 AM every weekday (Monday to Friday)
// '0 0 1 1 *' - At midnight on January 1st every year