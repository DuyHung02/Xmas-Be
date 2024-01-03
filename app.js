require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user')
const messageRouter = require('./routes/message')

// Set up the express app
const app = express();
app.use(cors());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/message', messageRouter);

app.get('/', (req, res) =>
    res.status(200).send({
      message: 'Alive!',
    }),
);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(new Date());
  console.log(`Server is running on port ${PORT}.`);
});
