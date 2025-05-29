const { removeHomeDir } = global.Mods;

module.exports = {
  Nero: {
    name: "تجربة",
    Aliases: ["eval"],
    version: "1.4",
    author: "Nero",
    Rest: 5,
    Role: 3,
    description: "",
    Class: "المطور"
  },

  Begin: async function({ api, event, args, Message, threadsData, usersData, getLang }) {
    function output(msg) {
      if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
        msg = msg.toString();
      else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      } else if (typeof msg == "object")
        msg = JSON.stringify(msg, null, 2);
      else if (typeof msg == "undefined")
        msg = "undefined";

      Message.reply(msg);
    }

    function out(msg) {
      output(msg);
    }

    function mapToObj(map) {
      const obj = {};
      map.forEach(function(v, k) {
        obj[k] = v;
      });
      return obj;
    }

    if (args.length === 0) {
      Message.reply("❌ اكتب شيئا.");
      return;
    }

    try {
      const cmd = `
        (async () => {
          try {
            ${args.join(" ")}
          } catch (err) {
            Message.reply(
              "❌ An error occurred:\\n" +
                (err.stack
                  ? removeHomeDir(err.stack)
                  : removeHomeDir(JSON.stringify(err, null, 2)))
            );
          }
        })()`;
      eval(cmd);
    } catch (error) {
      Message.reply(`❌ Error : ${error}`);
      
    }
  }
};