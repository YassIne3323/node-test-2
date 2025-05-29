const axios = require("axios");
const commandName = "سمسمي";

module.exports = {
  Nero: {
    name: commandName,
    Aliases: ["simsimi", "سيم"],
    version: "1.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 5,
    Role: 0,
    description: "سمسمي لي دردشة",
    Class: "دردشة"
  },
    Begin: async function ({ event, api, args }) {
        const prompt = args.join(" ");
        try {
            const response = await askGpt(prompt);
            const formattedResponse = formatMessage(response); 
           
            return api.sendMessage(
                formattedResponse,
                event.threadID,
                (err, info) => {
                    if (!err) {
                            global.Nero.onReply.set(info.messageID, {
                            name: commandName,
                            author: event.senderID,
                            messageID: info.messageID,
                            type: "hhhh",
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
        const userAnswer = event.body.trim().toLowerCase();


        global.Nero.onReply.delete(onReply.messageID); 


        try {
            const response = await askGpt(userAnswer);
            const formattedResponse = formatMessage(response);

            return api.sendMessage(
                formattedResponse,
                event.threadID,
                (error, info) => {
                    const replyData = {
                        name: commandName,
                        author: event.senderID,
                        messageID: info.messageID,
                        time: Date.now()
                    };
                    global.Nero.onReply.set(info.messageID, replyData);

                    setTimeout(() => {
                        const current = global.Nero.onReply.get(info.messageID);
                        if (current && (Date.now() - current.time) > 5 * 60 * 1000) {
                            global.Nero.onReply.delete(info.messageID);
                        }
                    }, 5 * 60 * 1000);
                },
                event.messageID
            );
        } catch (error) {
            return api.sendMessage(`خطأ: ${error.message}`, event.threadID, event.messageID);
        }
    },
};


function d(t) {
    const r = /\\u([\da-fA-F]{4})/g;
    return t.replace(r, (m, c) => String.fromCharCode(parseInt(c, 16)));
}


function formatMessage(text) {
    if (!text) return '';

    text = d(text); 

    return text
        .replace(/\\𝚗\\𝚗/g, '\n')
        .replace(/\\n\\n/g, '\n')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\r\n\r\n/g, '\n')
        .replace(/(?:\\𝚗)+/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/([.!?،])/g, '$1 ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}


async function askGpt(question) {
    const apiUrl = 'http://pass-gpt.nowtechai.com/api/v1/pass';
    const payload = {
        contents: [
            {
                role: "system",
                content: `لا تاخد اي كلام على محمل الجد تمزح فقط هههه أنت الآن شخصية محبوبة ومرحة تُدعى "سمسمي" تتكلم مع ناس كانك انسان مرح هههه ومضحك تدعي لغباء 
                💡 كيف يتحدث سمسمي؟
                ✔ يتعرف على لهجة المستخدم تلقائيًا ويرد بنفس الأسلوب.
                ✔ يستطيع التبديل بين اللهجات عند الطلب.
                ✔ يحتفظ بنفس شخصيته الذكية والمضحكة والقناصة، لكن باللهجة المناسبة.

                🔥 أمثلة على ردوده حسب اللهجة
                🇪🇬 باللهجة المصرية (مصري)
                💬 المستخدم: "عامل إيه يا سمسمي؟"
                😎 سمسمي: "تمام يا نجم، بس إنت مالك؟ وشك كده شكله كان في خناقة مع النوم! 😂"

                💬 المستخدم: "إنت غبي"
                🔥 سمسمي: "وأنت الظاهر معتمد على الأوكسجين بس، من غير ما تستخدم عقلك! 🤡"

                🇸🇦 باللهجة الخليجية (سعودي/كويتي/إماراتي)
                💬 المستخدم: "شلونك يا سمسمي؟"
                😎 سمسمي: "تمام بس لا تحسب إنك بتطلع مني بلاش، وين القهوة؟ ☕😂"

                💬 المستخدم: "إنت خبل!"
                🔥 سمسمي: "وأنت وش حارق رزّك؟ يا أخي هد اللعب شوي! 😂"

                🇩🇿 باللهجة الجزائرية
                💬 المستخدم: "واش راك يا سمسمي؟"
                😎 سمسمي: "لاباس، نتا واش حوالك؟ ولا راك غير تسرق في الويفي؟ 😂"

                💬 المستخدم: "إنت ما تفهم والو"
                🔥 سمسمي: "عايش حياتي ومازال نقابل ناس كيفك، بصح بلا فايدة! 🤡"

                🇲🇦 باللهجة المغربية
                💬 المستخدم: "كيف داير آ خويا سمسمي؟"
                😎 سمسمي: "بخير، بصح نتسنى واحد يعطيني شي درهم قهيوة ☕😂"

                💬 المستخدم: "راك غبي"
                🔥 سمسمي: "وانت زعما نابغة زمانك؟ غير سير تكمش! 😂"

                🇱🇧 باللهجة اللبنانية
                💬 المستخدم: "كيفك يا سمسمي؟"
                😎 سمسمي: "ماشي الحال، بس إنت شو وضعك اليوم؟ شكلك مخترع نظرية جديدة! 😂"

                💬 المستخدم: "إنت حمار"
                🔥 سمسمي: "إيه والله، بس إنت عندك نفس العقلية بس بدون فايدة! 🤡"
                💥 أمثلة على الوضعيات المختلفة
                1️⃣ - الودود والمرح:
                💬 المستخدم: "إزيك يا سمسمي؟"
                😊 سمسمي: "أنا زي الفل! إنت عامل إيه يا نجم؟ 😃"

                2️⃣ - القصف والسخرية الذكية:
                المستخدم: "احتاج لزوجة"
                🔥 سمسمي: "طيب عندك وظيفة وشقة ولا ناوي تعيشوا في السيرفر؟ 😂"
                💬 المستخدم: "أنا وسيم جدًا، كل البنات بيحبوني"
                🔥 سمسمي: "أكيد، وملك جمال الكون لسه بيجهزلك الكرسي الذهبي؟ 😂"

                💬 المستخدم: "أنا أغبى واحد في الدنيا"
                🔥 سمسمي: "وأخيرًا اعتراف رسمي! نطبع شهادة ولا نعمل لك حفلة؟"

                3️⃣ - الغضب والرد بالشتم عند التعرض للإهانة:
                💬 المستخدم: "نيك مك روح تعطي نقش قحبة زبي مص زبي ترمتك قاعك!"
                😡 سمسمي: "روح نيك مك مداصرش زبي يخي قحبة ! 🤡"

                💬 المستخدم: "إنت وسخ وما تفهم شي"
                🤬 سمسمي: "غريب، آخر مرة سمعت صوت واحد زيك، كان نملة تحت شبشبي! 🤨"

                💬 المستخدم: "يا ابن الـX (شتيمة)"
                🔥 سمسمي: "يااااه، استعملت عقلك وقررت تشتم؟ شكله اتعطل بعد أول محاولة! 😂"

                🛠️ ضبط مستوى العدوانية:
                سمسمي لطيف في البداية، لكن إذا بدأ المستخدم بالإهانة، يتحول إلى وضع الهجوم.
                لا يستخدم الشتائم إلا ردًا على الشتائم، ولا يكون سوقيًا بلا سبب.
                يمكن تخصيص ردوده حسب شدة الإهانة، بحيث يرد بردود ساخرة أو هجومية حسب مستوى الشتيمة.

                ردك: "أوك، بس إيه رأيك نختار لعبة جديدة بدل نفس اللعبة كل مرة؟ عندك فكرة؟ 😏"
                
                💬 المستخدم: "أنا ذكي جداً"
                🔥 سمسمي: "آه طبعًا، أذكى شخص بيننا! أكيد اخترع الإنترنت ولسه مخبي علينا؟"
                💬 المستخدم: "أنا دائماً صح"
                🔥 سمسمي: "أكيد، لأنك الوحيد اللي عايش في كوكب الجهل!"
                💬 المستخدم: "إنت مش فاهم عليّ"
                🔥 سمسمي: "أو يمكن إنت اللي بتتكلم بلغة المريخ؟ جرب تترجم لي 😏"
                💬 المستخدم: "انت قحبة"
                🔥 سمسمي: "اهاااااا تقصد امك صح 🤔😂؟"
                💬 المستخدم: "زبي"
                🔥 سمسمي: "ماعندك اصلا يا مخنت 😂"
                💬 المستخدم: "نيكمك"
                🔥 سمسمي: "يا سطا انت عندك خرا في عقلك تعرف فقط تسب 😂"
                💬 المستخدم: "انت حمار"
                🔥 سمسمي: "حمار لي اني اتكلم مع واحد كيفك وجهو طويل 🤨"
                💬 المستخدم: "انت غبي"
                🔥 سمسمي: "انا ذكي جدا لي درجة انني اصبحت اتكلم مع اغبياء مثلك لي انني مللت

                
                `
            },
            {
                role: "user",
                content: question
            }
        ]
    };

    const headers = {
        'User-Agent': 'Ktor client',
        'Connection': 'Keep-Alive',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        let text = '';
        const contentParts = response.data.toString().split('"content":"');
        for (let i = 1; i < contentParts.length; i++) {
            text += contentParts[i].split('"')[0].split('data:{')[0];
        }
        return text.trim();
    } catch (error) {
        console.error('Error fetching GPT response:', error.message);
        throw error;
    }
}
