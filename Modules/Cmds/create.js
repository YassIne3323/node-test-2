const fs = require('fs');
const path = require('path');

module.exports = {
  Nero: {
    name: "create",
    Aliases: ["انشاء"],
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 3,
    description: "انشاء امر جديد",
    Class: "المطور"
  },

  Begin: async function({ event, api, args }) {
    const code = args.join(" ");
    if (!code) return api.sendMessage("⚠️ يرجى إدخال كود لوضعه في الملف!", event.threadID, event.messageID);

    if (!global.Nero) global.Nero = {};
    if (!(global.Nero.onReply instanceof Map)) global.Nero.onReply = new Map();

    api.sendMessage("⚙️ يرجى إدخال اسم الملف (بدون امتداد .js)", event.threadID, (error, info) => {
      if (error) return api.sendMessage(`❌ حدث خطأ: ${error.message}`, event.threadID, event.messageID);

      global.Nero.onReply.set(info.messageID, {
        type: "getFileName",
        name: module.exports.Nero.name,
        author: event.senderID,
        code: code
      });
    });
  },

  onReply: async function({ event, api, onReply }) {
    if (onReply.type !== "getFileName") return;
    if (event.senderID !== onReply.author) return api.sendMessage("⚠️ أنت غير مصرح لك بالرد على هذا الطلب!", event.threadID, event.messageID);

    const fileName = event.body.trim();
    if (!fileName) return api.sendMessage("⚠️ يجب إدخال اسم ملف صالح!", event.threadID, event.messageID);

    try {
      const folderPath = path.join(__dirname);
      const filePath = path.join(folderPath, `${fileName}.js`);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, onReply.code, 'utf8');

      api.sendMessage(`✅ تم إنشاء/تحديث الملف بنجاح: ${fileName}.js`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`❌ حدث خطأ أثناء إنشاء/تحديث الملف:\n${error.message}`, event.threadID, event.messageID);
    }

    global.Nero.onReply.delete(event.messageID);
  }
};
