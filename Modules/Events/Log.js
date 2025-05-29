module.exports.Nero = {
  name: "Log",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.0.0",
  credits: "Nero",
  description: "Record bot activities!",
  
};

module.exports.Begin = async function({ api, event, threadsData }) {
  const boxInfo = await api.getThreadInfo(event.threadID);
  const boxName = boxInfo.threadName;
  const boxID = event.threadID;
  const authorInfo = await api.getUserInfo(event.author);
  const authorName = authorInfo[event.author].name;
  const authorID = event.author;

  let task = "";
  let formReport =
    "=====⚜️ 「 اشعار 」 ⚜️=====" +
    "\n⚜️ اسم المجموعة ⚜️:\n「 " + boxName + " 」" +
    "\n\n⚜️ معرف المجموعة ⚜️:「 " + boxID + " 」" +
    "\n\n⚜️ الحدث ⚜️:「 " + "{task}" + " 」" +
    "\n\n⚜️ الفاعل ⚜️:「 " + authorName + " 」" +
    "\n\n⚜️ معرف الفاعل ⚜️:「 " + authorID + " 」";

  switch (event.logMessageType) {
    case "log:subscribe": {
      await threadsData.refreshInfo(event.threadID);
      if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "ضافوني لجروب!";
      break;
    }
    case "log:unsubscribe": {
      await threadsData.refreshInfo(event.threadID);
      if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
        if (event.senderID == api.getCurrentUserID()) return;
         await threadsData.set(event.threadID,{
          banned:{
            status:true,
            reason:"🚫 تم حضر هذه المجموعة بسبب طرد البوت",
            date:Date.now()
          }
        })
       

        task = "طردوني ولادل!";
      }
      break;
    }
    default:
      break;
  }

  if (task.length == 0) return;

  formReport = formReport.replace(/\{task}/g, task);

  return api.sendMessage(formReport, global.Settings.ADMINBOT[0], (error, info) => {
  });
};
