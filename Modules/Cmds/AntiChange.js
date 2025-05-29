const { getStreamFromURL } = global.Mods;
const FormData = require('form-data');
const axios = require('axios');
const regCheckURL = /^(http|https):\/\/[^ "]+$/;

async function uploadImgbb(file) {
  let type = "file";
  try {
    if (!file) {
      throw new Error("The first argument (file) must be a stream or an image URL");
    }
    if (regCheckURL.test(file) === true) {
      type = "url";
    }
    if (
      (type !== "url" && !(typeof file._read === "function" && typeof file._readableState === "object")) ||
      (type === "url" && !regCheckURL.test(file))
    ) {
      throw new Error("The first argument (file) must be a stream or an image URL");
    }

    const res_ = await axios({
      method: "GET",
      url: "https://imgbb.com",
    });

    const auth_token = res_.data.match(/auth_token="([^"]+)"/)[1];
    const timestamp = Date.now();

    const formData = new FormData();
    formData.append("source", file);
    formData.append("type", type);
    formData.append("action", "upload");
    formData.append("timestamp", timestamp);
    formData.append("auth_token", auth_token);

    const res = await axios.post("https://imgbb.com/json", formData, {
      headers: formData.getHeaders(),
    });

    return res.data.image.url;
  } catch (err) {
    throw new Error(err.response ? err.response.data : err);
  }
}


module.exports = {
  Nero: {
    name: "حماية",
    version: "1.7",
    author: "Nero",
    Rest: 5,
    Role: 1,
    Description: "",
    Class: "المجموعة",
  },

  Begin: async function ({ Message, event, args, threadsData }) {
    if (!["تشغيل", "إيقاف"].includes(args[1])) {
      return Message.reply("❌ | اختيار خاطئ اختر تشغيل او ايقاف");
    }

    const { threadID } = event;
    const dataAntiChangeInfoBox = await threadsData.get(
      threadID,
      "data.antiChangeInfoBox",
      {}
    );

    async function checkAndSaveData(key, data) {
      if (args[1] === "إيقاف") {
        delete dataAntiChangeInfoBox[key];
      } else {
        dataAntiChangeInfoBox[key] = data;
      }

      await threadsData.set(
        threadID,
        dataAntiChangeInfoBox,
        "data.antiChangeInfoBox"
      );

      Message.reply(`تم ${
        args[1] === "تشغيل" ? "تشغيل" : "إيقاف"
      } حماية تغيير ${key} في صندوق الدردشة`);
    }

    switch (args[0]) {
      case "الصورة":
      case "avatar": {
        const { imageSrc } = await threadsData.get(threadID);
        if (!imageSrc) {
          return Message.reply("لم تقم بتعيين صورة لصندوق الدردشة");
        }
        const newImageSrc = await uploadImgbb(imageSrc);
        await checkAndSaveData("avatar", newImageSrc);
        break;
      }
      case "الأسم": {
        const { threadName } = await threadsData.get(threadID);
        await checkAndSaveData("name", threadName);
        break;
      }
      case "الكنية": {
        const { members } = await threadsData.get(threadID);
        await checkAndSaveData(
          "nickname",
          members.map((user) => ({ [user.userID]: user.nickname })).reduce(
            (a, b) => ({ ...a, ...b }),
            {}
          )
        );
        break;
      }
      case "الثيم": {
        const { threadThemeID } = await threadsData.get(threadID);
        await checkAndSaveData("theme", threadThemeID);
        break;
      }
      case "الايموجي": {
        const { emoji } = await threadsData.get(threadID);
        await checkAndSaveData("emoji", emoji);
        break;
      }
      default: {
        return Message.reply("❌ | اختيار خاطئ");
      }
    }
  },

  onRun: async function ({ Message, event, threadsData, Role, api }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const dataAntiChange = await threadsData.get(
      threadID,
      "data.antiChangeInfoBox",
      {}
    );

    switch (logMessageType) {
      case "log:thread-image": {
        if (!dataAntiChange.avatar && Role < 1) {
          return;
        }
        const handleImageChange = async () => {
          if (Role < 1 && api.getCurrentUserID() !== author) {
            if (dataAntiChange.avatar !== "REMOVE") {
              Message.reply(
                "حماية تغيير الصورة مشغلة بالفعل في صندوق الدردشة الخاص بك"
              );
              api.changeGroupImage(
                await getStreamFromURL(dataAntiChange.avatar),
                threadID
              );
            }
          } else {
            const imageSrc = logMessageData.url;
            if (!imageSrc) {
              await threadsData.set(threadID, "REMOVE", "data.antiChangeInfoBox.avatar");
            } else {
              const newImageSrc = await uploadImgbb(imageSrc);
              await threadsData.set(
                threadID,
                newImageSrc.image.url,
                "data.antiChangeInfoBox.avatar"
              );
            }
          }
        };
        return handleImageChange();
      }
      case "log:thread-name": {
        if (!dataAntiChange.hasOwnProperty("name")) {
          return;
        }
        const handleNameChange = async () => {
          if (Role < 1 && api.getCurrentUserID() !== author) {
            Message.reply(
              "حماية تغيير الاسم مشغلة بالفعل في صندوق الدردشة الخاص بك"
            );
            api.setTitle(dataAntiChange.name, threadID);
          } else {
            const threadName = logMessageData.name;
            await threadsData.set(threadID, threadName, "data.antiChangeInfoBox.name");
          }
        };
        return handleNameChange();
      }
      case "log:user-nickname": {
        if (!dataAntiChange.hasOwnProperty("nickname")) {
          return;
        }
        const handleNicknameChange = async () => {
          const { nickname, participant_id } = logMessageData;

          if (Role < 1 && api.getCurrentUserID() !== author) {
            Message.reply(
              "حماية تغيير اللقب مشغلة بالفعل في صندوق الدردشة الخاص بك"
            );
            api.changeNickname(
              dataAntiChange.nickname[participant_id],
              threadID,
              participant_id
            );
          } else {
            await threadsData.set(
              threadID,
              nickname,
              `data.antiChangeInfoBox.nickname.${participant_id}`
            );
          }
        };
        return handleNicknameChange();
      }
      case "log:thread-color": {
        if (!dataAntiChange.hasOwnProperty("theme")) {
          return;
        }
        const handleThemeChange = async () => {
          if (Role < 1 && api.getCurrentUserID() !== author) {
            Message.reply(
              "حماية تغيير الثيم مشغلة بالفعل في صندوق الدردشة الخاص بك"
            );
            api.changeThreadColor(
              dataAntiChange.theme || "196241301102133",
              threadID
            );
          } else {
            const threadThemeID = logMessageData.theme_id;
            await threadsData.set(threadID, threadThemeID, "data.antiChangeInfoBox.theme");
          }
        };
        return handleThemeChange();
      }
      case "log:thread-icon": {
        if (!dataAntiChange.hasOwnProperty("emoji")) {
          return;
        }
        const handleEmojiChange = async () => {
          if (Role < 1 && api.getCurrentUserID() !== author) {
            Message.reply(
              "حماية تغيير الإيموجي مشغلة بالفعل في صندوق الدردشة الخاص بك"
            );
            api.changeThreadEmoji(dataAntiChange.emoji, threadID);
          } else {
            const threadEmoji = logMessageData.thread_icon;
            await threadsData.set(threadID, threadEmoji, "data.antiChangeInfoBox.emoji");
          }
        };
        return handleEmojiChange();
      }
    }
  },
};
