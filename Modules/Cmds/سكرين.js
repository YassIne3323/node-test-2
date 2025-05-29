const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const url = require('url');

module.exports = {
  Nero: {
    name: "سكرين",
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "سكرين لي رابط",
    Class: "خدمات"
  },

  Begin: async ({ event, api, args }) => {
    const { threadID, messageID, senderID } = event;
    const cachePath = path.resolve(__dirname, "cache");
    const pornListPath = path.join(cachePath, "pornlist.txt");

    // تأكد مجلد الكاش موجود
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    // تحميل ملف البورنو لست لو مش موجود
    if (!fs.existsSync(pornListPath)) {
      const response = await axios.get("https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt");
      fs.writeFileSync(pornListPath, response.data, 'utf-8');
    }

    if (!args[0]) return api.sendMessage("⚠️ يرجى إدخال رابط لعمل سكرين له.", threadID, messageID);

    if (!global.moduleData) global.moduleData = {};
    if (!global.moduleData.pornList) {
      global.moduleData.pornList = fs.readFileSync(pornListPath, "utf-8")
        .split('\n')
        .filter(site => site && !site.startsWith('#'))
        .map(site => site.replace(/^0\.0\.0\.0\s+/, '').trim());
    }

    const urlParsed = url.parse(args[0]);

    if (!urlParsed.host) return api.sendMessage("⚠️ الرابط غير صالح.", threadID, messageID);

    if (global.moduleData.pornList.includes(urlParsed.host)) {
      return api.sendMessage("❌ الموقع الذي أدخلته غير آمن (موقع إباحي)!", threadID, messageID);
    }

    try {
      const screenPath = path.join(cachePath, `${threadID}-${senderID}s.png`);
      const screenshotUrl = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`;

      const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(screenPath, response.data);

      return api.sendMessage({ attachment: fs.createReadStream(screenPath) }, threadID, () => fs.unlinkSync(screenPath), messageID);
    } catch (error) {
      return api.sendMessage("❌ حدث خطأ أثناء أخذ السكرين. تأكد أن الرابط صحيح.", threadID, messageID);
    }
  }
};
