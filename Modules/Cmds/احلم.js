const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports.Nero = {
  name: "احلم",
  version: "1.0.0",
  Role: 0,
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "توليد صور",
  Class: "إنشاء ai",
  usages: "احلم [نص]",
  Rest: 10
};

const STYLES = {
    "1": "115", 
    "2": "161",
    "3": "159",
    "4": "158",
    "5": "151",
    "6": "150",
    "7": "148",
    "8": "147",
    "9": "145",
    "10": "140",
    "11": "132",
    "12": "131",
    "13": "129",
    "14": "126",
    "15": "125",
    "16": "127",
    "17": "121",
    "18": "123",
    "19": "120",
    "20": "128"
};

module.exports.Begin = async ({ api, event, args }) => {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("❌ | الرجاء إدخال نص للوصف!", event.threadID);
api.sendMessage(`🎨✨ اختار نمط ما ✨🎨
『اسلوب واقعي』1
『اسلوب حضارات القديمة』2
『اسلوب كرتون』3
『اسلوب طبيعة』4
『اسلوب الفن راقي』5
『اسلوب فلات』6
『اسلوب رسم على لوحة』7
『اسلوب كلاي』8
『اسلوب روبوتات』9
『اسلوب ميكانيك』10
『اسلوب لوغو』11
『اسلوب ستيكرز』12
『اسلوب ابيض و اسود』13
『اسلوب الانمي』14
『اسلوب الكريسماس』15
『اسلوب كوميك』16
『اسلوب رعب 1』17
『اسلوب رعب 2』18
『اسلوب رسم شخصيات تاريخية』19
『اسلوب طفولي』20`, event.threadID, (err, info) => {
       global.Nero.onReply.set(info.messageID, {
           name: module.exports.Nero.name,
           author: event.senderID,
           prompt: prompt,
           type: "style_selection"
        });
    });
};

module.exports.onReply = async ({ api, event, onReply }) => {
    if (onReply.type === "style_selection") {
        const selectedStyle = event.body.trim();
        if (!STYLES[selectedStyle]) return api.sendMessage("❌ | الرقم غير صحيح، حاول مرة أخرى!", event.threadID);

        api.sendMessage("⏳ | يتم إنشاء الصورة، الرجاء الانتظار...", event.threadID);
        const refreshToken = "AMf-vBzjo6i642qP-b4dg6vcMXbrRoCOHohtbPPnnnBI4BAiON0l4TFixIG57cTqHiA2qMEWqW11RO0UgNxkpa8JnQkNZ-ThbrEOSY0lRmc0BLBbR8NuOUsF6WtHfy_a6XChkv2F1jnL1zz3fiSHFvS2e5wThRAPfsQTPc7mo6ihtPr2MHMZ9JZFkcoBY4x4JcigHMkWC7mK6sibB0dEcYaeVGEl9--Q8FbhDnYtWfgt24NxSMKdw1w4-45nL7w7H8WtYEz6dAPEp1cIDDIrQn_Fxzhr6-vGncxvUCvTWP7lNnCfUd5wMFVQOC2o3UXP4fFJvtdtB3_C0JXJigVu30fQlax4ttQe0nr0xw5k6bQ90OTeJ1Q_waaJgDVRRvGMFEngzRGdn2_iU-q0boQrRRT4XUbE84VfUg"; 

        try {
            const accessToken = await yass(refreshToken);
            if (!accessToken) return api.sendMessage("❌ | فشل في جلب التوكن!", event.threadID);
            generateImage(onReply.prompt, STYLES[selectedStyle], accessToken, api, event);
        } catch (error) {
            api.sendMessage("❌ | حدث خطأ أثناء جلب التوكن!", event.threadID);
        }
    }
};

async function generateImage(prompt, style, token, api, event) {
    try {
        const headers = {
            "accept": "*/*",
            "accept-language": "ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": `bearer ${token}`, 
            "content-type": "text/plain;charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-app-version": "WEB-2.0.0",
            "Referer": "https://dream.ai/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        };

        const response = await axios.post("https://paint.api.wombo.ai/api/v2/tasks", {
            is_premium: false,
            input_spec: {
                aspect_ratio: "old_vertical_ratio",
                prompt: prompt,
                style: style,
                display_freq: 10
            }
        }, { headers });

        const taskId = response.data.id;
        checkImageStatus(taskId, headers, api, event);
    } catch (error) {
        console.error("❌ | خطأ في إنشاء الصورة:", error.message);
        api.sendMessage("❌ | حدث خطأ أثناء إنشاء الصورة!", event.threadID);
    }
}

async function checkImageStatus(taskId, headers, api, event) {
    const interval = setInterval(async () => {
        try {
            const response = await axios.get(`https://paint.api.wombo.ai/api/v2/tasks/${taskId}`, { headers });
            if (response.data.state === "completed") {
                clearInterval(interval);
                const imageUrl = response.data?.result?.final;
                if (imageUrl) {
                    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    const imagePath = path.join(__dirname, 'image.jpg');
                    fs.writeFileSync(imagePath, imageResponse.data);
                    api.sendMessage({
                        body: "✅ | تم إنشاء الصورة!",
                        attachment: fs.createReadStream(imagePath)
                    }, event.threadID, () => fs.unlinkSync(imagePath));
                } else {
                    api.sendMessage("❌ | لم يتم العثور على الصورة!", event.threadID);
                }
            }
        } catch (error) {
            clearInterval(interval);
            console.error("❌ | خطأ في متابعة الحالة:", error.message);
            api.sendMessage("❌ | حدث خطأ أثناء جلب الصورة!", event.threadID);
        }
    }, 3000);
}

async function yass(refreshToken) {
    try {
        if (!refreshToken) {
            console.error("❌ | لا يوجد Refresh Token!");
            return null;
        }

        const response = await axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw", {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        });

        return response.data.access_token;
    } catch (error) {
        console.error("❌ | فشل تجديد التوكن:", error.message);
        return null;
    }
} 