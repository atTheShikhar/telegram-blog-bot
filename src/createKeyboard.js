const Telegraf = require('telegraf');
const { Markup } = Telegraf;

const createKeyboard = (noOfKeys) => {
    const nav = [Markup.button.callback("⬅️ Previous","prev"),Markup.button.callback("Next ➡️","next")];
    let opt = [];
    for(let i=1;i<=noOfKeys;i++) {
        opt.push(Markup.button.callback(`${i}`,`${i}`));
    }
    let keys = [];
    keys.push(opt);
    keys.push(nav);
    let keyboard = Markup.inlineKeyboard(keys).resize();
    return keyboard;
}

module.exports = createKeyboard;