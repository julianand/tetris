const express = require('express');
const app = express();

const port = 5000;

app.use('/client', express.static('client'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log('hosted on http://localhost:' + port);
});