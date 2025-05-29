const fs = require("fs");
const path = require("path");

module.exports = {
	Nero: {
		name: "تايم",
		Aliases: ["upt", "uptime"],
		version: "1.0",
		credits: "Y-ANBU",
		Rest: 5,
		Role: 0,
		description: "",
		Class: "خدمات"
	},

	Begin: async ({ api, event }) => {
		function byte2mb(bytes) {
			const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			let l = 0, n = parseInt(bytes, 10) || 0;
			while (n >= 1024 && ++l) n = n / 1024;
			return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
		}

		const h = global.Mods.Anbunumbers;
    const y = (str) => h(str, 3);
		
		function getProjectSize(directory) {
			let totalSize = 0;
			let fileCount = 0;
			let folderCount = 0;

			function calculateSize(dir) {
				const files = fs.readdirSync(dir);
				for (const file of files) {
					const fullPath = path.join(dir, file);
					const stats = fs.statSync(fullPath);
					if (stats.isDirectory()) {
						folderCount++;
						calculateSize(fullPath);
					} else {
						fileCount++;
						totalSize += stats.size;
					}
				}
			}

			calculateSize(directory);
			return { totalSize, fileCount, folderCount };
		}

		const time = process.uptime(),
			days = Math.floor(time / (60 * 60 * 24)),
			hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60)),
			minutes = Math.floor((time % (60 * 60)) / 60),
			seconds = Math.floor(time % 60);

		const pidusage = require("pidusage");
		const usage = await pidusage(process.pid);
		const os = require("os");

		const cpuModel = os.cpus()[0].model;
		const projectInfo = getProjectSize(__dirname);
		const timeStart = Date.now();

		return api.sendMessage("", event.threadID, () =>
    api.sendMessage(
        `Version: ${y("4.0.4")}\nDeveloper: Y-ANBU\n\n── Time & Info ──\nTime: ${y(String(days))}d : ${y(String(hours))}h : ${y(String(minutes))}m : ${y(String(seconds))}s\nUsers: ${y(String(global.DB.allUserData.length))}\nGroups: ${y(String(global.DB.allThreadData.length))}\n\n── Resource Usage ──\nCPU: ${cpuModel}\nCPU Usage: ${y(usage.cpu.toFixed(1))}%\nRAM Usage: ${y(byte2mb(usage.memory))}\nPing: ${y(String(Date.now() - timeStart))}ms\n\n── Project Info ──\nProject Size: ${y(byte2mb(projectInfo.totalSize))}\nFiles: ${y(String(projectInfo.fileCount))} | Folders: ${y(String(projectInfo.folderCount))}`,
        event.threadID,
        event.messageID
    )
   );
	}
};