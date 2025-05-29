module.exports = {
  Nero: {
    name: "انضمام",
    version: "1.0",
    credits: "Nero",
    Rest: 5,
    Role: 0,
    description: "الانضمام الى جروب البوت اساسي",
    Class: "خدمات",
  },

  Begin: async function ({ api, Message, event, usersData }) {
    const GroupId = "9024022854367545";
    const userID = event.senderID;

    const threadInfo = await api.getThreadInfo(GroupId);
    const IDs = threadInfo.participantIDs;

    if (IDs.includes(userID)) {
      Message.reply("انت بالمجموعة مسبقا تحقق من طلبات المراسلة");
    } else {
      api.addUserToGroup(userID, GroupId, async (err) => {
        if (err) {
          Message.reply("حدث خطأ ما أثناء محاولة إضافتك للمجموعة");
        } else {
          Message.reply("تم إضافتك إلى المجموعة الأساسية للبوت");

          try {
            const userInfo = await api.getUserInfo(userID);
            const userName = userInfo[userID].name;

            const Avatar = await usersData.getAvatarUrl(userID);
            const imglove = [await Mods.imgd(Avatar)];
                                                                                                                             
            api.sendMessage(
              {
                body: `رحبوا بـ ${userName}\nعضو جديد نورنا في شات بوت نيرو!`,
                attachment: imglove,
              },
              GroupId
            );
          } catch (error) {
            console.error("خطأ أثناء إرسال رسالة الترحيب:", error);
          }
        }
      });
    }
  },
};
