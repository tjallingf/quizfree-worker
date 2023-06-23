const puppeteer = require('puppeteer');
const QuizletSet = require('./utils/quizlet/QuizletSet');
const express = require('express');
const app = express();
require('dotenv').config();

const main = async () => {
    app.get('/', (req, res) => {
        res.send('Hello world!');
    })

    app.get('/api/quizlet/sets/:id', async (req, res) => {
        const set = new QuizletSet(req.params['id']);

        // Creating a new browser prevents captcha's
        const browser = await puppeteer.launch({ 
            headless: false,
            args: [
                '--disable-setuid-sandbox',
                '--no-sandbox',
                '--single-process',
                '--no-zygote',
            ],
            executablePath: process.env.NODE_ENV === 'production'
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
        }); 
        
        set.fetch(browser)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(err.status).json(err);
            }) 
    })

    const port = 80;

    app.listen(port, () => {
        console.log(`Quizfree worker listening at http://localhost:${port}.`);
    })
}

main();