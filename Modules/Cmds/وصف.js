const axios = require("axios");

module.exports = {
  Nero: {
    name: "وصف",
    Aliases: ["برومبت", "prompt"],
    version: "1.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "تحليل صور",
    Class: "خدمات"
  },
    
  Begin: async ({ api, event, args }) => {
    try {
      if (event.type !== "message_reply") {
          return api.sendMessage(`قـم بـرد عـلـى صـورة مـع ادخـال رقـم الـمـوديـل 🌸\n(0) prompt normal\n(1) flux\n(2) midjourney\nلـي وضـع وصـفـ بعـربـيـة ضـع ar`, event.threadID, event.messageID);
      }
      if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
          return api.sendMessage("يـرجـى الـرد عـلـى الـصورة ", event.threadID, event.messageID);
      }
      if (event.messageReply.attachments[0].type !== "photo") {
          return api.sendMessage("هـذه لـيـسـت صورة ", event.threadID, event.messageID);
      }
      api.setMessageReaction("⚙️", event.messageID, (err) => {}, true); 
      const imageUrl = event.messageReply.attachments[0].url;  
      const modelId = args.length > 0 ? parseInt(args[0]) : 2; 
      const lang = args.length > 0 && (args[0].toLowerCase() === "ar" || args[0].toLowerCase() === "en") ? args[0].toLowerCase() : "en";
      try {
        await processImage(imageUrl, modelId, lang, event, api);
      } catch (error) {
        console.error("❌ خطأ في إرسال الرسالة:", error);
        return api.sendMessage("❌ حدث خطأ في إرسال الرسالة", event.threadID);
      }
    } catch (error) {
      api.sendMessage("❌ خطأ في العملية:", error);
      return api.sendMessage("خطأ قبل ارسال طلب", event.threadID, event.messageID);
    }
  }
};
const processImage = async (imageUrl, modelId, lang, event, api) => {
  try {
    const response = await axios.post("https://imageprompt.org/api/ai/prompts/image", {
      base64Url: imageUrl,  
      imageModelId: modelId,
      language: lang,
    }, {
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
        "Content-Type": "application/json",
        "Priority": "u=1, i",
        "Sec-CH-UA": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": "\"Windows\"",
        "Referer": "https://imageprompt.org/image-to-prompt",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });
    const prompt = response.data.prompt;
    return api.sendMessage(`〘━━━❪☬❲ 𝗡𝗘𝗥𝗢 ❳☬❫━━━〙\n\n${prompt}`, event.threadID, event.messageID);
  } catch (err) {
    console.log(err);
    return api.sendMessage("❌ حدث خطأ أثناء معالجة الصورة", event.threadID, event.messageID);
  }
};
