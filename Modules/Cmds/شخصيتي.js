module.exports.Nero = {
  name: "شخصية",
  version: "1.0.0",
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Rest: 5,
  Role: 0,
  description: "لو كنت شخصية انمي شو حتكون شخصيتي 'ولد' أو 'بنت",
  Class: "العاب"
},
  
module.exports.Begin = async ({ api, event, args, usersData }) => {
  try {
    const request = require("request");
    const fs = require("fs-extra");
    
    const id = event.type == "message_reply" ? event.messageReply.senderID : event.senderID;
    const userName = await usersData.getName(id);

    if (!args[0]) {
      return api.sendMessage("ادخل جنسك ('ولد' أو 'بنت') أمام الأمر", event.threadID, event.messageID);
    }
    const gender = args[0];
    
    const maleLinks = [

       "https://i.postimg.cc/7ZBQyHt2/138ca07040bb975537479ffa28420c97.jpg",
       "https://i.postimg.cc/jSMpRdpr/04be360f143a6a4800f78f9ce65ec3db.jpg",
       "https://i.postimg.cc/j5bQ9yMq/0d1713498607d81328044c67d8b34b52.jpg",
       "https://i.postimg.cc/QxygD2fy/0e54c78e4a282f04efeec2aa2ad1d97f.jpg",
       "https://i.postimg.cc/cJYBXFM5/1084b6c1cedfdd24411773135b28b409.jpg",
       "https://i.postimg.cc/HkWGG7P2/13a0ed97381358c8508b31456fc79cd2.jpg",
       "https://i.postimg.cc/7hq9CSzt/159c051fb1de1b68edf575c0ac3881f1.jpg",
       "https://i.postimg.cc/dVg92bdy/16de38ca47379b2d97584a83b4c9fa21.jpg",
       "https://i.postimg.cc/BvyR17ZY/357805b2c55cc136c0558727e62da95d.jpg",
       "https://i.postimg.cc/Qx04TY0Q/368e2e121fd5126cc5e11dd24cab52cc.jpg",
       "https://i.postimg.cc/J0Kqjtcr/374de5e38390cba4f668b2e9e5a7ff8d.jpg",
       "https://i.postimg.cc/FsVtnxGz/3cbeea3394e64293113e6e097d37ccf4.jpg",
       "https://i.postimg.cc/44wbL7VZ/4fa34740e94e2293e43ab932e5c72739.jpg",
       "https://i.postimg.cc/hPysjztM/514e0925eceea58a537e94f0f400807f.jpg",
       "https://i.postimg.cc/gjMVnQmr/533a1151abbee1ffa7b79074a1dce607.jpg",
       "https://i.postimg.cc/zDwPJGhP/5467e3a79a9ffe0b3a0535f8b0c923e0.jpg",
       "https://i.postimg.cc/L5zdSkpy/54f3f7affeaee97d88fdc6f91f87c084.jpg",
       "https://i.postimg.cc/wMx5xgKS/5a7b619b8399632bb925937a1bd4c2c5.jpg",
       "https://i.postimg.cc/Cx5vHCQW/62daaf6ab2c1f5a615915bd480d79afc.jpg",
       "https://i.postimg.cc/k4vFdDHQ/82f556eae97945d1d46b944e90dfa757.jpg",
       "https://i.postimg.cc/655ztLty/85a5639f6a222077188407808ed33f8e.jpg",
       "https://i.postimg.cc/k43fm0gm/a8ad5c98b491a718aa603c2756c65e7a.jpg",
       "https://i.postimg.cc/qqHY1t32/b74df87cec33a4037cc1e354f65062c8.jpg",
       "https://i.postimg.cc/hPj8HD1m/c06cf7e6bb791370768b269e7f57dab4.jpg",
       "https://i.postimg.cc/BQq7tfcZ/c20dd7e1caf5b5cce413c687ebc8fd04.jpg",
       "https://i.postimg.cc/G3v6HjWK/c31bb481cd342be8745cfc1a5aced09d.jpg",
       "https://i.postimg.cc/vHzjvZH6/c7b2e1f8a9e478bb6460e815b4b15479.jpg",
       "https://i.postimg.cc/hGH3GJMN/c7fe28bf39cd1eb1cd1e70fac52f4a31.jpg",
       "https://i.postimg.cc/7PNXFQvF/db9f94cacdfb408905dcf7c50dfbf7ea.jpg",
       "https://i.postimg.cc/ydZthhkV/e69418b8e489afdd7e00bbcdb1e97805.jpg",
       "https://i.postimg.cc/dVhBTs7F/ece742fe0af6bc95be3a993019740c0b.jpg",
       "https://i.postimg.cc/zGGQ2YV2/f0aa9db141b89ca7e36008c7a20302fd.jpg",
       "https://i.postimg.cc/ZR8jKwWy/f6bfd93c252cd29f8441c51355df910f.jpg",
       "https://i.postimg.cc/fb0B1zZC/fec226b7d8c04baacf73e8ddaf844b56.jpg",
       "https://i.postimg.cc/nzBS9HPr/received-458919623310142.jpg",
       "https://i.postimg.cc/9MwSCPh6/0af5f3a7d8a8e30ee699004e280d05df.jpg",
       "https://i.postimg.cc/jqN91hvN/34dadb2e5a0f3074582effa2a33a7585.jpg",
       "https://i.postimg.cc/3wc6sSPj/74af58f727597fabc04d2018c5e2e150.jpg",
       "https://i.postimg.cc/KjnHgZ4Q/cda9ec089265878de07c06d55d15f34e.jpg",
       "https://i.postimg.cc/BbWz68ZX/fb4fda06d4641234692d51f9b418a071.jpg",
       "https://i.postimg.cc/vTHhfDbY/e735009e177254bafbbafc73b3cb0c62.jpg",

    ];

    const femaleLinks = [

      "https://i.postimg.cc/hPxGdVrs/19f6f97bda97ee6ac35745982e8b1306.jpg",
      "https://i.postimg.cc/SxqnC84W/7e25b045d0838a62fe94f8a0fbb9bcd4.jpg",
      "https://i.postimg.cc/kMHCwD4H/2009daff866b6969ada5c81e198a743a.jpg", 
      "https://i.postimg.cc/wjL91H9G/22eeec0f7de3a7dd080b4e93209ab936.jpg", 
      "https://i.postimg.cc/MTWZk42r/2e1295032fa603cdb849bfa350bdebf3.jpg",  
      "https://i.postimg.cc/Jh8MJgn4/33c69ae40dd2819f901bc79cfc365408.jpg", 
      "https://i.postimg.cc/6QzJZpgY/3b57b3ef59f3c37117db61b2c0a9ab38.jpg", 
      "https://i.postimg.cc/9MF2g7Z6/45a74aab7ea5e5df6c9edef36e2fba88.jpg", 
      "https://i.postimg.cc/Y0GJTf9s/45c8f70a489d0699cc7527bf463050f3.jpg",
      "https://i.postimg.cc/qBNqpP69/48f5a5196cfdec35f40dfd5c9d213ce6.jpg",
      "https://i.postimg.cc/kGH7bgVk/807aacb3966eccf56b26f468992fecb0.jpg",
      "https://i.postimg.cc/T1BXPNFx/869c0eeddb00206dc1ac8e879078513d.jpg", 
      "https://i.postimg.cc/RC2Fhgcq/87011210c0872d962b09a1f0252508e3.jpg",
      "https://i.postimg.cc/15NQdPV3/906a673f20365b571fd6b97428d5f0e5.jpg",
      "https://i.postimg.cc/KjjZjMYP/9b170bdb4b92104d776a09cf327bde72.jpg",
      "https://i.postimg.cc/k57PDb12/b02cc197a704e4eea08e2d7003c841ba.jpg", 
      "https://i.postimg.cc/PJCjTn6K/f0e24a87effc57ff8f194bf0a2066200.jpg",
      "https://i.postimg.cc/V6DfzRzs/f93afa50a1ffdc44826ac4dbf2f1839c.jpg",
      "https://i.postimg.cc/1XkLSnV5/f97992112908df29f6377c2d1ca93ccd.jpg",
      "https://i.postimg.cc/tCNJzT2W/033f7d591c9f6098cfa545bba652f557.jpg", 
      "https://i.postimg.cc/c4S6YYMd/39c18f3eea6535ac55c78559474db042.jpg", 
      "https://i.postimg.cc/T1rwFYG8/7aaf18066b8d3cd53d2adf101f106d70.jpg", 
      "https://i.postimg.cc/t4rgLc0g/87a93c465951305816db249795db3d3f.jpg", 
      "https://i.postimg.cc/t4RTvjMf/968f383bf67afe2c9555a5048b6ed91e.jpg", 
      "https://i.postimg.cc/5ycysQhq/af96f5d16964539c17a818b770f79550.jpg", 
      "https://i.postimg.cc/66RyyzZH/e1dfd179e449d31ae20fb2476141c035.jpg", 
      "https://i.postimg.cc/QxcBFm28/3458c996369efdb160b287a07a503cc9.jpg", 
      "https://i.postimg.cc/rpZsBPrJ/60d5b4541557fbb7a773e443572fc9ed.jpg", 
      "https://i.postimg.cc/XJZq4kK0/7010d06abe9d5d76dfaf27129151ccb1.jpg", 
      "https://i.postimg.cc/SxrJrsQH/b7bc8af39825523e3057a463248216f6.jpg", 
      "https://i.postimg.cc/SKxjthJR/d1ae57ca90ff52e08a149a6c952133f3.jpg", 


    ];

    let chosenLink;
    let messageText;

    if (gender === "ولد") {
      chosenLink = maleLinks[Math.floor(Math.random() * maleLinks.length)];
      messageText = `لـو كـان ♂️ ${userName} شـخـصـيـة انـمـي سـيـكـون 👇🏻`;
    } else if (gender === "بنت") {
      chosenLink = femaleLinks[Math.floor(Math.random() * femaleLinks.length)];
      messageText = `لـو كـانـت ♀️ ${userName} شـخـصـيـة انـمـي سـتـكـون 👇🏻`;
    } else {
      return api.sendMessage("الرجاء اختيار 'ولد' أو 'بنت' فقط!", event.threadID, event.messageID);
    }

    const callback = () => {
      api.sendMessage({
        body: messageText,
        attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));
    };

    return request(encodeURI(chosenLink)).pipe(fs.createWriteStream(__dirname + "/cache/1.jpg")).on("close", callback);
  } catch (error) {
    console.error(error);
    api.sendMessage(`حدث خطأ: ${error.message}`, event.threadID, event.messageID);
  }
};