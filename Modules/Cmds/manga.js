const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function createPdf(imageUrls) {
  let arr = [];
  for (const url of imageUrls) {
    const img = await downloadImage(url);
    arr.push(img);

  }
  return arr;
}


let cmd = {
    Nero: {
        name: "مانجا",
        Aliases: ["مانهوا", "manga"],
        version: "1.0.0",
        credits: "𝐘-𝐀𝐍𝐁𝐔",
        Rest: 5,
        Role: 0,
        description: "تابع مانغا المفضلة لديك",
        Class: "خدمات"
      },
    Begin: async ({Message: message, event}) => {


        const msg = `🔥 |  مكتــبة المانجا 🏫📚

 ←› يرجى الرد على هذه الرسالة بكلمات البحث لاسم المانجا او المانهوا المراد البحث عنه . 

⌯︙يفضل استخدام الحروف الانجليزية .
⌯︙يمكنك البحث عن مانهوا مانجا مانها .`;

        const yo = await message.reply(msg);
                global.Nero.onReply.set(yo.messageID, {
                name: "مانجا",
                ID: yo.messageID,
                type: "letsSearch",
                author: event.senderID
        });
    },
    onReply: async ({ Message: message, onReply, text, args, event}) => {



        const { type, result, author } = onReply;

        if (author != event.senderID) return;
        const messageBody = event.body.trim().toLowerCase();
        const body = parseInt(messageBody);

        if (type === "letsSearch") {
            const keywords = messageBody;
            message.react("🔎");
            try {

              const res = await axios.get("https://api.mangamello.com/v1/mangas/search?title="+ encodeURIComponent(keywords) +"&genres=0&lang=ar&per_page=21&page=1");

                const mangaData = res.data.data;
                const NumberOfSearch = mangaData.length;

                if (NumberOfSearch === 0) {
                    message.react("❌");
                    return message.reply(`❌︙لم يتم العثور على "${keywords}"🫠`);
                }

                let formattedMessage = `〄 تم العثور على ${NumberOfSearch} مانجا 🔎⤷\n\n`;

                mangaData.forEach((anime, index) => {
                    formattedMessage += `${index + 1}- الاسم ←› ${anime.title}🤍\n`;
                    formattedMessage += `←› عدد القراء: ${anime.views}🗝\n`;
                    formattedMessage += `←› التقييم: ${anime.rate}✨\n\n`;
                });

                let please = `⌯︙قم بالرد برقم بين 1 و ${NumberOfSearch} 🧞‍♂`;
                if (NumberOfSearch === 1) {
                    please = "⌯︙ قم بالرد برقم واحد 1 .";
                }

                const yo = await message.reply(
                    `
${formattedMessage}
${please}
`)
                            global.Nero.onReply.set(yo.messageID, {
                            name: "مانجا",
                            ID: yo.messageID,
                            resultMessageID: yo.messageID,
                            author: event.senderID,
                            type: "animeResults",
                            result: mangaData,

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

      `https://api.mangamello.com/v1/mangas/${encodeURIComponent(
                        playUrl
                    )}?relations=chapters,genres&rate=true`
                );

                const mangaData = response.data.data;
                let nop = mangaData.is_completed;
                let comp;
                if (nop == 0) {
                    comp = "لا";
                } else {
                    comp = "نعم";
                }
                let rating = "لا يوجد";
                if (mangaData.rate) {
                    rating = mangaData.rate;
                }
                let season = "لا يوجد";
                if (mangaData.year) {
                    season = mangaData.year;
                }
                let toh;
                let categories = "لا يوجد";
                if (mangaData.genres) {
                    toh = mangaData.genres.map(genre => genre.name);
                    categories = toh.join(", ") 
                }
                const downloadLinks = "";
                let downloadMessage = "";

                const msg = `
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› الاسم : ${mangaData.title} ☸
←› عدد القراء : ${mangaData.views} ✴
←› مكتملة : ${comp} 🗝
←› سنة الاصدار : ${season} 🔱
←› الفئات : ${categories} 🔖
←› التقييم : ${rating} ✳
←› اخر فصل : ${mangaData.last} 🩷


• ┉ • ┉ • ┉ • ┉ • ┉ •
←› القصة : ${mangaData.summary} 📖
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› لقرائة المانجا : الرجاء الرد على الرساله بكلمة "قراءة"
                `;

                const yo = await message.reply({body: msg , attachment: await downloadImage(mangaData.img)});



                        global.Nero.onReply.set(yo.messageID, {
                            name: "مانجا",
                            ID: yo.messageID,
                            resultMessageID: yo.messageID,
                            author: event.senderID,

                            type: "mangaChapte",
                            result: mangaData
                    }
                    );
            } catch (error) {
                console.error("Error occurred while fetching anime details:", error);
                return message.reply("❌︙حدث خطأ أثناء جلب تفاصيل المانجا. الرجاء المحاولة مرة أخرى في وقت لاحق.");
            }
        }

        if (type == "mangaChapte" && messageBody === "قراءة") {
            const res = await axios.get(
      `https://api.mangamello.com/v1/mangas/${result.id}?relations=chapters,genres&rate=true`);

            const resData = res.data.data.chapters.length;
            let msg = `⋆˚ ⬷ تحتوي هذه المانغا/مانهوا على ${resData} رد برقم الفصل لبدك تقرأه ⋆˚ ⬷`;
            const yo = await message.reply(msg);

                    global.Nero.onReply.set(yo.messageID, {
                    name: "مانجا",
                    ID: yo.messageID,
                    resultMessageID: yo.messageID,
                    author: event.senderID,
                    type: "ReadChapt",
                    result: result,
            });
        }

        if (type == "ReadChapt") {
            if (isNaN(messageBody)) return message.reply("رد برقم يااا");
            let num = messageBody - 1;

            try {
                const res = await axios.get(
      `https://api.mangamello.com/v1/mangas/${result.id}?relations=chapters,genres&rate=true`);
                let data = res.data.data.chapters.reverse();
                let chapter = data[num];
                const ress = await axios.get(

      `https://api.mangamello.com/v1/mangas/${result.id}/chapters/${chapter.id}?relations=chapterImages`


);



const imgs = ress.data.data.chapterImages.map(e => e.src);

const bro = await createPdf(imgs);

    message.reply({attachment: bro});



            } catch (error) {
                message.reply("حصل خطأ")
            }
        }
    }
}; 


module.exports = cmd;