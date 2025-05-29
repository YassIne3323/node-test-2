  const path = require("path");
const fs = require("fs");

let bannedWords = {};
let warnings = {};
let badWordsActive = {};


module.exports.Nero = {
  name: "منع_سب",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 1,
  description: "إدارة و حظر الكلمات السيئة و الممنوعة إضافة [الكلمة] | إزالة [الكلمة] | القائمة | تشغيل | إيقاف",
  Class: "المجموعة"
},

module.exports.onEvent = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const loadWords = () => {
    const wordFile = path.join(__dirname, `../cmds/cache/${threadID}.json`);
    if (fs.existsSync(wordFile)) {
      const words = fs.readFileSync(wordFile, "utf8");
      bannedWords[threadID] = JSON.parse(words);
    } else {
      bannedWords[threadID] = ["قحبة","زبي","قلاوي","قحاب","نيك","كس","كسمك","ترمتك","ترمة","طبون","سكس","حويك","شرموطة","نكح",];
    }
  };

  loadWords();

  if (!badWordsActive[threadID]) return; 

  const isAdmin = (await api.getThreadInfo(threadID)).adminIDs.some(adminInfo => adminInfo.id === api.getCurrentUserID());

  if (!isAdmin) {
    api.sendMessage("البوت يحتاج إلى أن يكون المشرف", threadID);
    return;
  }

  const messageContent = event.body.toLowerCase();
  const hasBannedWord = bannedWords[threadID].some(bannedWord => messageContent.includes(bannedWord.toLowerCase()));

  if (hasBannedWord) {
    if (!warnings[senderID]) warnings[senderID] = 0;

    warnings[senderID]++;
    if (warnings[senderID] === 2) {
      api.sendMessage("أنت قد قلت كلمات سيئة و ممنوعة لمرتين متتاليتان لهذا سيتم طردك من المجموعة", threadID, messageID);
      api.removeUserFromGroup(senderID, threadID); 
      warnings[senderID] = 1;
    } else {
      api.sendMessage(`آخر إنذار لقد تم إكتشاف كلمة سيئة في جملتك  "${messageContent}" إذا قلت كلمة سيئة مرة أخرى سيتم طردك تلقائيا!`, threadID, messageID);
    }
  }
};

module.exports.Begin = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage("أرحوك قم بإختيار خيار محدد (إضافة, إزالة, قائمة, تشغيل , إيقاف) وقم بتوضيح البيانات.", threadID);
  }

  const wordFile = path.join(__dirname, `../cmds/cache/${threadID}.json`);
  if (fs.existsSync(wordFile)) {
    const words = fs.readFileSync(wordFile, "utf8");
    bannedWords[threadID] = JSON.parse(words);
  } else {
    bannedWords[threadID] = [];
  }

  const isAdmin = (await api.getThreadInfo(threadID)).adminIDs.some(adminInfo => adminInfo.id === api.getCurrentUserID());

  if (!isAdmin) {
    api.sendMessage("🛡️ | تحتاج أن تقوم بدعوة البوت إلى المشرف ثم أعد المحاولة!", threadID);
    return;
  }

  const action = args[0];
  const word = args.slice(1).join(' ');

  switch (action) {
    case 'إضافة':
      bannedWords[threadID].push(word);
      api.sendMessage(`✅ | تمت إضافة ${word} إلى قائمة الكلمات المحظورة.`, threadID);
      break;
    case 'إزالة':
      const index = bannedWords[threadID].indexOf(word);
      if (index !== -1) {
        bannedWords[threadID].splice(index, 1);
        api.sendMessage(`✅ | تمت إزالة  ${word} من قائمة الكلمات المحظورة`, threadID);
      } else {
        api.sendMessage(`الكلمة ${word} لم يتم إيجادها في قائمة الكلمات المحظورة.`, threadID);
      }
      break;
    case 'قائمة':
      api.sendMessage(`📝 | قائمة الكلمات المحظورة:\n${bannedWords[threadID].join(', ')}`, threadID);
      break;
    case 'تشغيل':
      badWordsActive[threadID] = true;
      api.sendMessage(`تم تفعيل مود الكلمات المحظورة ✅.`, threadID);
      break;
    case 'إيقاف':
      badWordsActive[threadID] = false;
      api.sendMessage(`تم إيقاف موض الكلمات المحظورة ❌.`, threadID);
      break;
    default: 
      api.sendMessage("إستخدام غير صحيح المرحو الاستخدام 'إضافة', 'إزالة', 'قائمة', 'تشغيل' أو 'إيقاف'.", threadID);
  }

  fs.writeFileSync(wordFile, JSON.stringify(bannedWords[threadID]), "utf8");
  }