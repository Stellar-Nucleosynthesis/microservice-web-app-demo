const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const stats = {};

app.post('/event', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send('Code is required');
    }
    stats[code] = (stats[code] || 0) + 1;
    res.sendStatus(200);
});

app.get('/stats/:code', (req, res) => {
    const code = req.params.code;
    res.json({
        code,
        clicks: stats[code] || 0
    });
});

app.listen(4003, () => console.log('Analytics running on port 4003'));