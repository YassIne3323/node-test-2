const Nero = {
  name: "ايدي",
  Aliases: ["رصيد", "معلوماتي"],
  Rest: 0,
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  description: "شوف كم فلوس عندك",
  Class: "خدمات",
};

module.exports = {
  Nero: Nero,

  Begin: async function({ api, event, Message: Nero, usersData }) {
    const id = event.type == "message_reply" ? event.messageReply.senderID : event.senderID;
    const tat = await usersData.get(id);

    if (!tat.name || !tat.gender) { 
      await usersData.create(id); 
    }

    const h = global.Mods.Anbunumbers;
    const y = (str) => h(str, 3);
    const name = await usersData.getName(id);
    const data = await usersData.get(id);

    function getRank(exp) {
      if (exp >= 100000) return 'خارق';
      if (exp >= 20000) return 'عظيم';
      if (exp >= 10000) return 'أسطوري';
      if (exp >= 8000) return 'نشط قوي';
      if (exp >= 4000) return 'نشط';
      if (exp >= 2000) return 'متفاعل قوي';
      if (exp >= 1000) return 'متفاعل جيد';
      if (exp >= 800) return 'متفاعل';
      if (exp >= 500) return 'لا بأس';
      if (exp >= 300) return 'مبتدأ';
      if (exp >= 100) return 'صنم';
      return 'ميت';
    }

    function leveluser(exp) {
      return Math.floor(exp / 100);
    }

    const rank = getRank(data.exp);
    const level = leveluser(data.exp);

    const gender = {
      1: "انثى",
      2: "ذكر",
      3: "🏳️‍🌈",
    };

    const userInfoMsg = `مرحبا 𓆩⚝𓆪 ${name} 𓆩⚝𓆪
𓆩تصنيفك𓆪 :  ${y(String(rank))} 

𓆩مستواك𓆪 :  ${y(String(level))} 

𓆩عدد رسائلك𓆪 :  ${y(String(data.exp))} 

𓆩ايدي تبعك𓆪 :  ${id} 

𓆩فلوسك𓆪 : ${y(String(data.money))} 💸

𓆩جنسك𓆪 : ${gender[data.gender] || "غير محدد"}`;

    try {
      let Avatar = await usersData.getAvatarUrl(id);
      let imglove = [];
      imglove.push(await Mods.imgd(Avatar)); 

      let messageToSend = {
        body: userInfoMsg,
        attachment: imglove,
      };
      Nero.reply(messageToSend);
      
    } catch (error) {
      console.error(error);
      Nero.reply("فشل تحميل صورة البروفايل ❌");
    }
  }
};
