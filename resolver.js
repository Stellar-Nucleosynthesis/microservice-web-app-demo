const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/:code', async (req, res) => {
    const code = req.params.code;
    try {
        const response = await axios.get(`http://localhost:4001/internal/${code}`);
        const url = response.data.url;
        axios.post('http://localhost:4003/event', { code }).catch(() => {});
        res.redirect(302, url);
    } catch (err) {
        if (err.response?.status === 404) {
            return res.status(404).send('Not found');
        }
        res.status(503).send('Shortener unavailable');
    }
});

app.listen(4002, () => console.log('Resolver running on port 4002'));