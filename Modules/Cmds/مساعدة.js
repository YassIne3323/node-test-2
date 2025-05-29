const axios = require('axios');
const fs = require('fs');
const path = require('path');
const h = global.Mods.Anbunumbers;
const y = (str) => h(str, 3);

module.exports.Nero = {
	name: "مساعدة",
	Aliases: ["help", "اوامر"],
	version: "1.0.0",
	credits: "𝐘-𝐀𝐍𝐁𝐔",
	Role: 0,
	description: "اوامر الموجودة في البوت",
	Class: "خدمات"
};

module.exports.Begin = async function({ api, event, args }) {
	const { commands } = global.Nero;
	const { threadID, senderID } = event;
	const command = commands.get((args[0] || "").toLowerCase());

	if (!command) {
		const categories = {};
		let totalCommands = 0;

		commands.forEach((cmd, name) => {
			const group = cmd.Nero.Class || "خدمات";
			if (!categories[group]) categories[group] = [];

			categories[group].push({
				name,
				description: cmd.Nero.description,
				Role: cmd.Nero.Role
			});

			totalCommands++;
		});

		const userName = await api.getUserInfo(senderID).then(res => res[senderID]?.name || "المستخدم");

		let msg = `مرحباً بك ${userName} في قائمة أوامر نيرو\n\n`;

		for (const [category, cmds] of Object.entries(categories)) {
			const role = cmds[0].Role;
			const permissionText = (role === 0) ? "الكل" : (role === 1) ? "ادمن المجموعة" : "المطور";

			msg += `━━━━━〈${category.toUpperCase()}〉━━━━━●\n`;
			msg += `الصلاحية: 𓆪${permissionText}𓆩\n`;
			msg += `عدد: ${y(String(cmds.length))} أمر\n\n`;

			cmds.forEach(cmd => {
				msg += `『${cmd.name}』`;
			});

			msg += `\n\n\n`;
		}

		msg += `✦ المجموع: ${y(String(totalCommands))} أمر ✦\n`;

		const imgURL = "https://i.postimg.cc/wMFSwcTW/NERO.gif";
		const imgPath = path.resolve(__dirname, "cache", "menu.jpg");

		if (fs.existsSync(imgPath)) {
			api.sendMessage({
				body: msg,
				attachment: fs.createReadStream(imgPath)
			}, threadID);
		} else {
			try {
				const response = await axios({ url: imgURL, responseType: 'stream' });
				response.data.pipe(fs.createWriteStream(imgPath))
					.on('finish', () => {
						api.sendMessage({
							body: msg,
							attachment: fs.createReadStream(imgPath)
						}, threadID);
					})
					.on('error', () => {
						api.sendMessage("حاول مرة أخرى لاحقًا.", threadID);
					});
			} catch (err) {
				console.error(err);
				api.sendMessage("وقع مشكل فجلب الصورة، جرب مرة أخرى.", threadID);
			}
		}
	}
};