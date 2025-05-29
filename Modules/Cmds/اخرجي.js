module.exports.Nero = {
  name: "اخرجي",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 3,
  description: "انسى",
  Class: "المطور"
};

module.exports.Begin = async function ({ api, event, Message }) {
  const permission = Settings.ADMINBOT;
  if (!permission.includes(event.senderID)) {
    return Message.reply("❌ | لا يمكنك استخدام هذا الأمر");
  }

  await Message.react("👋🏻");

  setTimeout(() => {
    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  }, 1000); 
};
