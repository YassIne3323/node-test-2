const fs = require("fs-extra");
const { Mods } = global;

module.exports = {
  Nero: {
    name: "بريفكس",
    version: "1.3",
    Credits: "Nero",
    Rest: 5,
    Role: 3,
    Class: "المطور"
  },

  languages: {
    En: {
      reset: "تم إعادة تعيين البادئة الافتراضية : %1",
      onlyAdmin: "فقط المطور يستطيع تغيير بادئة النظام",
      confirmGlobal: "تفاعل علي الرسالة لتغيير بادئة النظام كله",
      confirmThisThread: "تفاعل علي هذه الرسالة لتغيير بادئة المجموعة",
      successGlobal: "تم تغيير البادئة الافتراضية للنظام الي: %1",
      successThisThread: "تم تغيير البادئة الخاصة بالمجموعة الي : %1",
      myPrefix: "🌐 | بادئة النظام : %1\n🛸 | بادئة المجموعة: %2"
    }
  },

  Begin: async function ({ Message, Role, args, event, threadsData, getLang }) {

    if (args[0] == 'ترسيت') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return Message.reply(getLang("reset", global.Settings.PREFIX));
    }

    const newPrefix = args[0];
    const formSet = {
      Nero: {
        name: this.Nero.name,
        author: event.senderID,
        newPrefix
      }
    };

    if (args[1] === "عام") {
      if (Role < 3)
        return Message.reply(getLang("onlyAdmin"));
      else
        formSet.Nero.setGlobal = true;
    } else {
      formSet.Nero.setGlobal = false;
    }

    return Message.reply(args[1] === "عام" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.Nero.messageID = info.messageID;
      global.Nero.onReaction.set(info.messageID, formSet.Nero);
    });
  },

  onReaction: async function ({ Message, threadsData, event, onReaction, getLang }) {
    const { author, newPrefix, setGlobal } = onReaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.Settings.PREFIX = newPrefix;
      fs.writeFileSync(global.Nero.SettingsDir, JSON.stringify(global.Settings, null, 2));
      return Message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return Message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onEvent: async function ({ event, Message, getLang }) {
    if (event.body && event.body.toLowerCase() === "بادئة") {
      return Message.reply(getLang("myPrefix", global.Settings.PREFIX, Mods.getPrefix(event.threadID)));
    }
  }
};