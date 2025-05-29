const axios = require("axios");
const commandName = "مغامرة";

module.exports = {
  Nero: {
    name: commandName,
    version: "1.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 10,
    Role: 0,
    description: "مغامرة المنزل المهجور",
    Class: "العاب"
  },

  Begin: async function ({ event, api }) {
    const prompt = `(العب معي) في احد ايام الهادئة قررت انت واصدقائك ذهاب في رحلة الى منزل في الغابة عندما اوشكتم على وصول رأيتم فتات على جانب طريق ترتدي ملابس بيضاء و شعرها يغطي وجهها كانت تلوح بيدها بتجاهكم قال احد اصدقائك ان هاذه فتات غريبة و شاركه جميع اصدقائك رأي لاكنك انت لم ترا فيها شخص غريب بعد ان وصلتم الى ذلك المنزل قمت بفتح الباب لي يقع الباب على الارض و كل مصدوم وبعضهم يضحك لم يهتمو بالأمر كثيرا فا قاررو ان يصلحوه لاحقا فدخلو الى بيت ووجدو بيت عادي جدا بعدها تفرقو جميعهم يستكشفون المنزل صور معلقة في حائط و اتات المنزل يبدو قديم جدا وهناك غبار فوقه . بعد ان ارتاحو قليلا قررو ان يرتبو المنزل ويصلحو كل اشياء فيه لي يمضو عطلة صيف كلها فيه. وفي ليلة من ليالي القمرية كنت انت نائما بعدها سمعت صوت صراخ لفتات صغيرة

    1 - تذهب لي اكتشاف مصدر صوت الغريب 2 - تتجاهل الأمر وتكمل نوم 3 - تسأل اصدقائك ايدا كانو قد سمعو نفس الصوت الغريب

    1 -  لقد نهضت من سريرك و ذهبت الى مصدر الصوت وسمعت صوت رياح ووجدت باب المنزل مفتوحا مع انه لم يكن احد مستيقضا في ذلك الوقت استغربت لاكنك نجاهلت الامر و قمت بغلق الباب و قفله وعدت الى سريرك بعض لحضات قليلة سمعت ثانيا نفس صوت ولاكن هاذه مرة كان مصدر صوت قريبا كان بضبط يأتي من القبو سفلي

    1 - ذهاب لي اكتشاف مصدر الصوت 2 -تجاهل الامر لي المرة ثانية 3 - اخبار اصدقائك بالأمر

    ( ابدء من الاول من فضلك سا ترسل لي الخيارات وانا سا اختار بي ارقام و سا تضع نهايات مفخخة وعندما اخسر ركز على وضع خيار واحد في الخيارات يكون خيار عبارة عن فخ ايدا اخترته سا اخسر وتقول لي (انتهت اللعبة ولقد مت حضا موفقا في المرة المقبلة بعدها قل ايدا كنت تريد ايعادة اللعبة اختار رقم 1)ضع نهاية سعيدة في نهاية القصة لاكن ايدا استطاع اللاعب اتمامها اولا) اختيارات يجب ان تكون منطقية جدا ومخادعة في نفس الوقت لي تجعلني استخدم ذكائي(بي العربية الفصحة لا تقل شيئا اخر ليس له علاقة بي القصة من فضلك التزم بي قواعد اريدك ان تفعل هاذا فقط الان ابدء لعبة مباشرتا بدون ان تقول شيئا اتفقنا لا ترسل شيئا ليس له علاقة باللعبة ابدا من فضلك ولا كلمة واحدة)`; 

    try {
      const response = await sendRequest(prompt);
      const cleanResponse = removeSymbol(response, '*');

      return api.sendMessage(
        `${cleanResponse}\n𝐓𝐇𝐄 𝐆𝐀𝐌𝐄 𝐖𝐀𝐒 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐃 𝐁𝐘 𝐘𝐀𝐒𝐒𝐈𝐍`,
        event.threadID,
        (err, info) => {
          if (!err) {
            global.Nero.onReply.set(info.messageID, {
              name: commandName,
              author: event.senderID,
              messageID: info.messageID,
              type: "gptHerBaby",
              firstTime: true,
            });
          }
        },
        event.messageID
      );
    } catch (error) {
      return api.sendMessage(`خطأ: ${error.message}`, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, onReply }) {
    const userAnswer = event.body.trim();
    global.Nero.onReply.delete(onReply.messageID);

    if (!["1", "2", "3"].includes(userAnswer)) {
      return api.sendMessage(
        "اختيار غير صالح. من فضلك اختر 1 أو 2 أو 3.",
        event.threadID,
        event.messageID
      );
    }

    try {
      const response = await sendRequest(userAnswer);
      const cleanResponse = removeSymbol(response, '*');
      if (cleanResponse.includes("انتهت اللعبة")) {
        return api.sendMessage(cleanResponse, event.threadID, event.messageID);
      }

      return api.sendMessage(
        cleanResponse,
        event.threadID,
        (error, info) => {
          global.Nero.onReply.set(info.messageID, {
            name: commandName,
            author: event.senderID,
            messageID: info.messageID,
            firstTime: false,
          });
        },
        event.messageID
      );
    } catch (error) {
      return api.sendMessage(`خطأ: ${error.message}`, event.threadID, event.messageID);
    }
  }
};

function removeSymbol(text, symbol) {
  const regex = new RegExp(`\\${symbol}`, 'g');
  return text.replace(regex, '');
}

async function sendRequest(prompt) {
  const data = {
    prompt: prompt,
    userId: "#/chat/1737247763977",
    network: true,
    system: "",
    withoutContext: false,
    stream: false
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; VOX Alpha Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.123 Mobile Safari/537.36",
      "Origin": "https://cht18.aichatosclx.com",
      "X-Requested-With": "pure.lite.browser"
    }
  };

  try {
    const response = await axios.post(
      'https://api.binjie.fun/api/generateStream?refer__1360=n4jxnDBDciit0QNDQD%2FfG7Dyl7OplbgomSbD',
      data,
      config
    );
    return response.data || "لم يتم الحصول على رد من الخادم.";
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
