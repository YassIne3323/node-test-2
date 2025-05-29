const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const y = global.Mods.Anbunumbers;
const commandName = "نيرو";
const stickers = [
    "657501784333079", "657499834333274", "657502917666299",
    "657498174333440", "657500227666568", "657500794333178",
    "657500007666590", "657500430999881", "590724273418318",
    "1112675350838127", "1679351263015613", "1371048413878496"
];

module.exports = {
    Nero: {
        name: commandName,
        Aliases: ["Nero", "بوته"],
        version: "1.0.1",
        credits: "Y-ANBU",
        Rest: 5,
        Role: 0,
        description: "اسأل ذكاء اصطناعي أي سؤال، يدعم الصور والردود",
        Class: "دردشة"
    },

    Begin: async function ({ event, api, args }) {
        const prompt = args.join(" ");
        let imageUrl = null;

        if (!prompt && (!event.messageReply || !event.messageReply.attachments.length)) {
            const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
            return api.sendMessage({ sticker: randomSticker }, event.threadID, (err, info) => {
                const replyData = {
                    name: commandName,
                    author: event.senderID,
                    type: "aiHandler",
                    messageID: info.messageID,
                    time: Date.now()
                };
                global.Nero.onReply.set(info.messageID, replyData);
                autoCleanReply(info.messageID);
            }, event.messageID);
        }

        if (event.messageReply && event.messageReply.attachments.length > 0) {
            const attachment = event.messageReply.attachments[0];
            if (attachment.type === "photo") {
                const imagePath = path.join(__dirname, "cache", `uploaded_image_${Date.now()}.jpg`);
                const writer = fs.createWriteStream(imagePath);
                const response = await axios.get(attachment.url, { responseType: "stream" });
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });

                imageUrl = await uploadImage(imagePath);
            }
        }

        const userText = prompt || "";
        const response = await sendToAPI(userText, imageUrl, api, event);
        return response;
    },

    onReply: async function ({ api, Message, event, onReply }) {
    const userAnswer = event.body.trim().toLowerCase();


    if (event.senderID !== onReply.author) {
        return Message.react("🙂");
    }

    global.Nero.onReply.delete(onReply.messageID);

    try {
        await sendToAPI(userAnswer, null, api, event);
    } catch (error) {
        return api.sendMessage(`خطأ: ${error.message}`, event.threadID, event.messageID);
    }
},

};
const apiUrl = "https://app.chipp.ai/api/chat";
const headers = {
    "accept": "*/*",
    "accept-language": "ar,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "Referer": "https://app.chipp.ai/app_builder/39755/build",
};

const userConversations = {};

function updateConversation(userId, role, content) {
    if (!userConversations[userId]) {
        userConversations[userId] = [];
    }

    userConversations[userId].push({ role, content });

    if (userConversations[userId].length > 500) {
        userConversations[userId] = [];
    }
}

function applyNewLines(text) {
    return text
        .replace(/\\n/g, '\n')   
        .replace(/\*/g, '')     
        .replace(/\\/g, '')      
        .replace(/"/g, '');     
}

async function uploadImage(imagePath) {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath), {
        filename: "image.jpg",
        contentType: "image/jpeg"
    });

    const res = await axios.post("https://app.chipp.ai/api/upload/image?subfolder=chat-images", form, {
        headers: {
            ...headers,
            ...form.getHeaders(),
        }
    });

    return `https://storage.googleapis.com/chipp-images/${res.data.url}`;
}

async function sendToAPI(userText, imageUrl, api, event) {
    try {
        const content = imageUrl && userText
            ? `${userText} ![](${imageUrl})`
            : imageUrl
            ? `![](${imageUrl})`
            : userText;

        
        updateConversation(event.senderID, "user", content);

        const requestData = {
            messages: [...(userConversations[event.senderID] || [])],
            chatSessionId: "a395d43f-00dc-4533-b037-ab9bc219537a"
        };

        const response = await axios.post(apiUrl, requestData, { headers });

        let cleanedResponse = imageUrl ? cleanResponse2(response.data) : cleanResponse(response.data);
        cleanedResponse = applyNewLines(cleanedResponse);

        const decoratedResponse = y(String(cleanedResponse), 3);

        
        updateConversation(event.senderID, "assistant", cleanedResponse);

        const urlMatch = cleanedResponse.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            const extractedImageUrl = urlMatch[0].replace(/[\)\}""]+/g, '');
            await downloadAndSendImage(api, event, extractedImageUrl);
        } else {
            api.sendMessage(decoratedResponse || "❌ لم يتم العثور على رد مناسب.", event.threadID, (err, info) => {
                if (err) return;
                const replyData = {
                    name: commandName,
                    author: event.senderID,
                    messageID: info.messageID,
                    time: Date.now()
                };
                if (!global.Nero.onReply) global.Nero.onReply = new Map();
                global.Nero.onReply.set(info.messageID, replyData);
                autoCleanReply(info.messageID);
            }, event.messageID);
        }

    } catch (error) {
        console.error("❌ خطأ أثناء إرسال الطلب:", error.message);
        api.sendMessage("❌ حدث خطأ أثناء جلب البيانات من API.", event.threadID, event.messageID);
    }
}

function cleanResponse(response) {
    return response
        .replace(/0:"(.*?)"/g, '$1')
        .replace(/\n/g, '')
        .replace(/e:{.*?}/g, '')
        .replace(/d:{.*?}/g, '')
        .replace(/,"isContinued":false}}/g, '')
        .trim();
}

function cleanResponse2(response) {
    try {
        const match = response.match(/a:\s*({.*})/);
        if (match) {
            const aSection = JSON.parse(match[1]);
            return aSection.result || "❌ لم يتم العثور على نتيجة مناسبة.";
        } else {
            return "❌ لم يتم العثور على جزء الإجابة (a:).";
        }
    } catch (error) {
        console.error("❌ خطأ أثناء تنظيف الرد:", error.message);
        return "❌ حدث خطأ أثناء تحليل الرد.";
    }
}


function autoCleanReply(messageID) {
    setTimeout(() => {
        const current = global.Nero.onReply.get(messageID);
        if (current && (Date.now() - current.time) > 5 * 60 * 1000) {
            global.Nero.onReply.delete(messageID);
        }
    }, 5 * 60 * 1000);
}

async function downloadAndSendImage(api, event, url) {
    const imagePath = path.join(__dirname, 'cache', `response_image_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imagePath);
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });

    api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, (err, info) => {
        if (err) return;
        const replyData = {
            name: commandName,
            author: event.senderID,
            messageID: info.messageID,
            time: Date.now()
        };
        if (!global.Nero.onReply) global.Nero.onReply = new Map();
        global.Nero.onReply.set(info.messageID, replyData);
        autoCleanReply(info.messageID);
    }, event.messageID);
}
