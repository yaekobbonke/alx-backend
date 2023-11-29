const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');

// Create a Redis client
const redisClient = redis.createClient();

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Create a Kue queue
const queue = kue.createQueue();

// Set the initial number of available seats to 50
const initialAvailableSeats = 50;
reserveSeat(initialAvailableSeats);

// Initialize the reservationEnabled flag to true
let reservationEnabled = true;

// Function to reserve seats
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get the current number of available seats
async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return parseInt(availableSeats) || 0;
}

// Create the Express server
const app = express();
const port = 1245;

// Middleware to parse JSON requests
app.use(express.json());

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ seats: availableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });
});

// Route to process the queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    const newAvailableSeats = currentAvailableSeats - 1;

    if (newAvailableSeats >= 0) {
      await reserveSeat(newAvailableSeats);
      if (newAvailableSeats === 0) {
        reservationEnabled = false;
      }
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

// Event listener for completed jobs
queue.on('job complete', (id) => {
  console.log(`Seat reservation job ${id} completed`);
});

// Event listener for failed jobs
queue.on('job failed', (id, error) => {
  console.log(`Seat reservation job ${id} failed: ${error}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
