const fs = require("fs");

module.exports.Nero = {
  name: "شخصية",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "خمن الشخصية من التلميحات",
  Role: 0,
  Class: "العاب"
};

let activeGame = {};
let characters = [];


try {
  characters = JSON.parse(fs.readFileSync(__dirname + "/cache/characters.json", "utf-8"));
} catch (e) {
  console.error("❌ خطأ أثناء قراءة ملف الشخصيات:", e.message);
}

module.exports.Begin = async function ({ api, event, Message }) {
  const threadID = event.threadID;

  if (activeGame[threadID]) return;

  if (characters.length === 0)
    return api.sendMessage("❌ لا توجد شخصيات متوفرة في قاعدة البيانات!", threadID);

  const randomChar = characters[Math.floor(Math.random() * characters.length)];

  activeGame[threadID] = {
    answer: randomChar.name,
    hints: randomChar.hints,
    currentHint: 0
  };

  api.sendMessage(
    `🕵️‍♂️ خمن من انا :\n\n${randomChar.hints[0]}`,
    threadID,
    (err, info) => {
      if (err) return;
      global.Nero.onReply.set(info.messageID, {
        name: module.exports.Nero.name,
        threadID
      });
    }
  );
};

module.exports.onReply = async function ({ api, event, Message, usersData }) {
  const threadID = event.threadID;
  const game = activeGame[threadID];
  if (!game) return;

  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = game.answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    delete activeGame[threadID];
    global.Nero.onReply.delete(event.messageID);

    const currentMoney = (await usersData.get(event.senderID)).money || 0;
    await usersData.set(event.senderID, currentMoney + 1000, "money");

    return Message.reply(`✅| صحيح! أنا: "${game.answer}". تم إضافة 💸𝟭𝟬𝟬𝟬 نقطة إلى رصيدك.`);
  }

  game.currentHint++;

  if (game.currentHint < game.hints.length) {
    api.sendMessage(
      `🥷🏻| تلميح آخر:\n\n${game.hints[game.currentHint]}`,
      threadID,
      (err, info) => {
        if (err) return;
        global.Nero.onReply.set(info.messageID, {
          name: module.exports.Nero.name,
          threadID
        });
      }
    );
  } else {
    delete activeGame[threadID];
    global.Nero.onReply.delete(event.messageID);
    api.sendMessage(`❌ انتهت التلميحات!\n\nالجواب الصحيح كان: ${game.answer}.`, threadID);
  }
};
