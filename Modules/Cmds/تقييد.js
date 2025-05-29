const fs = require("fs-extra");
module.exports = {
  Nero: { 
  name: "تقييد",
  Role: 1,
  credits: "عبدالرحمن",
  Class: "المجموعة",
  description: "تقييد بوت",
  Rest: 0
},
Begin: async function({ args, api, Message, event, threadsData, usersData }) {

const thqq = event.participantIDs;
for (let uid of thqq) {
const D = await usersData.get(uid)
if(!D.name && !D.gender) {
 await usersData.create(uid);
}}

    let name = await usersData.getName(event.senderID);
  let box = await threadsData.get(event.threadID, "settings.adbox");
      if (!box) {
 await threadsData.set(event.threadID, true, "settings.adbox");
  Message.react("🔒");
 api.changeNickname(`❌ ${Settings.BOTNAME} ❌`, event.threadID, api.getCurrentUserID());
return Message.reply(`تم تقييد البوت ✅\nالفاعل: ${name}`);

      return;
      }


if(box) {
 await threadsData.set(event.threadID, false, "settings.adbox");

api.changeNickname(`✅ ${Settings.BOTNAME} ✅`, event.threadID, api.getCurrentUserID());

 return Message.reply(`تم الغاء تقييد البوت ✅\nالفاعل: ${name}`);

}

  }
}