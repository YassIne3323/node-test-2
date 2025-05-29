const axios = require('axios');
const moment = require("moment-timezone");
const h = global.Mods.Anbunumbers;
const y = (str) => h(str, 3);

async function translateIfArabic(text) {
  const isArabic = /[\u0600-\u06FF]/.test(text);
  if (!isArabic) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    const result = res.data;
    let translated = '';
    result[0].forEach(item => {
      if (item[0]) translated += item[0];
    });
    return translated;
  } catch (err) {
    console.error("ترجمة فاشلة:", err);
    return text;
  }
}

module.exports.Nero = {
  name: "ارسم",
  version: "1.0.0",
  Role: 0,
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "توليد صور",
  Class: "إنشاء ai",
  usages: "احلم [نص]",
  Rest: 15
};

module.exports.Begin = async ({ api, event, args, Message, usersData }) => {
  const senderID = event.senderID;
  let prompt = args.join(" ");
  if (!prompt) return api.sendMessage("عفاك دخل نص باش نحلمو عليه!", event.threadID);

  Message.react("⚙️");
  Message.reply("⚙️|جري توليد الصور انتظر قليلا...");
  const startTime = Date.now();
  try {
    prompt = await translateIfArabic(prompt);

    const headers = {
      accept: "application/json, text/plain, */*",
      "accept-language": "ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7",
      authorization: "5ddd97d97282dd26531e4e76ffabbacc044510fb",
      "content-type": "application/json;charset=UTF-8",
      platform: "Web",
      Referer: "https://piclumen.com/",
    };

    const generateImage = async () => {
      const createResponse = await axios.post(
        'https://api.piclumen.com/api/gen/create',
        {
          highPixels: false,
          model_id: "23887bba-507e-4249-a0e3-6951e4027f2b",
          prompt: prompt,
          negative_prompt: "",
          resolution: { width: 1024, height: 1024, batch_size: 1 },
          model_ability: { anime_style_control: null },
          seed: -1,
          steps: 6,
          cfg: 1,
          sampler_name: "euler",
          scheduler: "normal",
          ponyTags: {},
          denoise: 1,
          hires_fix_denoise: 0.5,
          hires_scale: 2,
          multi_img2img_info: { style_list: [] },
          img_control_info: { style_list: [] },
          continueCreate: false
        },
        { headers }
      );

      const markId = createResponse.data?.data?.markId;
      if (!markId) throw new Error("no markId received");

      while (true) {
        const taskResponse = await axios.post(
          'https://api.piclumen.com/api/task/batch-process-task',
          [markId],
          { headers }
        );
        const task = taskResponse.data?.data?.[0];
        if (task?.status === "success") return task.img_urls?.[0]?.imgUrl;
        if (task?.status === "failed") throw new Error("Image generation failed");
        await new Promise(r => setTimeout(r, 2000));
      }
    };

    const imgUrls = [];

    for (let i = 0; i < 4; i++) {
      const imgUrl = await generateImage();
      if (imgUrl) imgUrls.push(imgUrl);
      if (i < 3) await new Promise(r => setTimeout(r, 5000));
    }

    if (imgUrls.length === 0) {
      return Message.react("❌");
    }

    const attachments = await Promise.all(
      imgUrls.map(url => global.Mods.str(url))
    );

    const endTime = new Date();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);
    const userNamefromData = await usersData.getName(senderID);
    const currentDate = moment.tz("Africa/Casablanca").format("YYYY-MM-DD");
    const currentTime = moment.tz("Africa/Casablanca").format("h:mm:ss A");

    Message.reply({
      body: `⚙️| تم تنفيذ طلبك بنجاح

✧ بواسطة -› ❨${userNamefromData}❩
✧ استغرق -› ❨${y(String(processingTime))}❩ 
✧ الوقت -› ❨${y(String(currentTime))}❩ 
✧ التاريخ -› ❨${y(String(currentDate))}❩`,
      attachment: attachments
    });

    Message.react("✅");
  } catch (error) {
    console.error("خطأ عام:", error);
    Message.react("❌");
  }
};
