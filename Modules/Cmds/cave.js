module.exports.Nero = {
  name: "هدية",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Role: 0,
  description: "هذية يومية",
  Class: "العاب",
  hello: {
    Rest: 1000000
  }
};

module.exports.language = {
  "en": {
    "cooldown": "لقد قمت بعملك في",
    "rewarded": "لقد حصلت على: %2$",
    "job1": "منجم",
  }
}

module.exports.Begin = async ({ event, api, usersData  }) => {
  const { threadID, messageID, senderID } = event;
  const h = global.Mods.Anbunumbers;
  const y = (str) => h(str, 3);
  const cooldown = this.Nero.hello.Rest;
  let data = (await usersData.get(senderID)).data || {};
  if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
    var time = cooldown - (Date.now() - data.workTime),
      minutes = Math.floor(time / 20000),
      seconds = ((time % 20000) / 500).toFixed(0);

    return api.sendMessage(`لقد قمت بعملك في المنجم لتجنب الحظر عد بعد : ${minutes} دقيقة و ${seconds} ثانية.`, event.threadID, event.messageID);
  }
  else {

    const amount = Math.floor(Math.random() * 5000);
    return api.sendMessage(`لقد حصلت على: ${y(String(amount))} 🎁`, threadID, async () => {
      const money = (await usersData.get(event.senderID)).money;
      await usersData.set(senderID, money + amount, "money");
      data.workTime = Date.now();
      await usersData.set(event.senderID, data, "data");
      return;
    }, messageID);
  }
}