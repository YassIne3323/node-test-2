async function Handle({ api, usersData, threadsData, globalData }) {
const Messages = global.Mods.message;

        /*
        +------------------------------------------------+
        |                    DataBase                    |
        +------------------------------------------------+
        */

async function DataBase({ event }) {
      const { DB, Settings } = global;
      const  config  = Settings;
      const log = global.loading;
      const { creatingThreadData, creatingUserData } = global.Nero.Database;
            const { threadID, isGroup } = event;
            const senderID = event.senderID || event.author || event.userID;

            // Check Thread Data
            if (threadID && isGroup && !DB.allThreadData.some(t => t.threadID === threadID)) {
              try {
                if (global.temp.createThreadDataError.includes(threadID)) {
                  return;
                }

                const findInCreatingThreadData = creatingThreadData.find(t => t.threadID === threadID);
                if (!findInCreatingThreadData) {
                  const threadData = await threadsData.create(threadID);
             const Uc = config.DATABASE.type.substring(0, 3).toUpperCase();
        const Mc = config.DATABASE.type.replace(config.DATABASE.type.substring(0, 3), Uc);

        log(`New Thread: ${threadID} | ${threadData.threadName} | ${Mc}`, "DATABASE");
                } else {
                  await findInCreatingThreadData.promise;
                }
              } catch (err) {
                global.temp.createThreadDataError.push(threadID);
                 console.log(err);
              }
            }

            // Check User Data
            if (senderID && !DB.allUserData.some(u => u.userID === senderID)) {
              try {
                const findInCreatingUserData = creatingUserData.find(u => u.userID === senderID);
                if (!findInCreatingUserData) {
                  const userData = await usersData.create(senderID);
                  log(`New User: ${senderID} | ${userData.name} | ${config.DATABASE.type}`, "DATABASE");
                } else {
                  await findInCreatingUserData.promise;
                }
              } catch (err) {
                console.log(err);
              }
            }
          };


        /*
         +------------------------------------------------+
         |                   onActions                    |
         +------------------------------------------------+
        */ 

  async function onActions({ event }) {
            try {
              const Message = Messages(api, event);
              const { onEvent } = global.Nero;
              const { senderID, threadID } = event;
              const threadData = await threadsData.get(event.threadID);
              const { ADMINBOT, SUPPORT } = global.Settings;
              const senderIDStr = String(senderID);

              let adbox = await threadsData.get(threadID, "settings.adbox");


              if (!adbox) {
                await threadsData.set(event.threadID, false, "settings.adbox");
                adbox = await threadsData.get(threadID, "settings.adbox");

              }


              if (!Settings.ADMINBOT.includes(senderID) && !Settings.MAD.includes(senderID) && event.isGroup && !threadData.adminIDs.includes(senderID)) {
                if (adbox === true) {
                  return;
                }
              }

              if (!Settings.ADMINBOT.includes(senderID) && !Settings.MAD.includes(senderID)) {
                if (Settings.AdminOnly) {
                  return;
                }
              }

              for (const [key, value] of onEvent.entries()) {
                const Run = onEvent.get(key);
                let permission = 0;

                if (SUPPORT.includes(senderIDStr)) {
                  permission = 2;
                } else if (ADMINBOT.includes(senderIDStr)) {
                  permission = 3;
                } else if (threadData.adminIDs.includes(senderIDStr)) {
                  permission = 1;
                }

                let getLang;

                if (
                  Run &&
                  Run.languages &&
                  typeof Run.languages === 'object' &&
                  Run.languages.hasOwnProperty(global.Settings.Lang)
                ) {
                  getLang = (...values) => {
                    let lang = Run.languages[global.Settings.Lang][values[0]] || '';
                    for (let i = values.length - 1; i > 0; i--) {
                      const expReg = RegExp('%' + i, 'g');
                      lang = lang.replace(expReg, values[i]);
                    }
                    return lang;
                  };
                } else {
                  getLang = () => {};
                }

                try {
                  const ExeSettings = {
                    api,
                    Message,
                    usersData,
                    Role: permission,
                    getLang,
                    threadsData,
                    event,
                  };
                  const func = await Run.onRun(ExeSettings);
                  if (typeof func === 'function') {
                    const innerFunction = func();
                    if (typeof innerFunction === 'function') {
                      await innerFunction();
                    }
                  }
                } catch (error) {
                  await global.loading(error, '❌ onActions:');
                }
              }
            } catch (error) {
              await global.loading(error, '❌ onActions:');
            }
          };

        /* 
         +------------------------------------------------+
         |                    onChat                      |
         +------------------------------------------------+
        */

  async function onChat({ event }) {
          try {
            const Message = Messages(api, event);
            const dateNow = Date.now();
            const { commands } = global.Nero;
            const { body, senderID, threadID, isGroup } = event;
            const senderIDStr = String(senderID);
            const userData = await usersData.get(senderID);
            const threadData = await threadsData.get(threadID);
            const { ADMINBOT, SUPPORT, AdminOnly, GcAdminOnly } = global.Settings;
            let adbox = await threadsData.get(threadID, "settings.adbox");


            if (!adbox) {
              await threadsData.set(event.threadID, false, "settings.adbox");
              adbox = await threadsData.get(threadID, "settings.adbox");

            }


            if (!Settings.ADMINBOT.includes(senderID) && !Settings.MAD.includes(senderID) && event.isGroup && !threadData.adminIDs.includes(senderID)) {
              if (adbox === true) {
                return;
              }
            }

            if (!Settings.ADMINBOT.includes(senderID) && !Settings.MAD.includes(senderID)) {
              if (Settings.AdminOnly) {
                return;
              }
            }
             let prefix = global.Mods.getPrefix(event.threadID);
            if (!body) {
              return;
            }

            if (!body.startsWith(prefix)) {
              return;
            }

            const [matchedPrefix] = body.match(prefix);
            const args = body.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = commands.get(commandName) || commands.get(global.Nero.Aliases.get(commandName));

            if (!command) {
              return;
            }
             if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID) && (userData.banned.status || threadData.banned.status)) {
              return;
            }

            if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID)) {
              if (AdminOnly && GcAdminOnly) {
                return Message.reply('البوت متاح فقط لادمن البوت أو المجموعة');
              } else if (AdminOnly) {
                return Message.reply('البوت متاح فقط لادمن البوت');
              } 
            }

            if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID) && isGroup && !threadData.adminIDs.includes(senderID)) {
              if (GcAdminOnly) {
                return Message.reply('البوت متاح فقط لالمجموعة');
              }
            }





            var permssion = 0;

            if (SUPPORT.includes(senderIDStr)) {
              permssion = 2;
            } else if (ADMINBOT.includes(senderIDStr)) {
              permssion = 3;
            } else if (threadData.adminIDs.includes(senderIDStr)) {
              permssion = 1;
            }

            if (command.Nero.Role > permssion) {
              return Message.reply("ليس لديك الاذن");
            }

            if (!global.Nero.Rest.has(command.Nero.name)) {
              global.Nero.Rest.set(command.Nero.name, new Map());
            }

            const timestamps = global.Nero.Rest.get(command.Nero.name);
            const expirationTime = (command.Nero.Rest || 1) * 1000;

            if (timestamps.has(senderIDStr) && dateNow < timestamps.get(senderIDStr) + expirationTime) {
              return Message.react('⏳');
            }

            let getLang;

            if (command.languages && typeof command.languages === 'object' && command.languages.hasOwnProperty(global.Settings.Lang)) {
              getLang = (...values) => {
                let lang = command.languages[global.Settings.Lang][values[0]] || '';
                for (let i = values.length - 1; i > 0; i--) {
                  const expReg = RegExp('%' + i, 'g');
                  lang = lang.replace(expReg, values[i]);
                }
                return lang;
              };
            } else {
              getLang = () => {};
            }

            try {
              const ExSettings = {
                api,
                Message,
                usersData,
                Role: permssion,
                threadsData,
                globalData,
                event,
                args,
                getLang,
              };
              command.Begin(ExSettings);
              timestamps.set(senderIDStr, dateNow);

              return;
            } catch (e) {
              await global.loading(e, "❌ onChat:");
            }
          } catch (err) {
            await global.loading(err, "❌ onChat:");
          }
        };

        /*
         +------------------------------------------------+
         |                    onEvent                     |
         +------------------------------------------------+
        */

  async function onEvent({ event }) {
          const Message = Messages(api, event);
          const threadData =  await threadsData.get(event.threadID);

          const { ADMINBOT, SUPPORT } = global.Settings;

          const { commands, EvReg } = global.Nero;
          const { senderID } = event;
          const senderIDStr= String(senderID);

            var permssion = 0;

          if (SUPPORT.includes(senderIDStr)) {
            permssion = 2;
          } else if (ADMINBOT.includes(senderIDStr)) {
            permssion = 3;
          } else if (threadData.adminIDs.includes(senderIDStr)) {
            permssion = 1;
          }

          for (const eventReg of EvReg) {
            const cmd = commands.get(eventReg);
            let getText2;

            if (cmd.languages && typeof cmd.languages === 'object') {
              getText2 = (...values) => {
                const commandModule = cmd.languages || {};
                if (!commandModule.hasOwnProperty(global.Settings.Lang)) {
                  return Message.reply(
                    global.getText('onChat', 'notFoundLanguage', cmd.Nero.name)
                  );
                }
                let lang = cmd.languages[global.Settings.Lang][values[0]] || '';
                for (let i = values.length - 1; i > 0; i--) {
                  const expReg = RegExp('%' + i, 'g');
                  lang = lang.replace(expReg, values[i]);
                }
                return lang;
              };
            } else {
              getText2 = () => {};
            }

            try {
              const ExSettings = {
                event,
                api,
                Message,
                role: permssion,
                usersData,
                threadsData,
                globalData,
                getLang: getText2,
              };

              if (cmd) {
                cmd.onEvent(ExSettings);
              }
            } catch (error) {
              global.loading(error, "❌ onEvents:"); 
            }
          }
        };

        /*
         +------------------------------------------------+
         |                    onEvents                    |
         +------------------------------------------------+
        */

  async function onEvents({ event }) { 
          try {
            const Message = Messages(api, event);
            const { events } = global.Nero;
            var { senderID, threadID } = event;
              const threadData = await threadsData.get(threadID);
            const { ADMINBOT, SUPPORT } = global.Settings;
            const senderIDStr = String(senderID);

            var permssion = 0;

            if (SUPPORT.includes(senderIDStr)) {
              permssion = 2;
            } else if (ADMINBOT.includes(senderIDStr)) {
              permssion = 3;
            } else if (threadData.adminIDs.includes(senderIDStr)) {
              permssion = 1;
            }

            for (const [key, value] of events.entries()) {
              if (value.Nero.eventType.indexOf(event.logMessageType) !== -1) {

                const eventRun = events.get(key);
                try {
                  const ExeSettings = {
                    api,
                    Message,
                    usersData,
                    threadsData,
                    Role: permssion,
                    event,
                  };
                  await eventRun.Begin(ExeSettings); 
                } catch (error) {
                  await global.loading(error, "❌ onEvent:"); 
                }
              }
            }
          } catch (error) {
            await global.loading(error, "❌ onEvent:"); 
          }
        };

        /*
         +------------------------------------------------+
         |                    onReaction                  |
         +------------------------------------------------+
        */
  async function onReaction({ event }) {
          try {
            const { onReaction, commands } = global.Nero;
            const { messageID, threadID } = event;

            if (onReaction.has(messageID)) {
              const Message = Messages(api, event);
              const indexOfMessage = onReaction.get(messageID);
              const handleNeedExec = commands.get(indexOfMessage.name);

              if (!handleNeedExec) return console.log('Missing Value to respond');

              var getLang;
              if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') {
                getLang = (...values) => {
                  const react = handleNeedExec.languages || {};
                  if (!react.hasOwnProperty(global.Settings.Lang))
                    return console.log('Missing Lang Key');
                  var lang = handleNeedExec.languages[global.Settings.Lang][values[0]] || '';
                  for (let i = values.length - 1; i > 0; i--) {
                    const expReg = RegExp('%' + i, 'g');
                    lang = lang.replace(expReg, values[i]);
                  }
                  return lang;
                };
              } else {
                getLang = () => {};
              }

              try {
                const ExSettings = {
                  api,
                  Message,
                  usersData,
                  threadsData,
                  event,
                  onReaction: indexOfMessage,
                  getLang,
                };
                handleNeedExec.onReaction(ExSettings);
                return;
              } catch (error) {
                await global.loading(error, "❌ onReaction:");
              }
            }
          } catch (err) {
            await global.loading(err, "❌ onReaction:");
          }
        };

        /*
        +------------------------------------------------+
        |                    onReply                     |
        +------------------------------------------------+
        */

  async function onReply({ event }) {
          try {
            if (!event.messageReply) return;
            const Message = Messages(api, event);
            const { onReply, commands } = global.Nero;
            const { messageID, threadID, messageReply, isGroup, senderID } = event;
            const userData = await usersData.get(senderID);
            const threadData = await threadsData.get(threadID);
            const { ADMINBOT, SUPPORT, AdminOnly, GcAdminOnly } = global.Settings;

            if (onReply.size !== 0) {
              if (!onReply.has(messageReply.messageID)) return;

              if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID) && (userData.banned.status || threadData.banned.status)) {
                return;
              }

              if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID)) {
                if (AdminOnly && GcAdminOnly) {
                  return Message.reply('البوت متاح فقط لادمن البوت أو المجموعة');
                } else if (AdminOnly) {
                  return Message.reply('البوت متاح فقط لادمن البوت');
                }
              }

              if (!ADMINBOT.includes(senderID) && !SUPPORT.includes(senderID) && isGroup && !threadData.adminIDs.includes(senderID)) {
                if (GcAdminOnly) {
                  return Message.reply('البوت متاح فقط لالمجموعة');
                }
              }


              const indexOfMessage = await onReply.get(messageReply.messageID);

              if (!commands.has(indexOfMessage.name)) return console.log('Missing Value to respond');

              const handleNeedExec = await commands.get(indexOfMessage.name);

              try {
                var getLang;

                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') {
                  getLang = (...value) => {
                    const reply = handleNeedExec.languages || {};

                    if (!reply.hasOwnProperty(global.Settings.Lang)) {
                      return console.log('Missing Lang Key');
                    }

                    let lang = handleNeedExec.languages[global.Settings.Lang][value[0]] || '';
                    for (let i = value.length - 1; i > 0; i--) {
                      const expReg = RegExp('%' + i, 'g');
                      lang = lang.replace(expReg, value[i]);
                    }

                    return lang;
                  };
                } else {
                  getLang = () => {};
                }

                const ExSettings = {
                  api,
                  event,
                  Message,
                  globalData,
                  usersData,
                  threadsData,
                  onReply: indexOfMessage,
                  getLang
                };

                await handleNeedExec.onReply(ExSettings);
                return;
              } catch (error) {
                await global.loading(error, "❌ onReply:");
              }
            }
          } catch (error) {
            await global.loading(error, "❌ onReply:");
          }
        };

return { DataBase, onActions, onChat, onEvent, onEvents, onReaction, onReply };
}

module.exports = Handle;