const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const { loadImage, createCanvas } = require("canvas");

module.exports.Nero = {
  name: "قبر",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 0,
  description: "اقبر نفسك",
  Class: "العاب"
};

module.exports.wrapText = (ctx, name, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = name.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.Begin = async function ({ usersData, api, event }) {
  const id = Object.keys(event.mentions)[0] || event.senderID;
  const name = await usersData.getName(id);

  const cacheDir = path.join(__dirname, "cache");
  const pathImg = path.join(cacheDir, "background.png");
  const pathAvt1 = path.join(cacheDir, "Avtmot.png");

  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  
  const backgroundURL = "https://i.imgur.com/DbB1F07.jpeg";
  await new Promise((resolve, reject) => {
    request(backgroundURL)
      .pipe(fs.createWriteStream(pathImg))
      .on("finish", resolve)
      .on("error", reject);
  });

  
  const pictureURL = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  await new Promise((resolve, reject) => {
    request(encodeURI(pictureURL))
      .pipe(fs.createWriteStream(pathAvt1))
      .on("finish", resolve)
      .on("error", reject);
  });

  
  const baseImage = await loadImage(pathImg);
  const baseAvt1 = await loadImage(pathAvt1);

  
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  
  ctx.drawImage(baseImage, 0, 0);
  let angle = 4.0 * Math.PI / 180;
  const x = 73;
  const y = 155;
  ctx.save();
  ctx.translate(x + 50, y + 50);
  ctx.rotate(-angle);
  ctx.drawImage(baseAvt1, -50, -50, 100, 100);
  ctx.restore();

  
  ctx.save();
  ctx.translate(x + 50, y + 50);
  ctx.rotate(-angle);
  ctx.font = "400 15px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  ctx.fillText(name, -30, 80);
  ctx.restore();

  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);

  return api.sendMessage(
    { body: ``, attachment: fs.createReadStream(pathImg) },
    event.threadID,
    () => fs.unlinkSync(pathImg),
    event.messageID
  );
};
