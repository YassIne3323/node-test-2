const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.Nero = {
    name: "ابداع",
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 10,
    Role: 0,
    description: "ارسم قطة",
    Class: "إنشاء ai"
};

module.exports.Begin = async function ({ api, event, args }) {
    if (args.length === 0) {
        api.sendMessage("يمكنك استخدام الأمر هكذا\n\n تخيل [ النص الذي تريد تخيله ]", event.threadID, event.messageID);
        return;
    }

    try {
        const prompt = args.join(" ");
        api.setMessageReaction("🕟", event.messageID, (err) => {}, true);
        api.sendMessage("🕟 | انـتـظـر مـن فـضـلـك", event.threadID, event.messageID);

        const response = await axios.post('https://api-stablecog-image-sf3e.onrender.com/3YBB', {
            prompt: prompt,
        });

        const imageUrls = response.data.imageUrls;

        if (!imageUrls || imageUrls.length === 0) {
            throw new Error("لم يتم العثور على أي صور.");
        }

        const attachments = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const imgUrl = imageUrls[i];
            const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, 'cache', `image_${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            attachments.push(fs.createReadStream(imgPath));
        }

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        await api.sendMessage({
            body: `🥷🏻 تـفـضــل نـتـائـج الـخـاصـة بـك ✅`,
            attachment: attachments,
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
        await api.sendMessage(`❌ حدث خطأ\n\nخطأ: ${error.message}`, event.threadID);
    }
};
