const fs = require("fs-extra");
const path = require("path");

module.exports = {
  Nero: {
    name: "رست",
    Aliases: ["reset", "restart"],
    version: "1.0",
    credits: "Nero",
    Rest: 5,
    Role: 3,
    description: "",
    Class: "المطور"
  },
 Begin: function ({ api }) {
    const pathFile = `${__dirname}/cache/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, mid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
       api.setMessageReaction("✅", mid, (err) => {}, true)
      api.sendMessage(`✅ | تمت إعادة تشغيل نيرو\n⏰ | الوقت : ${(Date.now() - time) / 1000}s`, tid);
      fs.unlinkSync(pathFile);
    }

    const cachePath = path.join(__dirname, "cache");
    fs.readdir(cachePath, (err, files) => {
      if (err) {
        
        return;
      }

      files.forEach((file) => {
        const fileExt = path.extname(file).toLowerCase();
        if (fileExt === ".png" || fileExt === ".jpg" || fileExt === ".mp4" || fileExt === ".gif") {
          const filePath = path.join(cachePath, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });
    });
  },
  Begin: async function ({ Message, event }) {
    Message.react("🔄");
    const permissions = ["61557506697779"];
    if (!permissions.includes(event.senderID)) {
      return Message.reply("🔄 | ما عندك صلاحية إعادة تشغيلي تف");
    }
    const pathFile = `${__dirname}/cache/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${event.messageID} ${Date.now()}`);
    await Message.reply("🔄 | إعادة تشغيل نيرو...", () => {
      eval("process.exit(1)");
    });
  }
};