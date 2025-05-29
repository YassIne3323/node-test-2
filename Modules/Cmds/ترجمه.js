module.exports.Nero = {
	name: "ترجمة",
	Aliases: ["ترجمه", "ترجمي"],
	version: "1.0.0",
	credits: "𝐘-𝐀𝐍𝐁𝐔",
	Rest: 5,
	Role: 0,
	description: "ترجمة اي نص الى العربية",
	Class: "خدمات"
},

module.exports.Begin = async ({ api, event, args }) => {
	const request = require('request');
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return global.utils.throwError(this.config.name, event.threadID,event.messageID);
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body
		if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
		else lang = global.Nero.language;
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length)
		lang = global.Nero.language;
	}
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("حدث خطأ !", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
		api.sendMessage(`${text}\n\تمت الترجمة من  ${fromLang} الى العربية`, event.threadID, event.messageID);
	});
}
