const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { port } = require('./config');
const api = require('./server/routes');
const cors = require('cors')

const app = express();
app.use(express.static(path.resolve('./build')));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//
// routing api
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve('./build/index.html')));
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
