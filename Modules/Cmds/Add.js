const { findUid } = global.Mods;

module.exports.Nero = {
  name: "ضيفي",
  version: "1.0.0",
  Role: 0,
  credits: "Nero",
  description: "",
  Class: "خدمات",
  usages: "",
  Rest: 5
};

module.exports.Begin = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      "[⚜️]→ الرجاء إدخال الرابط أو معرف المستخدم الذي تريد إضافته إلى المجموعة!",
      threadID,
      messageID
    );
  }

  const linkOrUid = args[0];

  try {
    let uid;
    if (linkOrUid.includes("facebook.com")) {
      uid = await findUid(linkOrUid);
    } else {
      uid = linkOrUid;
    }

    const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);

    api.addUserToGroup(uid, threadID, (err) => {
      if (participantIDs.includes(uid)) {
        return api.sendMessage(
          "[⚜️]→ العضو موجود بالفعل في المجموعة",
          threadID,
          messageID
        );
      }
      if (err) {
        return api.sendMessage(
          "[⚜️]→ لا يمكن إضافة أعضاء إلى المجموعة",
          threadID,
          messageID
        );
      }
      if (approvalMode && !adminIDs.some((item) => item.id == api.getCurrentUserID())) {
        return api.sendMessage(
          "[⚜️]→ تمت إضافة المستخدم إلى قائمة الموافقة",
          threadID,
          messageID
        );
      }
      return api.sendMessage(
        "[⚜️]→ تمت إضافة أعضاء إلى المجموعة بنجاح",
        threadID,
        messageID
      );
    });
  } catch (error) {
    console.error(error);
    return api.sendMessage(
      "[⚜️]→ لا يمكن إضافة أعضاء إلى المجموعة",
      threadID,
      messageID
    );
  }
};
