module.exports.Nero = {
    name: "join",
    eventType: ["log:subscribe"],
    version: "1.0.6",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    description: "كنية"
};

module.exports.Begin = async function ({ api, event, threadsData, usersData, Message }) {
    if (!event.logMessageData.addedParticipants || event.logMessageData.addedParticipants.length === 0) return;
    const h = global.Mods.Anbunumbers;
    const y = (str) => h(str, 3);
    const botID = api.getCurrentUserID();
    const threadInfo = await api.getThreadInfo(event.threadID);
    const namee = await threadsData.get(event.threadID);
    const nameBox = namee.threadName || "No Name";
    const userNN = threadInfo.participantIDs.length;
    const time = new Date().toLocaleString("en-EG", { timeZone: "Africa/Casablanca" });

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
        await Message.reply("تــم اضـافــة بــوت بـي نــجــاح ✅");
        api.changeNickname(`✅ ${global.Settings.PREFIX} ${global.Settings.BOTNAME || ""} ✅`, event.threadID, botID);
        return;
    }

    const newMembers = event.logMessageData.addedParticipants;

    if (newMembers.length === 1) {
        const userId = newMembers[0].userFbId;
        const userInfo = await api.getUserInfo(userId);
        if (!userInfo || userId === botID) return;

        const userName = userInfo[userId].name;
        const Avatar = await usersData.getAvatarUrl(userId);
        const img = await Mods.imgd(Avatar);

        const messageToSend = {
            body: `✧ مرحبا يا:〖${userName}〗\n✧ في مجموعة:〖${nameBox}〗\n✧ عدد الأعضاء حاليا:〖${y(String(userNN))}〗\n\n✧〖${y(String(time))}〗✧`,
            attachment: img
        };

        await Message.send(messageToSend);
    } else {
        let welcomeMessage = `🌸 مرحبًا بكم نورتم المجموعة ${nameBox}! 🌸\nعدد الأعضاء الآن: ${y(String(userNN))}\nالوقت: ${y(String(time))}\n\n`;
        let attachments = [];

        for (let participant of newMembers) {
            const userId = participant.userFbId;
            if (userId === botID) continue;

            const userInfo = await api.getUserInfo(userId);
            if (!userInfo) continue;

            const userName = userInfo[userId].name;
            welcomeMessage += `- ${userName}\n`;

            const Avatar = await usersData.getAvatarUrl(userId);
            const img = await Mods.imgd(Avatar);
            attachments.push(img);
        }

        if (attachments.length > 0) {
            const messageToSend = {
                body: welcomeMessage,
                attachment: attachments
            };

            await Message.send(messageToSend);
        }
    }
};
