const { join } = require("path");
const fs = require("fs-extra");

module.exports = {
  Nero: {
    name: "كمند",
    version: "1.0.0",
    Role: 3,
    Credits: "Nero",
    Class: "المطور",
    Resr: 5,
  },
  Begin: async function ({ args, Message, api }) {
    const allWhenChat = global.Nero.EvReg;

    const loadCmd = function (filename, api) {
      try {
        const pathCommand = join(__dirname, `${filename}.js`);
        if (!fs.existsSync(pathCommand))
          throw new Error(`ليس هناك امر بأسم ${filename}.js `);
        
        const oldCommand = require(pathCommand);
        const oldNameCommand = oldCommand.Nero.name;

        if (oldCommand.Nero.Aliases) {
          const oldShortName = Array.isArray(oldCommand.Nero.Aliases)
            ? oldCommand.Nero.Aliases
            : [oldCommand.Nero.Aliases];

          for (const aliases of oldShortName)
            global.Nero.Aliases.delete(aliases);
        }

        delete require.cache[require.resolve(pathCommand)];
        const command = require(pathCommand);
        const configCommand = command.Nero;
         const configCommand2 = command.Begin;

        if (!configCommand) throw new Error("خطأ في صياغة الامر");
         if (!configCommand2) throw new Error("خطأ في صياغة الامر");

        

        const nameScript = configCommand.name;
        const indexWhenChat = allWhenChat.findIndex((item) => item === oldNameCommand);

        if (indexWhenChat !== -1) {
          allWhenChat[indexWhenChat] = null;
        }

        if (command.onEvent) global.Nero.EvReg.push(command.Nero.name);
        global.Nero.commands.set(command.Nero.name, command);

        if (configCommand.Aliases) {
          const Aliases = Array.isArray(configCommand.Aliases)
            ? configCommand.Aliases
            : [configCommand.Aliases];

          for (const aliases of Aliases) {
            if (typeof aliases === "string") {
              if (global.Nero.Aliases.has(aliases)) {
                throw new Error(
                  ` الاسم المختصر ${aliases} موجود في اوامر اخري: ${global.Nero.Aliases.get(
                    aliases
                  )}`
                );
              } else {
                global.Nero.Aliases.set(aliases, configCommand.name);
              }
            }
          }
        }

        if (!command.Nero.name) throw new Error(`امر بدون اسم !`);

        if (command.Nero.envConfig) {
          const moduleName = command.Nero.name;
          global.SettingsModule[moduleName] = global.SettingsModule[moduleName] || {};
          global.Settings[moduleName] = global.Settings[moduleName] || {};
          const envConfig = command.Nero.envConfig;
          for (const envConfigKey in envConfig) {
            global.SettingsModule[moduleName][envConfigKey] =
              global.SettingsModule[moduleName][envConfigKey] || envConfig[envConfigKey];
            global.Settings[moduleName][envConfigKey] =
              global.Settings[moduleName][envConfigKey] || envConfig[envConfigKey];
          }
          global.Nero.SettingsPath[moduleName] = envConfig;
          fs.writeFileSync(
            global.Nero.SettingsPath,
            JSON.stringify(global.Nero.SettingsPath, null, 4),
            "utf-8"
          );
        }

        if (command.Start) {
          try {
            command.Start({ api });
          } catch (error) {
            const errorMessage = " خطاء في اوامر البداية.";
            throw new Error(errorMessage, "error");
          }
        }

        global.Nero.commands.delete(oldNameCommand);
        global.Nero.commands.set(nameScript, command);

        return {
          status: "success",
          name: filename,
        };
      } catch (err) {
        return {
          status: "failed",
          name: filename,
          error: err,
        };
      }
    };

    if (!args[0]) {
      return Message.reply("❌ | تحميل؟ او تحميل الكل؟");
    } else if (args[0] == "تحميل") {
      if (!args[1]) return Message.reply("❌ | اكتب اسم امر");
      const infoLoad = loadCmd(args[1], api);
      if (infoLoad.status == "success")
        Message.reply(`✅ | تم تحميل امر "${infoLoad.name}" بنجاح`);
      else
        Message.reply(
          `❌ | حدث خطاء ${infoLoad.name} الاخطاء\n${infoLoad.error.stack
            .split("\n")
            .filter((i) => i.length > 0)
            .slice(0, 5)
            .join("\n")}`
        );
      global.Nero.EvReg = allWhenChat.filter((item) => item !== null);
    } else if (args[0].toLowerCase() == "لود") {
      const allFile = fs
        .readdirSync(__dirname)
        .filter((item) => item.endsWith(".js"))
        .map((item) => item.split(".")[0]);
      const arraySuccess = [];
      const arrayFail = [];
      for (const name of allFile) {
        const infoLoad = loadCmd(name, api);
        infoLoad.status == "success"
          ? arraySuccess.push(name)
          : arrayFail.push(`${name}: ${infoLoad.error.name}: ${infoLoad.error.message}`);
      }
      global.Nero.EvReg = allWhenChat.filter((item) => item !== null);
      Message.reply(
        `✅ | تم تحميل ${arraySuccess.length} امر بنجاح` +
          `${arrayFail.length > 0 ? `\n❌ | اخطاء التحميل: ${arrayFail.length} امر \n${arrayFail.join("\n")}` : ""}`
      );
    }
  },
};