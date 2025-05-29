const fs = require("fs-extra");
const chalk = require('chalk');
const gradient = require('gradient-string');
const Settings = require('./Config/Settings.json');
const theme = Settings.DESIGN.Theme;
let cra;
let co;
let cb;
let cv;

async function main() {
  if (theme.toLowerCase() === 'blue') {
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("#243aff", "#4687f0", "#5800d4");
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#3467eb");
  } else if (theme.toLowerCase() === 'fiery') {
    cra = gradient('orange', 'orange', 'yellow');
    co = gradient("#fc2803", "#fc6f03", "#fcba03");
    cb = chalk.hex("#fff308");
    cv = chalk.bold.hex("#fc3205");
  } else if (theme.toLowerCase() === 'red') {
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("red", "orange");
    cb = chalk.hex("#ff0000");
    cv = chalk.bold.hex("#ff0000");
  } else if (theme.toLowerCase() === 'aqua') {
    cra = gradient("#6883f7", "#8b9ff7", "#b1bffc");
    co = gradient("#0030ff", "#4e6cf2");
    cb = chalk.hex("#3056ff");
    cv = chalk.bold.hex("#0332ff");
  } else if (theme.toLowerCase() === 'pink') {
    cra = gradient('purple', 'pink');
    co = gradient("#d94fff", "purple");
    cb = chalk.hex("#6a00e3");
    cv = chalk.bold.hex("#6a00e3");
  } else if (theme.toLowerCase() === 'retro') {
    cra = gradient("orange", "purple");
    co = gradient.retro;
    cb = chalk.hex("#ffce63");
    cv = chalk.bold.hex("#3c09ab");
  } else if (theme.toLowerCase() === 'sunlight') {
    cra = gradient("#f5bd31", "#f5e131");
    co = gradient("#ffff00", "#ffe600");
    cb = chalk.hex("#faf2ac");
    cv = chalk.bold.hex("#ffe600");
  } else if (theme.toLowerCase() === 'teen') {
    cra = gradient("#81fcf8", "#853858");
    co = gradient.teen;
    cb = chalk.hex("#a1d5f7");
    cv = chalk.bold.hex("#ad0042");
  } else if (theme.toLowerCase() === 'summer') {
    cra = gradient("#fcff4d", "#4de1ff");
    co = gradient.summer;
    cb = chalk.hex("#ffff00");
    cv = chalk.bold.hex("#fff700");
  } else if (theme.toLowerCase() === 'flower') {
    cra = gradient("yellow", "yellow", "#81ff6e");
    co = gradient.pastel;
    cb = gradient('#47ff00', "#47ff75");
    cv = chalk.bold.hex("#47ffbc");
  } else if (theme.toLowerCase() === 'ghost') {
    cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
    co = gradient.mind;
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#1390f0");
  } else if (theme === 'hacker') {
    cra = chalk.hex('#4be813');
    co = gradient('#47a127', '#0eed19', '#27f231');
    cb = chalk.hex("#22f013");
    cv = chalk.bold.hex("#0eed19");
  } else {
    cra = gradient('yellow', 'lime', 'green');
    co = gradient("#243aff", "#4687f0", "#5800d4");
    cb = chalk.blueBright;
    cv = chalk.bold.hex("#3467eb");
  }

  const { join, resolve, normalize } = require("path");
  const { NODE_ENV } = process.env;
  const logger = require("./Logger/Log.js");
  const login = require("./Control/Login");
  const { LoadScripts, LoadEvents } = require('./Logger/Scripts.js');
  const SettingsDir = normalize(`./Settings${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
  

  global.Nero = {
    commands: new Map(),
    Aliases: new Map(),
    onListen: new Array(),
    events: new Map(),
    onEvent: new Map(),
    Rest: new Map(),
    EvReg: new Array(),
    onSchedule: new Array(),
    onReaction: new Map(),
    onReply: new Map(),
    mainPath: process.cwd(),
    SettingsPath: new String(),
    SettingsDir,   
    Database: {
      creatingThreadData: [],
      creatingUserData: [],
      creatingDashBoardData: [],
      creatingGlobalData: []
    },
  };

  global.DB = {

    allThreadData: [],
    allUserData: [],
    allGlobalData: [],

    threadModel: null,
    userModel: null,
    globalModel: null,

    threadsData: null,
    usersData: null,
    globalData: null,

    receivedTheFirstMessage: {}
  };
  global.temp = {
    createThreadData: [],
    createUserData: [],
    createThreadDataError: [],
    filesOfGoogleDrive: {
      arraybuffer: {},
      stream: {},
      fileNames: {}
    },
    contentScripts: {
      cmds: {},
      events: {}
    }
  };

  global.Mods = require("./Control/Mods");

  global.loading = require("./Logger/Log.js");

  global.game = {};

  global.fff = [];

  global.nodemodule = {};

  global.Settings = {};

  global.SettingsModule = {};

  global.moduleData = [];

  global.language = {};

  var SettingsValue;
  try {
    global.Nero.SettingsPath = join(global.Nero.mainPath, "Config/Settings.json");
    SettingsValue = require(global.Nero.SettingsPath);
    logger.loader("Found Nero Settings file!");
  } catch (error) {
      return logger.loader('"Settings" file not found.', "error");
  }

  try {
    for (const key in SettingsValue) {
      global.Settings[key] = SettingsValue[key];
    }
    logger.loader("Settings Loaded!");
  } catch (error) {
    return logger.loader("Can't load file Settings!", "error");
  }

  try {
    var StateFile = resolve(join(global.Nero.mainPath, global.Settings.STATEPATH || "Config/State.json"));
    var appState = require(StateFile);
    logger.loader("Nero Logged In.");
  } catch (error) {
    return logger.loader("Nero Can't Log In.", "error");
  }

  console.log(cv(`\n` + `──FACEBOOK─●`));

  const loginData = {};
  loginData['appState'] = appState;
  if(appState.length === 0)  return logger("No AppState Found", `ERROR`);
  login(loginData, async (loginError, loginApiData) => {
    if (loginError) {
       logger(loginError, `ERROR`);
       return process.exit(0)
    }

    loginApiData.setOptions(global.Settings.Settings);
    global.Settings.version = '1.0.0';
    global.Nero.timeStart = new Date().getTime();
    LoadScripts(loginApiData);
    console.log(cv(`\n` + `──LOADING SCRIPTS─●`));

    LoadEvents(loginApiData);

    console.log(cv(`\n` + `──BOT START─● `));
    global.loading(`${cra(`[ LOADED ]`)} ${cb(`${global.Nero.commands.size}`)} Script and ${cb(`${global.Nero.events.size}`)} Events`, "LOADED");
    global.loading(`${cra(`[ TIMESTART ]`)} Launch time: ${((Date.now() - global.Nero.timeStart) / 1000).toFixed()}s`, "LOADED");


    const listenerData = {};
    const NeroDBFUNC = require('./Control/Data/controller/index.js');
    const connectMFDB = await NeroDBFUNC({ api: loginApiData });
    const {
      threadsData,
      usersData,
      globalData,
  
    } = connectMFDB;
    listenerData.api = loginApiData;
    listenerData.usersData = usersData;
    listenerData.threadsData = threadsData;
    listenerData.globalData = globalData;

    const listener = await require('./Control/Listen')(listenerData);
    function listenerCallback(error, message) {
      if (error) {
        return logger('❌Error in Listening ', JSON.stringify(error));
      }
      if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) {
        return;
      }

      return listener(message);
    }
    
    const restartListenMqtt = global.Settings.restartListenMqtt;
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    global.handleListen = loginApiData.listenMqtt(listenerCallback);
    global.Nero.api = loginApiData;
    if (restartListenMqtt.enable === true) {
      setInterval(async () => {
        console.log(cv("↻ Restarting MQTT listening..."));
        try {
          loginApiData.stopListenMqtt();
          await sleep(3000); 
          global.handleListen = global.Nero.api.listenMqtt(listenerCallback); 
        } catch (err) {
          logger(`Error restarting MQTT: ${err}`, "ERROR");
        }
      }, restartListenMqtt.timeRestart); 
    }
  });
}

main().catch(error => {
  console.error(error);
});

process.on('unhandledRejection', (err, p) => {
  console.error(err);
});
