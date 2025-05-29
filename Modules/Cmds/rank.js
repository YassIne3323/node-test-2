module.exports.Nero = {
  name: "rank",
  Rest: 0,
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "يحسب رانك",
  Class: "خدمات",
};

module.exports.onEvent = async function({ api, event, usersData }) {
  var {threadID, senderID } = event;
  let exp = (await usersData.get(senderID)).exp;
  exp = exp += 1;
  if (isNaN(exp)) return;
  const lv1 = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const lv2 = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));
  if (lv2 > lv1 && lv2 != 1) {
  }
  await usersData.set(senderID, { exp });
  return;
}
module.exports.Begin = async function({ api, event }) {
var {threadID, messageID} = event;
return api.sendMessage(`نفسها امر مستوى ولاكن تم ايقاف الرسائل `, threadID, messageID);
}