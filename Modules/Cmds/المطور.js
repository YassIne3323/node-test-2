const fs = require("fs");
const axios = require("axios");
const { join } = require("path");

module.exports.Nero = {
    name: "المطور",
    Aliases: ["المبرمج"],
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "معلومات المطور",
    Class: "خدمات"
  },

module.exports.Begin = async function ({ api, event }) {
  try {
    const id = "61557506697779"; 
    const age = "19";
    const location = "Morocco 🇲🇦";
    const Thecity = "Casablanca";
    const Profession = "the study";
    
    
    const user_data = await api.getUserInfo(id);
    const name = user_data[id].name;

    
    const imageUrl = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
  
    const imagePath = join(__dirname, "/cache/1.png");
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });
    
    response.data.pipe(fs.createWriteStream(imagePath))
      .on("close", async () => {
        
        const msg = `name👤: 『${name}』\nage🎂: 『${age}』\nlocation🌍: 『${location}』\nThe city🏙: 『${Thecity}』\nProfession🛄: 『${Profession}』`;

        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imagePath),
        }, event.threadID, () => {
         
          fs.unlinkSync(imagePath);
        });
      });
  } catch (error) {
    console.error(error);

    api.sendMessage(
      `حدث خطأ: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};