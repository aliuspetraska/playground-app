const rateLimit = require('express-rate-limit');
const secure = require('express-secure-only');
const compression = require('compression');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();

app.enable('strict routing');
app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') {
  app.use(secure());
}

app.use(cors());
app.use(helmet({ frameguard: false }));
app.use(compression());
app.use(
  rateLimit({
    windowMs: 60000, // How long in milliseconds to keep records of requests in memory.
    max: 0, // Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable.
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api/config', (req, res) => {
  res.status(200).json({
    appName: process.env.APP_NAME || 'No Environment Variable Set'
  });
});

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(`Works! On port: ${port}`);
});
