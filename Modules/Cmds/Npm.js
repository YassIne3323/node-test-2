module.exports.Nero = {
  name: "مكتبات",
  version: "1.0.0",
  Role: 0,
  credits: "",
  description: "",
  Class: "خدمات",
  usages: "",
  Rest: 5
};

module.exports.Begin = async (
{
  api,
  event,
  args
}) =>
{
  const axios = require('axios');
  const request = require('request');
 const fs = require("fs");
  var cc = args.join(" ");
  if (!cc) return api.sendMessage(`أدخل عنوان الموقع`, event.threadID, event.messageID);
  else
  {
    axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(cc)}`).then(res =>
    {
      const c = res.data.author;
      const a = res.data.name;
      const b = res.data.description;
      const d = res.data.keywords;
      {
        api.sendMessage({body: `==== معلومات ====\n\n الاسم : ${a}\n\nالوصف: ${b}\n\nكلمات: ${d}`}, event.threadID, event.messageID);
      };
    })
  }
}