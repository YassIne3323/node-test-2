module.exports.Nero = {
  name: "بايو",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 3,
  description: "",
  Class: ""
},

  module.exports.Begin = async ({ api, event, args}) => {
    api.changeBio(args.join(" "), (e) => {
      if(e) api.sendMessage("حدث خطأ" + e, event.threadID); return api.sendMessage("تم تغيير البايو إلى: \n"+args.join(" "), event.threadID, event.messageID)
    }
    )
  }