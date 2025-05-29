const axios = require("axios");

module.exports.Nero = {
    name: "صور",
    Aliases: ["بنترست", "photo"],
    version: "1.0",
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    Rest: 10,
    Role: 0,
    description: "صور من بنترست",
    Class: "خدمات"
  };


module.exports.Begin = async function({ api, event, args, Message }) {
    const keySearch = args.join(" ");
    if (!keySearch) return Message.reply('احم احم اكتب شي للبحث');
    Message.react("🔍");
  var search = keySearch;
   var headers = {
    'authority': 'www.pinterest.com',
    'cache-control': 'max-age=0',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'sec-gpc': '1',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'same-origin',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': 'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-4424-ad1e-d55dfe1b9aed"; sessionFunnelEventLogged=1'
  };
  var options = {
    url: 'https://www.pinterest.com/search/pins/?q=' + search + '&rs=typed&term_meta[]=' + search + '%7Ctyped',
    headers: headers
  };



    const response = await axios.get(options.url, { headers: headers });
    const arrMatch = response.data.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
    let obj = {
      count: arrMatch.length,
      data: arrMatch
    };

  if (args.includes("-"))
    {
        const a = keySearch.split("-");
        if (a[1] > 40) return Message.send("ستهدي وكتب اقل من 40");



        const data = obj;
         let leng = data.data
    var arr = [] 
    for (var i = 0; i < a[1]; i++) {
     let rond = Math.floor(Math.random() * leng.length)
      const b = await  Mods.imgd(data.data[i]);
     await arr.push(b)
    }

    let msy = '⇣♡◄∘ صور للنتائج ∘►♡⇡'
    Message.reply({
      body: msy,
      attachment: arr
    })
  Message.react("✅");
    } else {
  
const data = obj;
let len = data.data
        var arr = [] 
        for (var i = 0; i < 9; i++) {
          let rnd = Math.floor(Math.random() * len.length)

          const b = await  Mods.imgd(data.data[i]);
         await arr.push(b)
        }

        let msy = '⇣♡◄∘ صور للنتائج ∘►♡⇡'
        Message.reply({
          body: msy,
          attachment: arr
        })
      Message.react("✅");


    }
};






