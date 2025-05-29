const axios = require("axios");
const cheerio = require("cheerio");
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const wordPattern = /(كسممممممممم)/i;
const headers2 = {
  "accept": "application/json"
}

const headers = {
  "accept": "application/json",
  "Cookie":"token=369655189:2:1697695251:xbyyOCRI-aOklMbmBBxWVcmOY2zHjdfsNInsgH-Qvaq473nkhAF6gD5VaKMMZTHk;" 
}



module.exports = {
    Nero: {
        name: "روايات",
        version: "1.0.0",
        credits: "𝐘-𝐀𝐍𝐁𝐔",
        Rest: 5,
        Role: 0,
        description: "مكتبة روايات",
        Class: "خدمات"
    },
    Begin: async ({ Message: message, event }) => {
        const msg = `🔥 |  مكتــبة الروايات 🏫📚

 ←› يرجى الرد على هذه الرسالة بكلمات البحث لاسم الروايات  
 المراد البحث عنه . 

⌯︙يفضل استخدام الحروف الانجليزية .`;

        message.reply(msg, (err, info) => {
            global.Nero.onReply.set(info.messageID, {
                name: "روايات",
                ID: info.messageID,
                author: event.senderID,
                type: "letsSearch"
            });
        });
    },
    onReply: async ({ onReply, Message: message, event }) => {
        const { type, result, author } = onReply;
         if( author != event.senderID ) return;
const messageBody = event.body.trim().toLowerCase();
        const body = parseInt(messageBody);

        if (type === "letsSearch") {
            const keywords = messageBody;
            message.reply("انتظر شوي 🔎");
            try {
                const response = await axios.get(
                    `https://api.wattpad.com/v4/search/stories?query=${encodeURIComponent(keywords)}&mature=1&free=1&paid=1&limit=10&fields=stories(id%2Ctitle%2CvoteCount%2CreadCount%2CnumParts%2Cuser%2Cmature%2Ccompleted%2Crating%2Ccover%2Cpromoted%2CisPaywalled%2CpaidModel)&language=16`,
               { headers: headers } );
              const mangaData = response.data.stories;
                const NumberOfSearch = mangaData.length;

                if (NumberOfSearch === 0) {

                    return message.reply(`❌︙لم يتم العثور على "${keywords}"🫠`);
                }

                let formattedMessage = `〄 تم العثور على ${NumberOfSearch} روايات 🔎⤷\n\n`;

                mangaData.forEach((anime, index) => {
                    formattedMessage += `${index + 1}- الاسم ←› ${anime.title}🤍\n`;
                    formattedMessage += `←› البارتات: ${anime.numParts}🗝\n`;
                    formattedMessage += `←› عدد القراء: ${anime.voteCount}✨\n\n`;
                });

                let please = `⌯︙قم بالرد برقم بين 1 و ${NumberOfSearch} 🧞‍♂`;
                if (NumberOfSearch === 1) {
                    please = "⌯︙ قم بالرد برقم واحد 1 .";
                }

                message.reply(
                    `
${formattedMessage}
${please}
`,
                    (err, info) => {
                        global.Nero.onReply.set(info.messageID, {
                            name: "روايات",
                            ID: info.messageID,
                            resultMessageID: info.messageID,
                            author: event.senderID,
                            type: "animeResults",
                            result: mangaData,
                        });
                    }
                );
            } catch (error) {
                console.error("Error occurred while fetching anime data:", error);
                return message.reply(`❌︙لم يتم العثور على "${keywords}"🧞‍♂`);
            }
        }

        if (type === "animeResults") {
            try {
                if (isNaN(body) || body < 1 || body > result.length) {
                    return message.reply(`⌯︙قم بالرد برقم بين 1 و ${result.length} 🧞‍♂`);
                }
                const index = body - 1;
                const playUrl = result[index].id;

                const response = await axios.get(
                    `https://www.wattpad.com/api/v3/stories/${encodeURIComponent(playUrl)}?drafts=0&include_deleted=1&fields=id%2Ctitle%2Clength%2CcreateDate%2CmodifyDate%2CvoteCount%2CreadCount%2CcommentCount%2Curl%2Cpromoted%2Csponsor%2Clanguage%2Cuser%2Cdescription%2Ccover%2Chighlight_colour%2Ccompleted%2CisPaywalled%2CpaidModel%2Ccategories%2CnumParts%2CreadingPosition%2Cdeleted%2CdateAdded%2ClastPublishedPart%28createDate%29%2Ctags%2Ccopyright%2Crating%2Cstory_text_url%28text%29%2C%2Cparts%28id%2Ctitle%2CvoteCount%2CcommentCount%2CvideoId%2CreadCount%2CphotoUrl%2CmodifyDate%2CcreateDate%2Clength%2Cvoted%2Cdeleted%2Ctext_url%28text%29%2Cdedication%2Curl%2CwordCount%29%2CisAdExempt%2CtagRankings`,
                  { headers : headers2} );


                const mangaData = response.data;
                const downloadLinks = "";
                let downloadMessage = "";
let come = mangaData.completed;
let trn;
              if(come == false) {
trn = "غير مكتملة";
              }
if(come == true) {
trn = "مكتملة";
              }

                const msg = `
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› المؤلف : ${mangaData.user.name} ☸
←› الاسم : ${mangaData.title} ☸
←› عدد الاجزاء : ${mangaData.numParts} ✴
←› مكتملة : ${trn} 🔱
←› الفئات : ${mangaData.tags.join(", ")} 🔖
←› التقييم : ${mangaData.rating} ✳
←› عدد القراء : ${mangaData.readCount} ✳

• ┉ • ┉ • ┉ • ┉ • ┉ •
←› القصة : ${mangaData.description} 📖
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› لقرائة الرواية : الرجاء الرد على الرساله بكلمة "قراءة"
                `;
                const stream = await global.Mods.imgd(mangaData.cover);
                message.reply(
                    {
                        body: msg,
                        attachment: stream,
                    },
                    (err, info) => {
                        const downloadLinks = "";
                        let downloadMsg = "";

                            global.Nero.onReply.set(info.messageID, {
                            name: "روايات",
                            ID: info.messageID,
                            resultMessageID: info.messageID,
                            author: event.senderID,
                            type: "mangaChapte",
                            result: mangaData
                        });
                    }
                );
            } catch (error) {
                console.error("Error occurred while fetching anime details:", error);
                return message.reply("❌︙حدث خطأ أثناء جلب تفاصيل الروايات. الرجاء المحاولة مرة أخرى في وقت لاحق.");
            }
        }

        if (type == "mangaChapte" && messageBody === "قراءة" ) {
            var res = await axios.get(
                    `https://www.wattpad.com/api/v3/stories/${encodeURIComponent(result.id)}?drafts=0&include_deleted=1&fields=id%2Ctitle%2Clength%2CcreateDate%2CmodifyDate%2CvoteCount%2CreadCount%2CcommentCount%2Curl%2Cpromoted%2Csponsor%2Clanguage%2Cuser%2Cdescription%2Ccover%2Chighlight_colour%2Ccompleted%2CisPaywalled%2CpaidModel%2Ccategories%2CnumParts%2CreadingPosition%2Cdeleted%2CdateAdded%2ClastPublishedPart%28createDate%29%2Ctags%2Ccopyright%2Crating%2Cstory_text_url%28text%29%2C%2Cparts%28id%2Ctitle%2CvoteCount%2CcommentCount%2CvideoId%2CreadCount%2CphotoUrl%2CmodifyDate%2CcreateDate%2Clength%2Cvoted%2Cdeleted%2Ctext_url%28text%29%2Cdedication%2Curl%2CwordCount%29%2CisAdExempt%2CtagRankings`,
                  { headers : headers2} );


          const resData = res.data.parts;
          let numpa = resData.length;
            let msg = `⋆˚ ⬷ تحتوي هذه الرواية على ${numpa} رد برقم الفصل لبدك تقرأه ⋆˚ ⬷`;
            message.reply(msg, (err, info) => {
                global.Nero.onReply.set(info.messageID, {
                    name: "روايات",
                    ID: info.messageID,
                    resultMessageID: info.messageID,
                    author: event.senderID,
                    type: "ReadChapt",
                    result: result,
                });
            });
        }


if (type == "ReadChapt") {
    if (isNaN(messageBody)) return message.reply("رد برقم يااا");
    let num = messageBody;
try {
  var res = await axios.get(
                    `https://www.wattpad.com/api/v3/stories/${encodeURIComponent(result.id)}?drafts=0&include_deleted=1&fields=id%2Ctitle%2Clength%2CcreateDate%2CmodifyDate%2CvoteCount%2CreadCount%2CcommentCount%2Curl%2Cpromoted%2Csponsor%2Clanguage%2Cuser%2Cdescription%2Ccover%2Chighlight_colour%2Ccompleted%2CisPaywalled%2CpaidModel%2Ccategories%2CnumParts%2CreadingPosition%2Cdeleted%2CdateAdded%2ClastPublishedPart%28createDate%29%2Ctags%2Ccopyright%2Crating%2Cstory_text_url%28text%29%2C%2Cparts%28id%2Ctitle%2CvoteCount%2CcommentCount%2CvideoId%2CreadCount%2CphotoUrl%2CmodifyDate%2CcreateDate%2Clength%2Cvoted%2Cdeleted%2Ctext_url%28text%29%2Cdedication%2Curl%2CwordCount%29%2CisAdExempt%2CtagRankings`,
                  { headers : headers2} );

  const resData = res.data.parts;


  let nomk = num - 1;



async function getStory(id) {
  try {
    const response = await axios.get(`https://www.wattpad.com/apiv2/?m=storytext&id=${id}`);
    const html = response.data;

    const $ = cheerio.load(html);
    const textArray = [];

    $('p').each((index, element) => {
      const text = $(element).text().trim();
      if (text) {
        textArray.push(text);
      }
    });
    const scrapedText = textArray.join('\n');
    return scrapedText;
  } catch (error) {
      console.error('An error occurred while scraping the content:', error);
  }
  };
let text = await getStory(resData[nomk].id);

text = text.replace(wordPattern, function (match) { return match[0] + '*'.repeat(match.length - 1) + match.slice(-1); });

                const parts = [];
                let currentPart = '';

                const words = text.split(' ');

                for (const word of words) {
                  if ((currentPart + ' ' + word).length <= 2000) {
                    currentPart += (currentPart ? ' ' : '') + word;
                  } else {
                    parts.push(currentPart);
                    currentPart = word;
                  }
                }
                if (currentPart) {
                  parts.push(currentPart);
                }

                for (const part of parts) {
message.send(part)
await delay(8000)
                }
} catch (error) {
console.log(error)
}

}


    },
};
