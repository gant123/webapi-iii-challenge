const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const postsRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

//Middleware
server.use(morgan('dev'));
server.use(express.json());
server.use(helmet());
server.use('/api/users', userRouter);
server.use('/api/posts', postsRouter);
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
  let today = new Date();
  let time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  console.log(
    `Method:${req.method} URL: ${req.originalUrl} Timestamp: ${time}`
  );
  next();
}

module.exports = server;
