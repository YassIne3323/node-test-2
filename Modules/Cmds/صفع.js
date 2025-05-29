const request = require("request");
const fs = require("fs")
const axios = require("axios")

module.exports.Nero = {
  name: "صفع",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 0,
  description: "تاغي شي واحد باش طرش دين ديماه",
  Class: "العاب"
},

module.exports.Begin = async({ api, event }) => {
  var link = [ "https://i.postimg.cc/1tByLBHM/anime-slap.gif", ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("دير تاغ ل داك خونا لي بغيتي تصرفقو  ", threadID, messageID);
   var callback = () => api.sendMessage({body:  ` يا لها من صفعة   ! ${tag}` + `\n\ آسف لكن أردت أن أخلصك من ذبابة كانت تقف على و جهك القبيح🙂  *`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/slap.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/slap.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/slap.gif")).on("close",() => callback());
}