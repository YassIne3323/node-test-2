const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

module.exports = {
  Nero: {
    name: "زوجتي",
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "اعمل تاغ لزوجتك",
    Class: "العاب"
  },

  Begin: async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions);

    if (!mention[0]) {
      return api.sendMessage("⚠️ منشن زوجتك!", threadID, messageID);
    } else {
      const one = senderID;
      const two = mention[0];
      try {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({ body: "", attachment: fs.createReadStream(imagePath) }, threadID, () => fs.unlinkSync(imagePath), messageID);
      } catch (error) {
        return api.sendMessage(`❌ حدث خطأ: ${error.message}`, threadID, messageID);
      }
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");

  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  const backgroundUrl = "https://i.ibb.co/PjWvsBr/13bb9bb05e53ee24893940892b411ad2.png";
  const backgroundPath = path.join(__root, "married.png");

  if (!fs.existsSync(backgroundPath)) {
    const response = await axios.get(backgroundUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(backgroundPath, Buffer.from(response.data, "utf-8"));
  }

  let batgiam_img = await jimp.read(backgroundPath);
  const pathImg = path.join(__root, `married_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  const avatarOneData = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneData, 'utf-8'));

  const avatarTwoData = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoData, 'utf-8'));

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  batgiam_img
    .composite(circleOne.resize(80, 80), 210, 60)
    .composite(circleTwo.resize(80, 80), 130, 90);

  const finalBuffer = await batgiam_img.getBufferAsync(jimp.MIME_PNG);

  fs.writeFileSync(pathImg, finalBuffer);
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync(jimp.MIME_PNG);
}
