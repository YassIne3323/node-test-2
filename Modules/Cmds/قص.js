const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const { image } = require('image-downloader');

module.exports.Nero = {
  name: "قص",
  version: "1.0.0",
  credits: "ǺᎩᎧᏬᏰ",
  Rest: 5,
  Role: 0,
  description: "قص خلفية صورتك",
  Class: "خدمات"
},

module.exports.Begin = async function({ api, event, args }) {
  try {
    if (event.type !== "message_reply") 
      return api.sendMessage("تـم إزالـة خـلـفـيـة الـصورة ✅", event.threadID, event.messageID);
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("يـرجـى الـرد عـلـى الـصورة ", event.threadID, event.messageID);
    if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("هـذه لـيـسـت صورة ", event.threadID, event.messageID);
    const ggg = api.setMessageReaction("✂️", event.messageID, (err) => {}, true); 
    const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
    const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
    
    await image({
      url: content,
      dest: inputPath
    });

    const formData = new FormData();
    formData.append('image', fs.createReadStream(inputPath));

    const response = await axios.post('https://ayoub-bg.deno.dev/remove-background', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(inputPath, response.data);
           api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    return api.sendMessage({ 
      body: "تـم قص صورة ✅",
      attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));

  } catch (e) {
    console.log(e);
    return api.sendMessage(` حدث خطأ \n ${e} `, event.threadID, event.messageID);
  }
};