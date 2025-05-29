const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

module.exports.Nero = {
    name: "تخيل",
    version: "1.0.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "تخيل قطة",
    Class: "إنشاء ai"
};

const tokens = [
    '_U=12Z46W3x2iRmwAoZRo0wR9xy9EDYuhpS2OVcEn4dLBlEQRTY2AsC5wLhRfHK1VbB0PSkTkBfGNxpxq9Cx4SMCQ_TeMWuHwJyWVJ1qWHnfGCHZRqEVG9LIGWWqzpkcwxapdoHEfU09br3MhKyTEcgeUZcT6aShb56sPsT4Dp_lVXE535i0mKPkUJNvQeOSBaXAyg-TLWTwjVcB6h2w3nuO-A',
];

let tokenIndex = 0;


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateUrl(prompt) {
    return `https://www.bing.com/images/create?q=${encodeURIComponent(prompt)}&rt=4&FORM=GENCRE`;
}

async function downloadImage(imageUrl, index) {
    const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imgPath = path.join(__dirname, 'cache', `image_${index + 1}.jpg`);
    await fs.outputFile(imgPath, imgResponse.data);
    return fs.createReadStream(imgPath);
}

async function fetchImagesFromBing(responseUrl, headers) {
    const resultsResponse = await axios.get(responseUrl, { headers });
    const $ = cheerio.load(resultsResponse.data);
    const imageUrls = [];

    $('img').each((index, element) => {
        const imgSrc = $(element).attr('src');
        if (imgSrc && imgSrc.startsWith('https') && imgSrc.includes('OIG')) {
            const match = imgSrc.match(/OIG[0-9A-Za-z.\-_?]+/);
            if (match) {
                const extractedPart = match[0];
                imageUrls.push(`https://th.bing.com/th/id/${extractedPart}=1024&h=1024&rs=1&pid=ImgDetMain`);
            }
        }
        if (imageUrls.length === 4) return false;
    });

    return imageUrls;
}

module.exports.Begin = async function ({ api, event, args }) {
    if (args.length === 0) {
        api.sendMessage("❌ | يرجى إدخال النص الذي تريد توليد صورة له.\n\n📝 الاستخدام: تخيل [النص المطلوب]", event.threadID, event.messageID);
        return;
    }

    const prompt = args.join(" ");  
    const token = tokens[tokenIndex];  
    const url = generateUrl(prompt);   
    const headers = {
        'Host': 'www.bing.com',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Linux; Android 14)',
        'referer': 'https://www.bing.com/images/create/',
        'cookie': token,
    };

    try {
        api.sendMessage("⏳ | يتم إنشاء الصورة يرجى الانتظار...", event.threadID, event.messageID);
        const startTime = Date.now();
        const response = await axios.post(url, {}, { headers });
        const responseUrl = response.request.res.responseUrl;
        
        await delay(15000);

        const imageUrls = await fetchImagesFromBing(responseUrl, headers);

        if (imageUrls.length === 0) {
            api.sendMessage("❌ | لم يتم العثور على صور للنص المدخل. حاول مجددًا بنص مختلف.", event.threadID, event.messageID);
            return;
        }

        const attachments = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const imgUrl = imageUrls[i];
            const attachment = await downloadImage(imgUrl, i);
            attachments.push(attachment);
        }
        const endTime = Date.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(2);
        
        api.sendMessage({
            body: `𝐑𝐄𝐐𝐔𝐄𝐒𝐓 :〘${prompt}〙
𝐈𝐌𝐀𝐆𝐄𝐒 : 〘 ${imageUrls.length} img 〙 🖼
𝐂𝐑𝐄𝐀𝐓𝐄𝐃 𝐈𝐍 : 〘${processingTime} sec〙⚙️
𝐈𝐌𝐀𝐆𝐄𝐒 𝐂𝐑𝐄𝐀𝐓𝐄𝐃 : ( DALL-E | Open AI ) ✅`,
            attachment: attachments,
        }, event.threadID, event.messageID);

        tokenIndex = (tokenIndex + 1) % tokens.length;
    } catch (error) {
        api.sendMessage(`❌ | حدث خطأ أثناء تنفيذ الطلب.\n\n⚠️ الخطأ: ${error.message}`, event.threadID, event.messageID);
    }
};
