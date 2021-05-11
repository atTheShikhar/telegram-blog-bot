const cheerio = require('cheerio');
const axios = require('axios');

const getBlogPages = async (baseUrl) => {
    try {
        const response = await axios.get(baseUrl);
        const html = response.data;
        const $ = cheerio.load(html);
        const arr = $('div.nav-links > a[href]').toArray();
        const last = parseInt(arr[arr.length - 2].children[0].data);
        let pages = [];
        for(let i = 1;i<=last;i++) {
            pages.push(`${baseUrl}page/${i}/`);
        }
        return pages;
    } catch(err) {
        console.log(err);
        return err;
    }
}

module.exports = getBlogPages;