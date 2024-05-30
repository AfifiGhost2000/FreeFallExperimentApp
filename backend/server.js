const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let timeData = null;

app.use(bodyParser.json());
app.use(cors());

// Endpoint to receive time data
// app.post('/sendtime', (req, res) => {
//   if (req.body.time !== undefined) {
//     timeData = req.body.time;
//     console.log(`Received time data: ${timeData}`);
//     res.status(201).send('Time data received');
//   } else {
//     res.status(400).send('Invalid data');
//   }
// });

// Endpoint to retrieve time data
// app.get('/gettime', (req, res) => {
//   if (timeData !== null) {
//     res.status(201).json({ time: timeData });
//   } else {
//     res.status(404).send('No time data available');
//   }

// });

//In case no ESP32 Device at hand
app.get('/gettime', (req, res) => {
  const time = Math.random() * 10; // Simulate a random time between 0 and 10 seconds
  res.json({ time: time });
});

app.listen(port, () => {
console.log(`Server running at http://192.168.1.179:${port}/`);
});
