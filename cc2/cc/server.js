
const express = require('express');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(bodyParser.json({ limit: '15mb', extended: true }));
//
// routing api
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(`${rootPath}/build/index.html`);
});

app.listen(3001, () => {
    console.log(`The server is running at http://localhost:${port}/`);
});
