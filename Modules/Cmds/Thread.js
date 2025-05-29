const { getTime } = global.Mods;

module.exports = {
	Nero: {
		name: "ثريد",
		version: "1.4",
		Credits: "Nero",
		Rest: 5,
		Role: 3,
		Description:"",
		Class: "المطور",
	},

	languages: {
		En: {
    noPermission: "ليس لديك الإذن لاستخدام هذه الميزة",
    found: "🔎 تم العثور على %1 مجموعة تطابق الكلمة الرئيسية \"%2\" في بيانات البوت:\n%3",
    notFound: "❌ لا توجد مجموعات تطابق الكلمة الرئيسية: \"%1\" في بيانات البوت",
    hasBanned: "تم حظر المجموعة بالمعرف [%1 | %2] من قبل:\n» السبب: %3\n» الوقت: %4",
    banned: "تم حظر المجموعة بالمعرف [%1 | %2] باستخدام البوت.\n» السبب: %3\n» الوقت: %4",
    notBanned: "المجموعة بالمعرف [%1 | %2] غير محظورة باستخدام البوت",
    unbanned: "تم رفع الحظر عن المجموعة بالمعرف [%1 | %2] باستخدام البوت",
    missingReason: "لا يمكن أن يكون سبب الحظر فارغًا",
    info: "» معرف الصندوق: %1\n» الاسم: %2\n» تاريخ الإنشاء: %3\n» إجمالي الأعضاء: %4\n» ذكور: %5 أعضاء\n» إناث: %6 أعضاء\n» إجمالي الرسائل: %7%8"
}
	},

	Begin: async function ({ args, threadsData, Message, Role, event, getLang }) {
		const type = args[0];

		switch (type) {
			// find thread
			case "find":
			case "search":
			case "بحث":
			case "-s": {
				if (Role < 2)
					return Message.reply(getLang("noPermission"));
				let allThread = await threadsData.getAll();
				let keyword = args.slice(1).join(" ");
				if (['-j', '-join'].includes(args[1])) {
					allThread = allThread.filter(thread => thread.members.some(member => member.userID == global.GoatBot.botID && member.inGroup));
					keyword = args.slice(2).join(" ");
				}
				const result = allThread.filter(item => item.threadID.length > 15 && (item.threadName || "").toLowerCase().includes(keyword.toLowerCase()));
				const resultText = result.reduce((i, thread) => i += `\n╭Name: ${thread.threadName}\n╰ID: ${thread.threadID}`, "");
				let msg = "";
				if (result.length > 0)
					msg += getLang("found", result.length, keyword, resultText);
				else
					msg += getLang("notFound", keyword);
				Message.reply(msg);
				break;
			}
			// ban thread
			case "ban":
			case "بان": {
				if (Role < 2)
					return Message.reply(getLang("noPermission"));
				let tid, reason;
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				}
				else {
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}
				if (!tid)
					return Message.reply("❌| خطاء في استخدام الأمر");
				if (!reason)
					return Message.reply(getLang("missingReason"));
				reason = reason.replace(/\s+/g, ' ');
				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (status)
					return Message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				return Message.reply(getLang("banned", tid, name, reason, time));
			}
			// unban thread
			case "unban":
			case "نوبان": {
				if (Role < 2)
					return Message.reply(getLang("noPermission"));
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return Message.reply("❌| خطاء في استخدام الأمر");

				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (!status)
					return Message.reply(getLang("notBanned", tid, name));
				await threadsData.set(tid, {
					banned: {}
				});
				return Message.reply(getLang("unbanned", tid, name));
			}
			// info thread
			case "info":
			case "معلومات": {
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return Message.reply("❌| خطاء في استخدام الأمر");
				const threadData = await threadsData.get(tid);
				const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
				const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
				const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
				const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
				const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
				const infoBanned = threadData.banned.status ?
					`\n- محظورة: ${threadData.banned.status}`
					+ `\n- السبب: ${threadData.banned.reason}`
					+ `\n- الوقت: ${threadData.banned.date}` :
					"";
				const msg = getLang("info", threadData.threadID, threadData.threadName, createdDate, valuesMember.length, totalBoy, totalGirl, totalMessage, infoBanned);
				return Message.reply(msg);
			}
			default:
				return Message.reply("❌| خطاء في استخدام الأمر");
		}
	}
};