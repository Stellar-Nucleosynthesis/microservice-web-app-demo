const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const urls = new Map();

function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

app.post('/shorten', (req, res) => {
    let { url } = req.body;
    if (!url) {
        return res.status(400).send('URL is required');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    const code = generateCode();
    urls.set(code, url);
    res.json({ code });
});

app.get('/internal/:code', (req, res) => {
    const url = urls.get(req.params.code);
    if (!url) {
        return res.status(404).send('Not found');
    }
    res.json({ url });
});

app.listen(4001, () => console.log('Shortener running on port 4001'));