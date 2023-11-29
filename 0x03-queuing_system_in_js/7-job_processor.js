const kue = require('kue');
const queue = kue.createQueue({
  concurrency: 2 // Process two jobs at a time
});

const blacklistedNumbers = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Set initial progress to 0%

  if (blacklistedNumbers.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    job.fail(error);
    done(error);
  } else {
    job.progress(50, 100); // Set progress to 50%

    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    // Perform notification sending logic here...

    done(); // Mark job as completed
  }
}

queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
