const axios = require("axios");
class Imgur {
  constructor() {
    this.clientId = "fc9369e9aea767c", this.client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${this.clientId}`
      }
    })
  }
  async uploadImage(url) {
    return (await this.client.post("image", {
      image: url
    })).data.data.link
  }
}
class Modules extends Imgur {
  constructor() {
    super()
  }
  get Nero() {
    return {
    name: "رفع", 
    Aliases: ["رابط", "upload"],
    version: "1.0.0",
    Role: 0,
    credits:"Nero",
    description: "تحويل صورة الى رابط",
    Class: "خدمات",
    Rest: 5,
}
  }
  Begin = async ({ api, event }) => {
    var array = [];
    if ("message_reply" != event.type || event.messageReply.attachments.length < 0) return api.sendMessage("👽رد عـلـى صورة", event.threadID, event.messageID);
    for (let { url } of event.messageReply.attachments) await this.uploadImage(url).then((res => array.push(res))).catch((err => console.log(err)));
    return api.sendMessage(`〘━━━❪⚝❲ 𝗡𝗘𝗥𝗢 ❳⚝❫━━━〙\n❂تـم تحميل طلبك\n⌔┇↜{رابـط صورة} ← ${array.join("\n")}
`, event.threadID, event.messageID)
  }
}
module.exports = new Modules;