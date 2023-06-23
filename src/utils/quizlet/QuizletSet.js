module.exports = class QuizletSet {
    id;
    url;
    #data;

    constructor(id) {
        this.id = id;
        this.url = `https://quizlet.com/nl/${id}`;
    }

    fetch(browser) {
        return new Promise(async (resolve, reject) => { 
            const page = await browser.newPage();
            const res = await page.goto(this.url);

            if(res.status() == 404) {
                return reject({ status: 404, message: 'notFound' });
            }

            const nextData = await page.evaluate(() => document.getElementById('__NEXT_DATA__')?.innerText);
            if (typeof nextData !== 'string' || !nextData.startsWith('{')) {
                return reject({ status: 500, message: 'nextDataNotFound' });
            }

            const props = JSON.parse(nextData).props;
            this.#data = JSON.parse(props.pageProps.dehydratedReduxStateKey);

            await page.close();

            return resolve(this.data());
        })
    }

    data() {
        if(!this.#data) return null;
        const terms = Object.values(this.#data.setPage.termIdToTermsMap);

        return {
            creator: {
                username: this.#data.setPage.creator.username,
                imageUrl: this.#data.setPage.creator._imageUrl
            },
            terms: terms.map(term => ({
                id: term.id.toString(16),
                word: term.word,
                definition: term.definition
            }))
        }
    }
}