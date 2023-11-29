const kue = require('kue');
const queue = kue.createQueue();

const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, world!'
};

const job = queue.create('push_notification_code', jobData)
  .on('enqueue', () => {
    console.log(`Notification job created: ${job.id}`);
  })
  .on('complete', () => {
    console.log('Notification job completed');
    process.exit(0); // Exit the script after the job is completed
  })
  .on('failed', () => {
    console.log('Notification job failed');
    process.exit(1); // Exit the script with an error code if the job fails
  })
  .save();
