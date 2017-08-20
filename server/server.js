const path = require('path');
const getRootPath = require('../util');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { port } = require('./config');
const api = require('./server/routes');
const cors = require('cors')

const app = express();
const rootPath = getRootPath();
app.use(express.static(`${rootPath}/build`));
app.use(express.static(`${rootPath}/uploads`));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//
// routing api
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(`${rootPath}/build/index.html`);
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
