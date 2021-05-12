const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const getBlogs = require('./getBlogs');
const getBlogPages = require('./getBlogPages');
const readPage = require('./readPage');
//Configurations
dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const baseUrl = "https://growtholic.in/blog/";
const failedMsg = `
    Fetching blogs failed :( Please try again later,
    If problem persists try contacting the admin!
`;
    
const metaPath = path.join(__dirname,"data","meta.json");
let metadata;
let readMessage;
let currentPage;

//Routes
bot.start((ctx) => ctx.reply(`
    Hello ${ctx.message.from.first_name},
Send /read to select and read blogs
`));

bot.help(async (ctx) => {
    await ctx.reply(`
    /read - Read blogs
/refresh <token> - Refresh blogs and metadata
/help - Show this help
    `);
})

//Refreshes the links (run atleast once a day to keep updated!)
bot.command("refresh",async (ctx) => {
    const key = ctx.message.text.split(" ")[1];
    if(key === process.env.REFRESH_KEY) {
        try {
            const dataPath = path.join(__dirname,"data");

            if(!fs.existsSync(dataPath))
                fs.mkdirSync(dataPath)

            const msg = await ctx.reply("Processing...");
            const pages = await getBlogPages(baseUrl);
            const totalPages = pages.length;
            for (let i = 0; i < totalPages; i++) {
                const blogs = await getBlogs(pages[i]);
                const blogPath = path.join(dataPath,`blog_page${i+1}.json`);
                await fsPromises.writeFile(blogPath,JSON.stringify(blogs))
                ctx.telegram.editMessageText(msg.chat.id,msg.message_id,undefined,`
                    ${i+1} of ${totalPages} pages done.
                `)
            }
            const metaPath = path.join(dataPath,"meta.json");
            let metadata = {};
            metadata["pages"] = totalPages;
            await fsPromises.writeFile(metaPath,JSON.stringify(metadata));
            return ctx.reply("All data updated successfully!");
        } catch(err) {
            console.log(err);
            return await ctx.reply("Error refreshing data!")            
        }
    } else {
        return ctx.reply("Invalid key!");
    }
});

//Reads blogs
bot.command("read",async (ctx) => {
    currentPage = 1;
    if(!fs.existsSync(metaPath))
        return ctx.reply("An error occurred, Please ask admin to refresh data!")

    metadata = JSON.parse(fs.readFileSync(metaPath))
    const {message,keyboard} = readPage(currentPage,metadata.pages);

    readMessage = await ctx.reply(message,keyboard);
});

bot.action(/(\d)/, async (ctx) => {
    const { blogs } = readPage(currentPage,metadata.pages);
    const idx = parseInt(ctx.match[1]) - 1;
    const link = blogs[idx].link
    return await ctx.telegram.editMessageText(
        readMessage.chat.id,
        readMessage.message_id,
        undefined,
        link
    );
})

bot.action("next",async (ctx) => {
    if(currentPage === metadata.pages)
        return await ctx.answerCbQuery("Already on last page!");

    currentPage += 1;

    const {message,keyboard} = readPage(currentPage,metadata.pages);

    readMessage = await ctx.telegram.editMessageText(
        readMessage.chat.id,
        readMessage.message_id,
        undefined,
        message,
        keyboard
    )
})

bot.action('prev',async (ctx) => {
    if(currentPage === 1)
        return await ctx.answerCbQuery("Already on first page!");

    currentPage -= 1;

    const {message,keyboard} = readPage(currentPage,metadata.pages);

    readMessage = await ctx.telegram.editMessageText(
        readMessage.chat.id,
        readMessage.message_id,
        undefined,
        message,
        keyboard
    )
})



//Launch the bot
bot.launch();
