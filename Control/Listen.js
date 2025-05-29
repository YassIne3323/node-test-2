module.exports = async function ({ api, usersData, threadsData, globalData }) {

const fs = require('fs');
const path = require('path');
const cacheDirectory = __dirname + '/../Modules/Cmds/cache';
const autoClean = [".jpg", ".gif", ".mp4", ".mp3", ".png", ".m4a"];
const clean = () => {
  fs.readdir(cacheDirectory, (err, files) => {
    if (err) return;

    autoClean.forEach((ext) => {
      files.forEach((file) => {
        if (file.includes(ext)) {
          const filePath = path.join(cacheDirectory, file);
          try {
            fs.unlinkSync(filePath);
          } catch (_) {
          }
        }
      });
    });
  });
};
setInterval(clean, 60000); 

  try {
    const fs = require("fs");
    const logger = require("../Logger/Log");
    const chalk = require("chalk");
    const gradient = require("gradient-string");
    const cons = require('./../Config/Settings.json');
    const theme = cons.DESIGN.Theme.toLowerCase();
    let cra, co, cb;

    if (theme === 'blue') {
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("#243aff", "#4687f0", "#5800d4");
      cb = chalk.blueBright;
    } else if (theme === 'fiery') {
      cra = gradient('orange', 'yellow', 'yellow');
      co = gradient("#fc2803", "#fc6f03", "#fcba03");
      cb = chalk.hex("#fff308");
    } else if (theme === 'red') {
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("red", "orange");
      cb = chalk.hex("#ff0000");
    } else if (theme === 'aqua') {
      cra = gradient("#6883f7", "#8b9ff7", "#b1bffc");
      co = gradient("#0030ff", "#4e6cf2");
      cb = chalk.hex("#3056ff");
    } else if (theme === 'pink') {
      cra = gradient('purple', 'pink');
      co = gradient("#d94fff", "purple");
      cb = chalk.hex("#6a00e3");
    } else if (theme === 'retro') {
      cra = gradient("orange", "purple");
      co = gradient.retro;
      cb = chalk.hex("#ffce63");
    } else if (theme === 'sunlight') {
      cra = gradient("#f5bd31", "#f5e131");
      co = gradient("#ffff00", "#ffe600");
      cb = chalk.hex("#faf2ac");
    } else if (theme === 'teen') {
      cra = gradient("#81fcf8", "#853858");
      co = gradient.teen;
      cb = chalk.hex("#a1d5f7");
    } else if (theme === 'summer') {
      cra = gradient("#fcff4d", "#4de1ff");
      co = gradient.summer;
      cb = chalk.hex("#ffff00");
    } else if (theme === 'flower') {
      cra = gradient("yellow", "yellow", "#81ff6e");
      co = gradient.pastel;
      cb = gradient('#47ff00', "#47ff75");
    } else if (theme === 'ghost') {
      cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
      co = gradient.mind;
      cb = chalk.blueBright;
    } else if (theme === 'hacker') {
      cra = chalk.hex('#4be813');
      co = gradient('#47a127', '#0eed19', '#27f231');
      cb = chalk.hex("#22f013");
    } else {
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("#243aff", "#4687f0", "#5800d4");
      cb = chalk.blueBright;
    }

    global.loading(`${cra(`[ BOT_INFO ]`)} success!\n${co(`[ NAME ]:`)}  ${cra(`${(!global.Settings.BOTNAME) ? "H I N A" : global.Settings.BOTNAME}`)}\n${co(`[ FBID ]:`)}  ${cra(`${api.getCurrentUserID()}`)}\n${co(`[ PRFX ]:`)}  ${cra(`No Prefix`)}`, "LOADED");
    logger.loader(`${cra(`[ SQLite ]`)} ${cb(`${global.DB.allThreadData.length}`)} Thread & ${cb(`${global.DB.allUserData.length}`)} Users`);

const Handle = require('./Handle.js');
const { DataBase, onActions, onChat, onEvent, onEvents, onReaction, onReply } = await Handle({ api, usersData, threadsData, globalData });

    
    return (event) => {
      try {
        switch (event.type) {
          case "message":
          case "message_reply":
          case "message_unsend":
            onChat({ event });
            onReply({ event });
            DataBase({ event }); 
            onEvent({ event });
            break;
          case "change_thread_image":
            break;
          case "event":
            onEvents({ event });
            onActions({ event }); 
            break;
          case "message_reaction":
            onReaction({ event });
            break;
          default:
            break;
        }
      } catch (error) {
        global.loading(error, "❌ Listener");
      }
    };
  } catch (error) {
    global.loading(error, "❌ Listener");
  }
};
