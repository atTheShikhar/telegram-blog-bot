const blogMessage = (blogs,currentPage,totalPage) => {
    const length = blogs.length;
    let message = `${currentPage} of ${totalPage} \n \n`;
    for(let i=0;i<length;i++) {
        message = message + `${i+1}. ${blogs[i].title} \n`;
    }
    return message;
}

module.exports = blogMessage;