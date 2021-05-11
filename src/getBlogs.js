const cheerio = require('cheerio');
const axios = require('axios');

const getBlogs = async (url) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const arr = $('h2.entry-title > a[href]').toArray();
        let blogs = [];
        arr.forEach((item,index) => {
            blogs[index] = {
                title: item.children[0].data,
                link: item.attribs.href
            }
        });
        return blogs;
    } catch(err) {
        console.log(err);
        return err;
    }
}

module.exports = getBlogs;