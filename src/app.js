const puppeteer = require('puppeteer');
const QuizletSet = require('./utils/quizlet/QuizletSet');
const express = require('express');
const app = express();

const main = async () => {
    app.get('/api/quizlet/sets/:id', async (req, res) => {
        const set = new QuizletSet(req.params['id']);

        // Creating a new browser prevents captcha's
        const browser = await puppeteer.launch({ headless: "new" }); 
        set.fetch(browser)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(err.status).json(err);
            }) 
    })

    app.listen(8080, () => {
        console.log('Quizfree worker listening at http://localhost:8080.');
    })
}

main();