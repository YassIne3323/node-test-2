const { getTime } = global.Mods;
const prefix = global.Mods.getPrefix
module.exports = {
 Nero: {
		name: "يوزر",
		version: "1.3",
		Credits: "Nero",
		Rest: 5,
		Role: 3,
		Description: "",
		Class: "المطور",
		
	},

	languages: {
		En: {
    noUserFound: "❌ لا يوجد مستخدم يتطابق مع الاسم المدخل: \"%1\" في بيانات البوت",
    userFound: "🔎 تم العثور على %1 مستخدم يتطابق مع الاسم \"%2\" في بيانات البوت:\n%3",
    uidRequired: "لا يمكن ترك معرف المستخدم الذي سيتم حظره فارغًا، يرجى إدخال معرف المستخدم أو العلامة أو الرد على رسالة واحدة بـ user ban <uid> <سبب>",
    reasonRequired: "لا يمكن ترك سبب حظر المستخدم فارغًا، يرجى إدخال معرف المستخدم أو العلامة أو الرد على رسالة واحدة بـ user ban <uid> <سبب>",
    userHasBanned: "تم حظر المستخدم بالمعرف [%1 | %2] من قبل:\n» السبب: %3\n» التاريخ: %4",
    userBanned: "تم حظر المستخدم بالمعرف [%1 | %2]:\n» السبب: %3\n» التاريخ: %4",
    uidRequiredUnban: "لا يمكن ترك معرف المستخدم الذي سيتم إلغاء حظره فارغًا",
    userNotBanned: "المستخدم بالمعرف [%1 | %2] ليس محظورًا",
    userUnbanned: "تم إلغاء حظر المستخدم بالمعرف [%1 | %2]"
}
	},

	Begin: async function ({ args, usersData, Message, event, getLang }) {
		const type = args[0];
		switch (type) {
			// find user
			case "find":
			case "بحث":
			case "search":
			case "-s": {
				const allUser = await usersData.getAll();
				const keyWord = args.slice(1).join(" ");
				const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
				const msg = result.reduce((i, user) => i += `\n╭الااسم: ${user.name}\n╰المعرف: ${user.userID}`, "");
				Message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
				break;
			}
			// ban user
			case "ban":
			case "بان": {
				let uid, reason;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
					reason = args.slice(1).join(" ");
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
					reason = args.slice(1).join(" ").replace(mentions[uid], "");
				}
				else if (args[1]) {
					uid = args[1];
					reason = args.slice(2).join(" ");
				}
				else return Message.reply("❌| خطاء في استخدام الأمر");

				if (!uid)
					return Message.reply(getLang("uidRequired"));
				if (!reason)
					return Message.reply(getLang("reasonRequired", prefix));
				reason = reason.replace(/\s+/g, ' ');

				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;

				if (status)
					return Message.reply(getLang("userHasBanned", uid, name, userData.banned.reason, userData.banned.date));
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await usersData.set(uid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				Message.reply(getLang("userBanned", uid, name, reason, time));
				break;
			}
			// unban user
			case "unban":
			case "نوبان": {
				let uid;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
				}
				else if (args[1]) {
					uid = args[1];
				}
				else
					return Message.reply("❌| خطاء في استخدام الأمر");
				if (!uid)
					return Message.reply(getLang("uidRequiredUnban"));
				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;
				if (!status)
					return Message.reply(getLang("userNotBanned", uid, name));
				await usersData.set(uid, {
					banned: {}
				});
				Message.reply(getLang("userUnbanned", uid, name));
				break;
			}
			default:
				return Message.reply("❌| خطاء في استخدام الأمر");
		}
	}
};