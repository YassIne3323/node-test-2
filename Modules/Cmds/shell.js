const { exec } = require('child_process');

module.exports = {
  Nero: {
    name: "shell",
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 3,
    description: "لا تهتم له",
    Class: "المطور"
  },


    Begin: async function({ event, api, args }) {
        const code = args.join(" ");
        if (!code) return api.sendMessage("⚠️ يرجى إدخال كود لتشغيله!", event.threadID, event.messageID);

        try {
            exec(code, (error, stdout, stderr) => {
                if (error) {
                    api.sendMessage(`❌ خطأ في الكود:\n${error.message}`, event.threadID, event.messageID);
                    return;
                }
                if (stderr) {
                    api.sendMessage(`❌ خطأ في الكود:\n${stderr}`, event.threadID, event.messageID);
                    return;
                }
                api.sendMessage(`🔹 النتيجة:\n${stdout}`, event.threadID, event.messageID);
            });
        } catch (error) {
            api.sendMessage(`❌ خطأ في الكود:\n${error.message}`, event.threadID, event.messageID);
        }
    }
};