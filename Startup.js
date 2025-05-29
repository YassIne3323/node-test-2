const { spawn } = require("child_process");
const logger = require("./Logger/Log");
const { log } = require('./Logger/Log.js')
const express = require('express');
const app = express();

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hi my name is Nero ♡!..');
});
log(`
███╗  ██╗  ███████╗  ██████╗    █████╗ 
████╗ ██║  ██╔════╝  ██╔══██╗  ██╔══██╗
██╔██╗██║  █████╗    ██████╔╝  ██║  ██║
██║╚████║  ██╔══╝    ██╔══██╗  ██║  ██║
██║ ╚███║  ███████╗  ██║  ██║  ╚█████╔╝
╚═╝  ╚══╝  ╚══════╝  ╚═╝  ╚═╝   ╚════╝ `)
console.log("\n")
 logger(`Getting Started!`, "STARTER");
app.listen(PORT, () => {
    logger.loader(`Hi I'm Nero..♡`);
});

function Nero(message) {
 
  if (message) {
    logger(message, "[ Starting ]");
  }

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Nero.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (codeExit) => {
    if (codeExit !== 0 || (global.countRestart && global.countRestart < 5)) {
      Nero("Restarting...");
      global.countRestart += 1;
      return;
    } else {
      return;
    }
  });

  child.on("error", (error) => {
    logger(`An error occurred: ${JSON.stringify(error)}`, "START");
  });
}

Nero();
