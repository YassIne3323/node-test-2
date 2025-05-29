module.exports = {
  Nero: {
    name: "تصفية",
    version: "2.0",
    credits: "Z I N O",
    Rest: 5,
    Role: 0,
    description: "تصفية الحسابات في المجموعة",
    Class: "المجموعة",
  },

  Begin: async function({ api, event, Message }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const botID = api.getCurrentUserID();
      const isAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
      
      if (!isAdmin) {
        return Message.reply("- صعدني أدمن حتى أكدر اصفيهم.");
      }

      const { participantIDs } = threadInfo;
      const fakeBots = participantIDs.filter(id => {
        const userInfo = threadInfo.userInfo.find(user => user.id === id);
        return !userInfo || userInfo.gender === undefined;
      });

      if (fakeBots.length === 0) {
        return Message.reply("- ماكو حسابات طايرة بالمجموعة.");
      }

      Message.reply(`أكو ${fakeBots.length} حسابات طايرة بالكروب. جار التصفية...`);

      let success = 0;
      let fail = 0;

      for (const botID of fakeBots) {
        try {
          await api.removeUserFromGroup(botID, event.threadID);
          success++;
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        } catch (error) {
          fail++;
          console.error(`Failed to remove user ${botID}:`, error);
        }
      }

      const resultMessage = `تمت تصفية ${success} أشخاص بنجاح.${
        fail > 0 ? `\n- حدث خطأ, لم أتمكن من تصفية ${fail} أشخاص.` : ''
      }`;
      
      return Message.reply(resultMessage);
    } catch (error) {
      console.error("Error in filtering command:", error);
      return Message.reply("- حدث خطأ أثناء تنفيذ الأمر.");
    }
  }
};