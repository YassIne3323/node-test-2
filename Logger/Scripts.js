const { readdirSync } = require("fs-extra");
const chalk = require('chalk');
const gradient = require('gradient-string');
const con = require('./../Config/Settings.json');
const theme = con.DESIGN.Theme;

let cra, co, cb, cv;

switch (theme.toLowerCase()) {
  case 'blue':
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("#243aff", "#4687f0", "#5800d4");
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#3467eb");
    break;
  case 'fiery':
    cra = gradient('orange', 'orange', 'yellow');
    co = gradient("#fc2803", "#fc6f03", "#fcba03");
    cb = chalk.hex("#fff308");
    cv = chalk.bold.hex("#fc3205");
    break;
  case 'red':
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("red", "orange");
    cb = chalk.hex("#ff0000");
    cv = chalk.bold.hex("#ff0000");
    break;
  case 'aqua':
    cra = gradient("#6883f7", "#8b9ff7", "#b1bffc");
    co = gradient("#0030ff", "#4e6cf2");
    cb = chalk.hex("#3056ff");
    cv = chalk.bold.hex("#0332ff");
    break;
  case 'pink':
    cra = gradient('purple', 'pink');
    co = gradient("#d94fff", "purple");
    cb = chalk.hex("#6a00e3");
    cv = chalk.bold.hex("#6a00e3");
    break;
  case 'retro':
    cra = gradient("orange", "purple");
    co = gradient.retro;
    cb = chalk.hex("#ffce63");
    cv = chalk.bold.hex("#3c09ab");
    break;
  case 'sunlight':
    cra = gradient("#f5bd31", "#f5e131");
    co = gradient("#ffff00", "#ffe600");
    cb = chalk.hex("#faf2ac");
    cv = chalk.bold.hex("#ffe600");
    break;
  case 'teen':
    cra = gradient("#81fcf8", "#853858");
    co = gradient.teen;
    cb = chalk.hex("#a1d5f7");
    cv = chalk.bold.hex("#ad0042");
    break;
  case 'summer':
    cra = gradient("#fcff4d", "#4de1ff");
    co = gradient.summer;
    cb = chalk.hex("#ffff00");
    cv = chalk.bold.hex("#fff700");
    break;
  case 'flower':
    cra = gradient("yellow", "yellow", "#81ff6e");
    co = gradient.pastel;
    cb = gradient('#47ff00', "#47ff75");
    cv = chalk.bold.hex("#47ffbc");
    break;
  case 'ghost':
    cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
    co = gradient.mind;
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#1390f0");
    break;
  case 'hacker':
    cra = chalk.hex('#4be813');
    co = gradient('#47a127', '#0eed19', '#27f231');
    cb = chalk.hex("#22f013");
    cv = chalk.bold.hex("#0eed19");
    break;
  default:
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("#243aff", "#4687f0", "#5800d4");
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#3467eb");
}

function LoadScripts(loginApiData) {
  const listCommand = readdirSync(global.Nero.mainPath + '/Modules/Cmds').filter(command => command.endsWith('.js') && !command.includes('eg') && !global.Settings.ScriptUload.includes(command));

  for (const command of listCommand) {
    try {
      const module = require(global.Nero.mainPath + '/Modules/Cmds/' + command);
      if (!module.Nero || !module.Begin || !module.Nero.Class) throw new Error();
      if (global.Nero.commands.has(module.Nero.name || '')) throw new Error();

      if (module.Nero.Aliases) {
        let { Aliases } = module.Nero;
        if (typeof Aliases === "string") Aliases = [Aliases];

        for (const alias of Aliases) {
          if (typeof alias === "string" && !global.Nero.Aliases.has(alias)) {
            global.Nero.Aliases.set(alias, module.Nero.name);
          }
        }
      }

      if (module.Start) {
        try {
          const moduleData = { api: loginApiData };
          module.Start(moduleData);
        } catch (error) {
          global.loading(error, "❌Cmds");
        }
      }

      if (module.onEvent) {
        global.Nero.EvReg.push(module.Nero.name);
      }

      if (module.onRun) {
        global.Nero.onEvent.set(module.Nero.name, module);
      }

      global.Nero.commands.set(module.Nero.name, module);
    } catch (error) {
    }
  }
}

function LoadEvents(loginApiData) {
  const events = readdirSync(global.Nero.mainPath + '/Modules/Events').filter(event => event.endsWith('.js') && !global.Settings.EventUload.includes(event));
  const TheListCommand = readdirSync(global.Nero.mainPath + '/Modules/Cmds').filter(command => command.endsWith('.js'));
  const LengthH = TheListCommand.length;
  global.loading(`${cra(` LOADED`)} ${cb(`${global.Nero.commands.size}`)} Script from ${cb(`${LengthH}`)}`, "SCRIPTS");

  console.log(`${cv(`\n──LOADING EVENTS─●`)}`);
  for (const ev of events) {
    try {
      const event = require(global.Nero.mainPath + '/Modules/Events/' + ev);
      if (!event.Nero || !event.Begin) return;
      if (global.Nero.events.has(event.Nero.name)) return;

      if (event.Start) {
        try {
          const eventData = { api: loginApiData };
          event.Start(eventData);
        } catch (error) {
          global.loading(error, "❌Events");
        }
      }

      global.Nero.events.set(event.Nero.name, event);
      global.loading(`${cra(`LOADED`)} ${cb(event.Nero.name)} Success`, "EVENT");
    } catch (error) {
    }
  }
}


module.exports = { LoadScripts, LoadEvents };
