const { findUid } = global.Mods;
const moment = require("moment-timezone");

module.exports = {
    Nero: {
        name: "بان",
        version: "1.2",
        Credits: "Nero",
        Rest: 5,
        Role: 1,
        Class: "المجموعة",
    },

    languages: {
        En: {
            notFoundTarget: "⚠️ | يرجى تاغ الشخص لحظره أو إدخال معرف المستخدم أو رابط Facebook أو الرد على رسالة الشخص لحظره",
            notFoundTargetUnban: "⚠️ | يرجى تاغ الشخص لإلغاء حظره أو إدخال معرف المستخدم أو رابط Facebook أو الرد على رسالة الشخص لإلغاء حظره",
            userNotBanned: "⚠️ | الشخص بالمعرف %1 غير محظور من هذه المجموعة",
            unbannedSuccess: "✅ | تم إلغاء حظر %1 من المجموعة!",
            cantSelfBan: "⚠️ | لا يمكنك حظر نفسك",
            cantBanAdmin: "❌ | لا يمكنك حظر المسؤول",
            existedBan: "❌ | تم حظر هذا الشخص من قبل",
            noReason: "لا يوجد سبب",
            bannedSuccess: "✅ | تم حظر %1 من المجموعة",
            needAdmin: "⚠️ | يحتاج الروبوت إلى إذن المسؤول لطرد الأعضاء المحظورين",
            noName: "مستخدم Facebook",
            noData: "📑 | لا يوجد أعضاء محظورين في هذه المجموعة",
            listBanned: "📑 | قائمة الأعضاء المحظورين في هذه المجموعة (الصفحة %1/%2)",
            content: "%1/ %2 (%3)\nالسبب: %4\nوقت الحظر: %5\n\n",
            needAdminToKick: "⚠️ | تم حظر العضو %1 (%2) من المجموعة، ولكن الروبوت ليس لديه إذن المسؤول لطرد هذا العضو، يرجى منح الروبوت إذن المسؤول لطرد هذا العضو",
            bannedKick: "⚠️ | تم حظر %1 من المجموعة من قبل!\nالمعرف: %2\nالسبب: %3\nوقت الحظر: %4\n\nالروبوت قام تلقائيًا بطرد هذا العضو"
        }
    },

    Begin: async function ({ Message, event, args, threadsData, getLang, usersData, api }) {
        const { members, adminIDs } = await threadsData.get(event.threadID);
        const { senderID } = event;
        let target;
        let reason;

        const dataBanned = await threadsData.get(event.threadID, 'data.banned_ban', []);

        if (args[0] == 'فك') {
            if (!isNaN(args[1]))
                target = args[1];
            else if (args[1]?.startsWith('https'))
                target = await findUid(args[1]);
            else if (Object.keys(event.mentions || {}).length)
                target = Object.keys(event.mentions)[0];
            else if (event.messageReply?.senderID)
                target = event.messageReply.senderID;
            else
                return api.sendMessage(getLang('notFoundTargetUnban'), event.threadID, event.messageID);

            if (!target) {
                return api.sendMessage(getLang('notFoundTargetUnban'), event.threadID, event.messageID);
            }

            const index = dataBanned.findIndex(item => item.id == target);
            if (index == -1)
                return api.sendMessage(getLang('userNotBanned', target), event.threadID, event.messageID);

            dataBanned.splice(index, 1);
            await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
            const userName = members[target]?.name || await usersData.getName(target) || getLang('noName');

            return api.sendMessage(getLang('unbannedSuccess', userName), event.threadID, event.messageID);
        }
        else if (args[0] == "بحث") {
            if (!dataBanned.length)
                return;
            for (const user of dataBanned) {
                if (event.participantIDs.includes(user.id))
                    api.removeUserFromGroup(user.id, event.threadID);
            }
        }

        if (event.messageReply?.senderID) {
            target = event.messageReply.senderID;
            reason = args.join(' ');
        }
        else if (Object.keys(event.mentions || {}).length) {
            target = Object.keys(event.mentions)[0];
            reason = args.join(' ').replace(event.mentions[target], '');
        }
        else if (!isNaN(args[0])) {
            target = args[0];
            reason = args.slice(1).join(' ');
        }
        else if (args[0]?.startsWith('https')) {
            target = await findUid(args[0]);
            reason = args.slice(1).join(' ');
        }
        else if (args[0] == 'قائمة') {
            if (!dataBanned.length)
                return Message.reply(getLang('noData'));
            const limit = 20;
            const page = parseInt(args[1] || 1) || 1;
            const start = (page - 1) * limit;
            const end = page * limit;
            const data = dataBanned.slice(start, end);
            let msg = '';
            let count = 0;
            for (const user of data) {
                count++;
                const name = members[user.id]?.name || await usersData.getName(user.id) || getLang('noName');
                const time = user.time;
                msg += getLang('content', start + count, name, user.id, user.reason, time);
            }
            return Message.reply(getLang('listBanned', page, Math.ceil(dataBanned.length / limit)) + '\n\n' + msg);
        }

        if (!target)
            return Message.reply(getLang('notFoundTarget'));
        if (target == senderID)
            return Message.reply(getLang('cantSelfBan'));
        if (adminIDs.includes(target))
            return Message.reply(getLang('cantBanAdmin'));

        const banned = dataBanned.find(item => item.id == target);
        if (banned)
            return Message.reply(getLang('existedBan'));

        const name = members[target]?.name || (await usersData.getName(target)) || getLang('noName');
        const time = moment().tz(global.Settings.TimeZone).format('HH:mm:ss DD/MM/YYYY');
        const data = {
            id: target,
            time,
            reason: reason || getLang('noReason')
        };

        dataBanned.push(data);
        await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
        Message.reply(getLang('bannedSuccess', name), () => {
            if (members.some(item => item.userID == target)) {
                if (adminIDs.includes(api.getCurrentUserID()))
                    api.removeUserFromGroup(target, event.threadID);
                else
                    Message.send(getLang('needAdmin'), (err, info) => {
                        global.Nero.onListen.push({
                            messageID: info.messageID,
                            onListen: ({ event }) => {
                                if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
                                    const { TARGET_ID } = event.logMessageData;
                                    if (TARGET_ID == api.getCurrentUserID()) {
                                        api.removeUserFromGroup(target, event.threadID, () => global.Nero.onListen = global.Nero.onListen.filter(item => item.messageID != info.messageID));
                                    }
                                }
                            }
                        });
                    });
            }
        });
    },

    onRun: async function ({ event, api, threadsData, getLang, Message }) {
        if (event.logMessageType == "log:subscribe") {
            const { threadID } = event;
            const dataBanned = await threadsData.get(threadID, 'data.banned_ban', []);
            const usersAdded = event.logMessageData.addedParticipants;

            for (const user of usersAdded) {
                const { userFbId, fullName } = user;
                const banned = dataBanned.find(item => item.id == userFbId);
                if (banned) {
                    const reason = banned.reason || getLang('noReason');
                    const time = banned.time;
                    return api.removeUserFromGroup(userFbId, threadID, err => {
                        if (err)
                            return Message.send(getLang('needAdminToKick', fullName, userFbId), (err, info) => {
                                global.Nero.onListen.push({
                                    messageID: info.messageID,
                                    onListen: ({ event }) => {
                                        if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
                                            const { TARGET_ID } = event.logMessageData;
                                            if (TARGET_ID == api.getCurrentUserID()) {
                                                api.removeUserFromGroup(userFbId, event.threadID, () => global.Nero.onListen = global.Nero.onListen.filter(item => item.messageID != info.messageID));
                                            }
                                        }
                                    }
                                });
                            });
                        else
                            Message.send(getLang('bannedKick', fullName, userFbId, reason, time));
                    });
                }
            }
        }
    }
};
