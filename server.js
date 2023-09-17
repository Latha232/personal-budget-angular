const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    // Read data from JSON file each time the /budget endpoint is hit
    const budgetData = JSON.parse(fs.readFileSync('budget-data.json', 'utf8'));
    res.json(budgetData);
});

app.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
});
