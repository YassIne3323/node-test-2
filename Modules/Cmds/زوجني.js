module.exports = {
  Nero: {
    name: "زوجني",
    version: "1.0.0",
    Credits: "Nero",
    Rest: 5,
    Role: 0,
    Description: "",
    Class: "العاب",
  },

  Begin: async function ({ api, event, usersData, Message }) {

    if (!event.isGroup) return Message.reply("هذا الامر للمجموعات فقط");

    let data = await usersData.get(event.senderID);
    let money = data.money;
    let gender = data.gender;
    let tile = Math.floor(Math.random() * 101);

    if (money < 20) {
      return Message.reply("تحتاج 20 للزواج دولار اكتب .منجم وا حصل على بعض المال");
    }

    let senderData = await usersData.get(event.senderID);
    let senderName = senderData.name;

    if (gender === 2) {
      let bb = event.participantIDs;
      let id;
      let gg;
      let thg;

      do {
        id = bb[Math.floor(Math.random() * bb.length)];
        gg = await usersData.get(id);
        thg = gg.gender;
      } while (thg !== 1);  
      let userData = await usersData.get(id);
      let userName = userData.name;

      let arraytag = [
        { id: event.senderID, tag: senderName },
        { id: id, tag: userName },
      ];

      await usersData.addMoney(event.senderID, -20);
      
      let Avatar = await usersData.getAvatarUrl(id);
      let Avatar2 = await usersData.getAvatarUrl(event.senderID);

      let imglove = [];
      imglove.push(await Mods.imgd(Avatar2));  
      imglove.push(await Mods.imgd(Avatar));

      let msg = {
        body: `تم الزواج ~♡\nنسبة الحب: ${tile}%\n${senderName} 💓 ${userName}`,
        mentions: arraytag,
        attachment: imglove,
      };
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (gender === 1) {
      let bb = event.participantIDs;
      let id;
      let gg;
      let thg;

      do {
        id = bb[Math.floor(Math.random() * bb.length)];
        gg = await usersData.get(id);
        thg = gg.gender;
      } while (thg !== 2);  
      let userData = await usersData.get(id);
      let userName = userData.name;

      let arraytag = [
        { id: event.senderID, tag: senderName },
        { id: id, tag: userName },
      ];

      await usersData.addMoney(event.senderID, -20);

      let Avatar = await usersData.getAvatarUrl(id);
      let Avatar2 = await usersData.getAvatarUrl(event.senderID);

      let imglove = [];
      imglove.push(await Mods.imgd(Avatar2)); 
      imglove.push(await Mods.imgd(Avatar));

      let msg = {
        body: `تم الزواج ~♡\nنسبة الحب: ${tile}%\n${senderName} 💓 ${userName}`,
        mentions: arraytag,
        attachment: imglove,
      };

      if (id === Settings.ADMINBOT[0]) {  
        tile = 100;

        msg = {
          body: `تم الزواج ~♡\nنسبة الحب: ${tile}%\n${senderName} 💓 ${userName}\nانا غيووووره 😞🩷`,
          mentions: arraytag,
          attachment: imglove,
        };
      }

      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (gender !== 1 && gender !== 2) {
      return api.sendMessage("اسفة بس ما ازوج المثليين انا 🥺🏳️‍🌈", event.threadID, event.messageID);
    }
  }
};