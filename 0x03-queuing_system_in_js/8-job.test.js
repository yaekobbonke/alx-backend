const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // Create a Kue queue in test mode
    queue = kue.createQueue({ testMode: true });
  });

  afterEach(() => {
    // Clear the queue and exit test mode
    queue.testMode.clear();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs('not an array', queue);
    }).toThrowError('Jobs is not an array');
  });

  it('should create jobs in the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).toBe(2);
    expect(queue.testMode.jobs[0].type).toBe('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).toEqual(jobs[0]);
    expect(queue.testMode.jobs[1].type).toBe('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).toEqual(jobs[1]);
  });

  it('should log job creation, completion, failure, and progress', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(console.log).toHaveBeenCalledWith(
      `Notification job created: ${queue.testMode.jobs[0].id}`
    );
    expect(console.log).toHaveBeenCalledWith(
      `Notification job created: ${queue.testMode.jobs[1].id}`
    );

    // Simulate completion of the first job
    queue.testMode.jobs[0].emit('complete');
    expect(console.log).toHaveBeenCalledWith(
      `Notification job ${queue.testMode.jobs[0].id} completed`
    );

    // Simulate failure of the second job
    const error = new Error('Some error');
    queue.testMode.jobs[1].emit('failed', error);
    expect(console.log).toHaveBeenCalledWith(
      `Notification job ${queue.testMode.jobs[1].id} failed: ${error}`
    );

    // Simulate progress of the first job
    queue.testMode.jobs[0].emit('progress', 25, { someData: 'data' });
    expect(console.log).toHaveBeenCalledWith(
      `Notification job ${queue.testMode.jobs[0].id} 25% complete`
    );
  });
});
