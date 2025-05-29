const emojiList_easy = [
  { emoji: "🐈", name: "قطة" },
  { emoji: "🥷🏻", name: "نينجا" },
  { emoji: "👽", name: "فضائي" },
  { emoji: "🔥", name: "نار" },
  { emoji: "☕", name: "قهوى" },
  { emoji: "⭐", name: "نجمة" },
  { emoji: "☀️", name: "شمس" },
  { emoji: "🌙", name: "هلال" },
  { emoji: "🦋", name: "فراشة" },
  { emoji: "✈️", name: "طائرة" },
  { emoji: "🐦‍⬛", name: "غراب" },
  { emoji: "🎁", name: "هدية" },
  { emoji: "🍎", name: "تفاحة" },
  { emoji: "🐝", name: "نحلة" },
  { emoji: "🐴", name: "حصان" },
  { emoji: "🪿", name: "بطة" },
  { emoji: "🗿", name: "صنم" }
];

const emojiList_normal = [
  { emoji: "🦇", name: "خفاش" },
  { emoji: "🦓", name: "حمار وحشي" },
  { emoji: "🦈", name: "قرش" },
  { emoji: "⚽", name: "كرة قدم" },
  { emoji: "🦨", name: "قنفذ" },
  { emoji: "🦚", name: "طاووس" },
  { emoji: "🦇", name: "خفاش" },
  { emoji: "🦘", name: "كنغر" },
  { emoji: "👨🏻‍🦯", name: "اعمى" },
  { emoji: "🍿", name: "فشار" },
  { emoji: "🫀", name: "قلب" },
  { emoji: "👻", name: "شبح" },
  { emoji: "👁️", name: "عين" },
  { emoji: "🗡", name: "سيف" },
  { emoji: "🛡", name: "درع" },
  { emoji: "💣", name: "قنبلة" },
  { emoji: "🍄", name: "فطر" },
  { emoji: "🦊", name: "ثعلب" },
  { emoji: "⚖️", name: "ميزان" },
  { emoji: "🎮", name: "يد تحكم" },
  { emoji: "🦝", name: "راكون" }
];

const emojiList_High = [
  { emoji: "🪄", name: "عصا سحرية" },
  { emoji: "🦩", name: "طائر الفلامنجو" },
  { emoji: "🧬", name: "حمض نووي" },
  { emoji: "🔭", name: "تليسكوب" },
  { emoji: "🏟️", name: "ملعب كرة القدم" },
  { emoji: "🪵", name: "جذع شجرة" },
  { emoji: "🦏", name: "وحيد القرن" },
  { emoji: "🧲", name: "مغناطيس" },
  { emoji: "🍙", name: "كرة أرز" },
  { emoji: "🦭", name: "فقمة" },
  { emoji: "🫙", name: "علبة فارغة" },
  { emoji: "🪛", name: "مفك براغي" },
  { emoji: "🔧", name: "مفتاح ربط" },
  { emoji: "🧰", name: "صندوق أدوات" },
  { emoji: "⚙️", name: "ترس" },
  { emoji: "🔨", name: "مطرقة" },
  { emoji: "💻", name: "حاسوب محمول" },
  { emoji: "📱", name: "هاتف محمول" }
];

const emojiList_banner = [
  { emoji: "🇲🇦", name: "المغرب" },
  { emoji: "🇩🇿", name: "الجزائر" },
  { emoji: "🇹🇳", name: "تونس" },
  { emoji: "🇱🇾", name: "ليبيا" },
  { emoji: "🇪🇬", name: "مصر" },
  { emoji: "🇸🇩", name: "السودان" },
  { emoji: "🇲🇷", name: "موريتانيا" },
  { emoji: "🇸🇦", name: "السعودية" },
  { emoji: "🇸🇾", name: "سوريا" },
  { emoji: "🇱🇧", name: "لبنان" },
  { emoji: "🇮🇶", name: "العراق" },
  { emoji: "🇵🇸", name: "فلسطين" },
  { emoji: "🇯🇴", name: "الأردن" },
  { emoji: "🇰🇼", name: "الكويت" },
  { emoji: "🇶🇦", name: "قطر" },
  { emoji: "🇧🇭", name: "البحرين" },
  { emoji: "🇦🇪", name: "الإمارات" },
  { emoji: "🇴🇲", name: "عُمان" },
  { emoji: "🇾🇪", name: "اليمن" },
  { emoji: "🇺🇸", name: "الولايات المتحدة" },
  { emoji: "🇨🇦", name: "كندا" },
  { emoji: "🇲🇽", name: "المكسيك" },
  { emoji: "🇧🇷", name: "البرازيل" },
  { emoji: "🇦🇷", name: "الأرجنتين" },
  { emoji: "🇨🇴", name: "كولومبيا" },
  { emoji: "🇬🇧", name: "المملكة المتحدة" },
  { emoji: "🇫🇷", name: "فرنسا" },
  { emoji: "🇩🇪", name: "ألمانيا" },
  { emoji: "🇮🇹", name: "إيطاليا" },
  { emoji: "🇪🇸", name: "إسبانيا" },
  { emoji: "🇵🇹", name: "البرتغال" },
  { emoji: "🇳🇱", name: "هولندا" },
  { emoji: "🇧🇪", name: "بلجيكا" },
  { emoji: "🇨🇭", name: "سويسرا" },
  { emoji: "🇸🇪", name: "السويد" },
  { emoji: "🇳🇴", name: "النرويج" },
  { emoji: "🇩🇰", name: "الدانمارك" },
  { emoji: "🇮🇪", name: "أيرلندا" },
  { emoji: "🇦🇹", name: "النمسا" },
  { emoji: "🇷🇴", name: "رومانيا" },
  { emoji: "🇭🇷", name: "كرواتيا" },
  { emoji: "🇺🇦", name: "أوكرانيا" },
  { emoji: "🇷🇺", name: "روسيا" },
  { emoji: "🇹🇷", name: "تركيا" },
  { emoji: "🇬🇪", name: "جورجيا" },
  { emoji: "🇮🇱", name: "إسرائيل" },
  { emoji: "🇮🇷", name: "إيران" },
  { emoji: "🇮🇳", name: "الهند" },
  { emoji: "🇵🇰", name: "باكستان" },
  { emoji: "🇧🇩", name: "بنغلاديش" },
  { emoji: "🇨🇳", name: "الصين" },
  { emoji: "🇯🇵", name: "اليابان" },
  { emoji: "🇰🇷", name: "كوريا الجنوبية" },
  { emoji: "🇵🇭", name: "الفلبين" },
  { emoji: "🇮🇩", name: "إندونيسيا" },
  { emoji: "🇲🇾", name: "ماليزيا" },
  { emoji: "🇹🇭", name: "تايلاند" },
  { emoji: "🇻🇳", name: "فيتنام" },
  { emoji: "🇸🇬", name: "سنغافورة" },
  { emoji: "🇦🇺", name: "أستراليا" },
  { emoji: "🇳🇿", name: "نيوزيلندا" },
  { emoji: "🇲🇬", name: "مدغشقر" },
  { emoji: "🇩🇿", name: "الجزائر" }
];

const emojiList_anime = [
  { emoji: "🍜🍥👊😁", name: "ناروتو" },
  { emoji: "🃏🤡🕷️😄", name: "هيسوكا" },
  { emoji: "🐜👑☠️👿", name: "ميرويم" },
  { emoji: "👨🏻‍🦲🦸🏻‍♂️👊🏻💥", name: "ون بنش مان" },
  { emoji: "🙎🏻‍♂️🏜️⚱️", name: "غارا" },
  { emoji: "👦🏻🎣🥾", name: "غون" },
  { emoji: "️‍☠️🍖👒😁", name: "لوفي" },
  { emoji: "🟢⚔️🍶🧭", name: "زورو" },
  { emoji: "🌸🩸🔥😈", name: "نيزيكو" },
  { emoji: "😌🗡️🌊📦", name: "تانجيرو" },
  { emoji: "👁️🔴🔥😏", name: "مادارا" },
  { emoji: "👺🐗⚔️🪨", name: "اينوسكي" },
  { emoji: "😈📓🖊️🍎", name: "لايت" },
  { emoji: "📖🍀👿🗣️", name: "استا" },
  { emoji: "🏀🩸👿😠", name: "اكازا" },
  { emoji: "🍚⚡👊🐒", name: "غوكو" },
  { emoji: "🐦‍⬛👁️☁️😌", name: "ايتاشي" }
];

module.exports.Nero = {
  name: "ايموجي",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "فعالية لعبة الايموجي",
  Role: 0,
  Class: "العاب"
};

let activeGames = {};
const h = global.Mods.Anbunumbers;
const y = (str) => h(str, 3);



module.exports.Begin = async function ({ api, event, args, usersData, Message: Nero }) {
  const threadID = event.threadID;
  const difficulty = args[0] ? args[0].toLowerCase() : null;

  if (difficulty === "انهاء") {
    if (activeGames[threadID]) {
      delete activeGames[threadID];
      return Nero.reply("⛔ تم إنهاء لعبة الإيموجي بنجاح");
    } else {
      return Nero.reply("⚠️ لاتوجد لعبة شغالة في المجموعة");
    }
  }

  const rounds = parseInt(args[0]);
  const level = args[1] ? args[1].toLowerCase() : 'عادي';

  if (isNaN(rounds) || rounds < 1)
    return Nero.reply(
  `✪ يرجى تحديد الجولات والنوع بشكل صحيح مثلاً:\nايموجي 𝟭𝟬 سهل\nايموجي 𝟭𝟬 اعلام\n\n✪ الأنواع المتوفرة:\n• اعلام \n• انمي \n• (سهل | عادي | صعب)\n\n✪ لإنهاء اللعبة: اكتب 'ايموجي انهاء' \n• لتخطي الجولة: رد على الرسالة بـ 'تخطي' \n\n✪ شرح الأنواع: \n• اعلام: اعطيك علم وانت تقول اسم الدولة \n• أنمي: اعطيك ايموجيات لشخصية انمي وتخمن الاسم`);
  if (activeGames[threadID])
    return Nero.reply("⛔ توجد لعبة شغالة في هاذه المجموعة!");

  let selectedList;
  if (level === 'سهل') {
    selectedList = emojiList_easy;
  } else if (level === 'صعب') {
    selectedList = emojiList_High;
  } else if (level === 'اعلام') {
    selectedList = emojiList_banner;
  } else if (level === 'انمي') {
    selectedList = emojiList_anime;
  } else {
    selectedList = emojiList_normal;
  }

  activeGames[threadID] = {
    round: 0,
    totalRounds: rounds,
    scores: {},
    currentAnswer: null,
    messageID: null,
    emojiList: selectedList
  };

  api.sendMessage(
  `🔥 | لعبة الإيموجي | 🏰🎭\n\nجاهزين تتحداو ذكاءكم؟\nهادي لعبة لي قياس من الاسرع بينكم !\n\n✧ النوع︙${level}\n✧ عدد الجولات︙${y(String(rounds))} جولات \n✧ التحدي︙رد على الرسالة بالجواب الصحيح قبل الجميع!`,
  threadID,
  () => {
    startRound(api, threadID, usersData);
  });
};


function startRound(api, threadID, usersData) {
  const game = activeGames[threadID];
  if (!game) return;

  if (game.round >= game.totalRounds) {
    return endGame(api, threadID, usersData);
  }
  
  let questionText = "شو اسم ذا الإيموجي؟";
if (game.emojiList === emojiList_banner) {
  questionText = "وش اسم الدولة دي؟";
} else if (game.emojiList === emojiList_anime) {
  questionText = "وش اسم الشخصية دي؟";
}
  const { emoji, name } = game.emojiList[Math.floor(Math.random() * game.emojiList.length)];
  game.currentAnswer = name.toLowerCase();
  game.round++;

  api.sendMessage(`الجولة ${y(String(game.round))}:\n${questionText}\n\n${emoji}`, threadID, (err, info) => {
    if (err) return;
    game.messageID = info.messageID;

    global.Nero.onReply.set(info.messageID, {
      name: module.exports.Nero.name,
      threadID: threadID
    });
  });
}

async function endGame(api, threadID, usersData) {
  const game = activeGames[threadID];
  if (!game) return;

  let result = "🏁 اللعبة انتهت! هاهيا النتائج:\n";
  let topPlayer = null;
  let maxScore = 0;

  for (const [userID, score] of Object.entries(game.scores)) {
    const userName = await usersData.getName(userID);
    result += `• ${userName}: ${y(String(score))} نقطة\n`;

    if (score > maxScore) {
      maxScore = score;
      topPlayer = userID;
    }
  }

  result += topPlayer
    ? `\nالفائز: ${await usersData.getName(topPlayer)} بــ ${y(String(maxScore))} نقطة! 🎉`
    : "\nلا يوجد فائز، تعادل.";

  if (topPlayer) {
    const currentMoney = await usersData.get(topPlayer, "money") || 0;
    await usersData.set(topPlayer, currentMoney + 1000, "money");

    api.sendMessage({
      body: `🎉 مبروك ${await usersData.getName(topPlayer)}! حصلت على 𝟭𝟬𝟬𝟬 نقطة جائزة لفوزك في آخر لعبة! 🎁`,
    }, threadID);
  }

  api.sendMessage(result, threadID);
  delete activeGames[threadID];
}


module.exports.onReply = async function ({ api, event, usersData }) {
  const threadID = event.threadID;
  const game = activeGames[threadID];
  if (!game || !game.currentAnswer) return;

  const userAnswer = event.body.trim().toLowerCase();
  if (userAnswer === "تخطي") {
    const senderID = event.senderID;
    const userName = await usersData.getName(senderID);
    
    api.sendMessage({
  body: `⏩ ${userName} تخطيت الجولة نمر للجولة التالية!`,
  mentions: [{
    tag: userName,
    id: senderID  
  }]
}, threadID, () => startRound(api, threadID, usersData));
    return;
  }
  if (userAnswer === game.currentAnswer) {
    const senderID = event.senderID;
    const userName = await usersData.getName(senderID);

    game.scores[senderID] = (game.scores[senderID] || 0) + 1;
    global.Nero.onReply.delete(game.messageID);

    api.unsendMessage(game.messageID);
    game.currentAnswer = null;

    return api.sendMessage({
  body: `✅ مبروك ${userName}! جوابك صحيح وكسبت\t${y("1")}\tنقطة`,
  mentions: [{
    tag: userName,
    id: senderID
  }]
}, threadID, () => startRound(api, threadID, usersData));
  }
};