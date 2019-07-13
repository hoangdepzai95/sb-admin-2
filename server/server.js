// const path = require('path');
// const getRootPath = require('../util');
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const compression = require('compression');
// const api = require('./server/routes');
// const cors = require('cors');
// const socketIo = require('socket.io');
// const http = require('http');
// const isProd = process.argv.includes('--prod');
// const app = express();
// const rootPath = getRootPath();
// app.use(express.static(`${rootPath}/build`));
// app.use(express.static(`${rootPath}/uploads`));

// const whitelist = ['http://localhost:3000', 'http://luudontis.com'];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

// if (isProd) {
//   app.enable('trust proxy');
// }


// app.use(cors());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
// app.use(bodyParser.json({ limit: '15mb', extended: true }));
// //
// // routing api
// app.use('/api', api);

// app.get('*', (req, res) => {
//   res.sendFile(`${rootPath}/build/index.html`);
// });

// const port = isProd ? 80 : 3001;

// const server = http.createServer(app);
// const io = socketIo(server);

// app.set('socket', io);

// io.on("connection", socket => {

//     socket.on("disconnect", () => console.log("Client disconnected"));
// });


// server.listen(port, () => {
//   console.log(`The server is running at http://localhost:${port}/`);
// });

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const api = require('./server/routes');
const cors = require('cors');
const compression = require('compression');
const socketIo = require('socket.io');
const http = require('http');
const isProd = process.argv.includes('--prod');
const util = require('../util');

const app = express();
const rootPath = util.getRootPath();

const whitelist = ['http://localhost:4300', 'http://localhost:4200', 'https://faceshopviet.com', 'https://quanly.faceshopviet.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

if (isProd) {
    app.enable('trust proxy');
}

// const apiLimiter = new RateLimit({
//     windowMs: 15*60*1000, // 15 minutes
//     max: 2000,
//     delayMs: 0 // disabled
// });

// app.use('/api/', apiLimiter);

app.use(compression());
app.use(express.static(`${rootPath}/build`));
app.use(express.static(`${rootPath}/uploads`));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb', extended: true }));


//
// routing api
app.use('/api', api);


app.get('*', (req, res) => {
     res.sendFile(`${rootPath}/build/index.html`);
});


app.use(function (err, req, res, next /* DON'T REMOVE THIS 'next' param*/) {
    log(err);
    if (err.status === 401) {
        res.status(401).send('Un auth');
        return;
    }
    res.status(500).send('Something broke!');
});

const port = isProd ? 3000 : 3002;

const server = http.createServer(app);
const io = socketIo(server);

app.set('socket', io);

io.on("connection", socket => {

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
