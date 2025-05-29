module.exports.Nero = {
  name: "طرد",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 1,
  description: "طرد شخص من المجموعة",
  Class: "المجموعة"
},

module.exports.Begin = async function({ api, event, Message }) {
  if (!event.messageReply) 
    return Message.reply("رد على رساله تبعه");

  let targetID = event.messageReply.senderID;
  let botID = api.getCurrentUserID(); 
  let botAdmins = Settings.ADMINBOT;
  
  if (targetID === botID) 
    return Message.reply("تبي تطردني يا كلب ما يصير");

  if (botAdmins.includes(targetID)) 
    return Message.reply("احلم يبني بطردك انت");

  api.removeUserFromGroup(targetID, event.threadID, (err) => {
    if (err) return Message.reply("طلعني ادمن وبوريك");
    Message.react("🚮");
  });
};