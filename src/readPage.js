const fs = require('fs');
const path = require('path');
const blogMessage = require('./blogMessage');
const createKeyboard = require('./createKeyboard');

const readPage = (currentPage,totalPage) => {
    const page = fs.readFileSync(path.join(__dirname,"data",`blog_page${currentPage}.json`));
    const blogs = JSON.parse(page);
    const message = blogMessage(blogs,currentPage,totalPage)
    const keyboard = createKeyboard(blogs.length);
    return { blogs,message,keyboard };
}

module.exports = readPage;