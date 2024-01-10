require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const userRouter = require('./src/routes/user')
const messageRouter = require('./src/routes/message')
const {createServer} = require("node:http");
const configureSocket = require('./src/socket/server.socket');


// Set up the express app
const app = express();
app.use(cors());
const server = createServer(app);

const io = configureSocket(server)

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
server.listen(PORT, () => {
  console.log(new Date());
  console.log(`Server is running on port ${PORT}.`);
});
