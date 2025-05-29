let messageCounts = {};
let isSpamDetectionEnabled = true; 
const spamWarningThreshold = 20; 
const spamKickThreshold = 50;
const spamInterval = 60000;

module.exports.Nero = {
  name: "منع_سبام",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 1,
  description: "لما يفعل شخص سبام يطرده البوت",
  Class: "المجموعة"
},

module.exports.Begin = function ({ api, event, args }) {
  if (args[0] === 'تشغيل') {
    isSpamDetectionEnabled = true;
    api.sendMessage("تم تشغيل منع السبام.✅", event.threadID, event.messageID);
  } else if (args[0] === 'ايقاف') {
    isSpamDetectionEnabled = false;
    api.sendMessage("تم إيقاف منع السبام.❌", event.threadID, event.messageID);
  } else {
    api.sendMessage("يجب تحديد 'تشغيل' أو 'ايقاف'.", event.threadID, event.messageID);
  }
};

module.exports.onEvent = function ({ api, event }) {
  if (!isSpamDetectionEnabled) return; 

  const { threadID, messageID, senderID } = event;

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = {};
  }

  if (!messageCounts[threadID][senderID]) {
    messageCounts[threadID][senderID] = {
      count: 1,
      timer: setTimeout(() => {
        delete messageCounts[threadID][senderID];
      }, spamInterval)
    };
  } else {
    messageCounts[threadID][senderID].count++;

   
    if (messageCounts[threadID][senderID].count === spamWarningThreshold) {
      api.sendMessage("⚠️ | تحذير: تم اكتشاف أنك تكثر من الرسائل، توقف الآن أو سيتم طردك.", threadID, messageID);
    }

    
    if (messageCounts[threadID][senderID].count >= spamKickThreshold) {
      api.sendMessage("📛 | تم اكتشاف 50 سبام، سيتم طردك من المجموعة.", threadID, messageID);
      api.removeUserFromGroup(senderID, threadID);
    }
  }
};