module.exports.Nero = {
  name: "Updates",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-call",
    "log:thread-icon",
    "log:thread-color",
    "log:link-status",
    "log:magic-words",
    "log:thread-approval-mode",
    "log:thread-poll"
  ],
  version: "1.0.1",
  credits: "Nero",
  description: "Update group information quickly",
  envConfig: {
    autoUnsend: true,
    sendNoti: true,
    timeToUnsend: 10
  }
};

module.exports.Begin = async function ({ event, api, threadsData, usersData }) {
  const { author, threadID, logMessageType, logMessageData } = event;
  

  if (author === api.getCurrentUserID()) {
    return;
  }

  if (author == threadID) {
    return;
  }

  try {
    const threadInfo = await threadsData.get(event.threadID);
    const { adminIDs } = threadInfo;

    switch (logMessageType) {
      case "log:thread-admins": {
        await threadsData.refreshInfo(event.threadID);
        const nam = await usersData.get(logMessageData.TARGET_ID);
        const name = nam.name;

        if (
          logMessageData.ADMIN_EVENT === "add_admin" &&
          adminIDs !== logMessageData.TARGET_ID &&
          logMessageData.TARGET_ID !== api.getCurrentUserID()
        ) {
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» المستخدم ${name} أصبح مسؤول`,
            threadID
          );
        } else if (
          logMessageData.ADMIN_EVENT === "remove_admin" &&
          logMessageData.TARGET_ID !== api.getCurrentUserID()
        ) {
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» تم إزالة المستخدم ${name} من دور المسؤول`,
            threadID
          );
        }
        break;
      }
      case "log:user-nickname": {
        await threadsData.refreshInfo(event.threadID);
        const { members } = await threadsData.get(event.threadID);
        const nam = await usersData.get(logMessageData.participant_id);
        const name = nam.name;
        const targetUserID = await  logMessageData.participant_id;
        const targetUser = await members.find(user => user.userID === targetUserID);

        if (targetUser) {
          const nickname = await targetUser.nickname;

          if (logMessageData.participant_id !== api.getCurrentUserID()) {
            if (nickname.length === 0) {
              api.sendMessage(`[⚜️] تمت إزالة الكنية لـ ${name}.`, threadID);
            } else {
              api.sendMessage(
                `[⚜️] تم تحديث الكنية لـ ${name} إلى: ${nickname}.`,
                threadID
              );
            }
          }
        }
        break;
      }
      case "log:thread-name": {
        await threadsData.refreshInfo(event.threadID);
        const t = await threadsData.get(event.threadID);
        const threadName = t.threadName || null;

        api.sendMessage(
          `[⚜️] تحديثات المجموعة [⚜️]\n» ${
            threadName
              ? `تم تحديث اسم المجموعة الى : ${threadName}`
              : "تم حذف اسم المجموعة"
          }.`,
          threadID
        );
        break;
      }
      case "log:thread-icon": {
        await threadsData.refreshInfo(event.threadID);
        const t = await threadsData.get(event.threadID);
        const emoji = t.emoji || null;

        api.sendMessage(
          `[⚜️] تحديثات المجموعة [⚜️]\n» ${
            emoji ? `تم تحديث الايموجي  الى : ${emoji}` : "تم حذف الايموجي "
          }.`,
          event.threadID
        );
        break;
      }
      case "log:thread-call": {
        await threadsData.refreshInfo(event.threadID);
        if (logMessageData.event == "group_call_started") {
          const nam = await usersData.get(logMessageData.caller_id);
          const name = nam.name;
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» ${
              name
            } تم بدأ مكالمة ${
              logMessageData.video ? "فيديو" : ""
            }صوت.`,
            threadID
          );
        } else if (logMessageData.event == "group_call_ended") {
          const callDuration = logMessageData.call_duration;

          let hours = Math.floor(callDuration / 3600);
          let minutes = Math.floor(
            (callDuration - hours * 3600) / 60
          );
          let seconds = callDuration - hours * 3600 - minutes * 60;

          if (hours < 10) hours = "0" + hours;
          if (minutes < 10) minutes = "0" + minutes;
          if (seconds < 10) seconds = "0" + seconds;

          const timeFormat = `${hours}:${minutes}:${seconds}`;

          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» ${
              logMessageData.video ? "المكالمة انتهت" : ""
            }المكالمة انتهت.\n» مدة المكالمة: ${timeFormat}`,
            threadID
          );
        } else if (logMessageData.joining_user) {
          await threadsData.refreshInfo(event.threadID);
          const nam = await usersData.get(logMessageData.joining_user);
          const name = nam.name;
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» ${
              name
            } تم الانضمام الى مكالمة ${
              logMessageData.group_call_type == "1" ? "فيديو " : ""
            }صوتية.`,
            threadID
          );
        }
        break;
      }
      case "log:magic-words": {
        await threadsData.refreshInfo(event.threadID);
        api.sendMessage(
          `[⚜️] السمة ${
            event.logMessageData.magic_word
          } اضافة تأثيرات: ${
            event.logMessageData.theme_name
          }\n[⚜️] الايموجي: ${
            event.logMessageData.emoji_effect || "لا ايموجي"
          }\n[⚜️] الكل ${
            event.logMessageData.new_magic_word_count
          } تأثيرات الكلمات المضافة`,
          threadID
        );
        break;
      }
      case "log:thread-poll": {
        await threadsData.refreshInfo(event.threadID);
        var str = event.logMessageData.question_json;
        if (event.logMessageData.event_type == "question_creation") {
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» تم انشاء تصويت`,
            threadID
          );
        }
        if (event.logMessageData.event_type == "update_vote") {
          api.sendMessage(
            `[⚜️] تحديثات المجموعة [⚜️]\n» تم تحديث التصويت`,
            threadID
          );
        }
        break;
      }
      case "log:thread-approval-mode": {
        api.sendMessage(
          "[⚜️] تحديثات المجموعة [⚜️]\n» تم نغيير اعدادت  موافقه المجموعة",
          threadID
        );
        break;
      }
      case "log:thread-color": {
        await threadsData.refreshInfo(event.threadID);
        api.sendMessage(
          `[⚜️] تحديثات المجموعة [⚜️]\n»  تم تغيير ثيم المجموعة`,
          threadID
        );
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }
};
