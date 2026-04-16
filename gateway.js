const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.post('/shorten', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:4001/shorten', req.body);
        res.json(response.data);
    } catch (err) {
        res.status(502).send('Shortener service unavailable: ' + err.message);
    }
});

app.get('/r/:code', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:4002/${req.params.code}`, {
            maxRedirects: 0,
            validateStatus: null
        });
        if (response.status === 302) {
            return res.redirect(response.headers.location);
        }
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(502).send('Resolver service unavailable: ' + err.message);
    }
});

app.get('/stats/:code', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:4003/stats/${req.params.code}`);
        res.json(response.data);
    } catch (err) {
        res.status(502).send('Analytics service unavailable:' + err.message);
    }
});

app.listen(4000, () => console.log('Gateway running on port 4000'));