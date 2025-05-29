const crypto = require('crypto');
const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const mimeDB = require("mime-db");
const qs = require("qs");
const https = require("https");
const moment = require("moment-timezone")
const agent = new https.Agent({
	rejectUnauthorized: false
});
const ora = require("ora");
const log = require("../Logger/Log.js");

class CustomError extends Error {
	constructor(obj) {
		if (typeof obj === 'string')
			obj = { message: obj };
		if (typeof obj !== 'object' || obj === null)
			throw new TypeError('Object required');
		obj.message ? super(obj.message) : super();
		Object.assign(this, obj);
	}
}
function createQueue(callback) {
	const queue = [];
	const queueObj = {
		push: function (task) {
			queue.push(task);
			if (queue.length == 1)
				queueObj.next();
		},
		running: null,
		length: function () {
			return queue.length;
		},
		next: function () {
			if (queue.length > 0) {
				const task = queue[0];
				queueObj.running = task;
				callback(task, async function (err, result) {
					queueObj.running = null;
					queue.shift();
					queueObj.next();
				});
			}
		}
	};
  return queueObj;
}
const word = [
	'A', 'Á', 'À', 'Ả', 'Ã', 'Ạ', 'a', 'á', 'à', 'ả', 'ã', 'ạ',
	'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',
	'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
	'B', 'b',
	'C', 'c',
	'D', 'Đ', 'd', 'đ',
	'E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ',
	'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ',
	'F', 'f',
	'G', 'g',
	'H', 'h',
	'I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị', 'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị',
	'J', 'j',
	'K', 'k',
	'L', 'l',
	'M', 'm',
	'N', 'n',
	'O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ',
	'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
	'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ',
	'P', 'p',
	'Q', 'q',
	'R', 'r',
	'S', 's',
	'T', 't',
	'U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ',
	'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự',
	'V', 'v',
	'W', 'w',
	'X', 'x',
	'Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ',
	'Z', 'z',
	' '
];

function throwError(command, threadID, messageID) {
	return global.Nero.api.sendMessage(global.Settings.PREFIX, command, threadID, messageID);
}

function getPrefix(threadID) {
	if (!threadID || isNaN(threadID))
		throw new Error('The first argument (threadID) must be a number');
	threadID = String(threadID);
	let prefix = global.Settings.PREFIX;
	const threadData = global.DB.allThreadData.find(t => t.threadID == threadID);
	if (threadData)
		prefix = threadData.data.prefix || prefix;
	return prefix;
}

function cleanAnilistHTML(text) {
	text = text
		.replace('<br>', '\n')
		.replace(/<\/?(i|em)>/g, '*')
		.replace(/<\/?b>/g, '**')
		.replace(/~!|!~/g, '||')
		.replace("&amp;", "&")
		.replace("&lt;", "<")
		.replace("&gt;", ">")
		.replace("&quot;", '"')
		.replace("&#039;", "'");
	return text;
}
function getExtFromMimeType(mimeType = "") {
	return mimeDB[mimeType] ? (mimeDB[mimeType].extensions || [])[0] || "unknow" : "unknow";
}

const AES = {
	encrypt(cryptKey, crpytIv, plainData) {
		const encipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(crpytIv));
		let encrypted = encipher.update(plainData);
		encrypted = Buffer.concat([encrypted, encipher.final()]);
		return encrypted.toString('hex');
	},
	decrypt(cryptKey, cryptIv, encrypted) {
		encrypted = Buffer.from(encrypted, "hex");
		const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(cryptIv, 'binary'));
		let decrypted = decipher.update(encrypted);

		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return String(decrypted);
	},
	makeIv() {
		return Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16);
	}
};

function homeDir() {
	let returnHome, typeSystem;
	const home = process.env["HOME"];
	const user = process.env["LOGNAME"] || process.env["USER"] || process.env["LNAME"] || process.env["USERNAME"];

	switch (process.platform) {
		case "win32": {
			returnHome = process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
			typeSystem = "win32";
			break;
		}
		case "darwin": {
			returnHome = home || (user ? '/Users/' + user : null);
			typeSystem = "darwin";
			break;
		}
		case "linux": {
			returnHome = home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
			typeSystem = "linux";
			break;
		}
		default: {
			returnHome = home || null;
			typeSystem = "unknown";
			break;
		}
	}

	return [typeof os.homedir === 'function' ? os.homedir() : returnHome, typeSystem];
}

function convertTime(miliSeconds, replaceSeconds = "s", replaceMinutes = "m", replaceHours = "h", replaceDays = "d", replaceMonths = "M", replaceYears = "y", notShowZero = false) {
  if (typeof replaceSeconds == 'boolean') {
    notShowZero = replaceSeconds;
    replaceSeconds = "s";
  }
  const second = Math.floor(miliSeconds / 1000 % 60);
  const minute = Math.floor(miliSeconds / 1000 / 60 % 60);
  const hour = Math.floor(miliSeconds / 1000 / 60 / 60 % 24);
  const day = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 % 30);
  const month = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 % 12);
  const year = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 / 12);
  let formattedDate = '';

  const dateParts = [
    { value: year, replace: replaceYears },
    { value: month, replace: replaceMonths },
    { value: day, replace: replaceDays },
    { value: hour, replace: replaceHours },
    { value: minute, replace: replaceMinutes },
    { value: second, replace: replaceSeconds }
  ];

  for (let i = 0; i < dateParts.length; i++) {
    const datePart = dateParts[i];
    if (datePart.value)
      formattedDate += datePart.value + datePart.replace;
    else if (formattedDate != '')
      formattedDate += '00' + datePart.replace;
    else if (i == dateParts.length - 1)
      formattedDate += '0' + datePart.replace;
  }

  if (formattedDate == '')
    formattedDate = '0' + replaceSeconds;

  if (notShowZero)
    formattedDate = formattedDate.replace(/00\w+/g, '');

  return formattedDate;
}


function getExtFromUrl(url = "") {
  if (!url || typeof url !== "string")
    throw new Error('The first argument (url) must be a string');
  const reg = /(?<=https:\/\/cdn.fbsbx.com\/v\/.*?\/|https:\/\/video.xx.fbcdn.net\/v\/.*?\/|https:\/\/scontent.xx.fbcdn.net\/v\/.*?\/).*?(\/|\?)/g;
  const fileName = url.match(reg)[0].slice(0, -1);
  return fileName.slice(fileName.lastIndexOf(".") + 1);
}



function getTime(timestamps, format) {
  if (!format && typeof timestamps == 'string') {
    format = timestamps;
    timestamps = undefined;
  }
 
  return moment(timestamps).tz('Africa/Cairo').format(format);
}

function message(api, event) {
	async function sendMessageError(err) {
		if (typeof err === "object" && !err.stack)
			err = removeHomeDir(JSON.stringify(err, null, 2));
		else
			err = removeHomeDir(`${err.name || err.error}: ${err.message}`);
		return await api.sendMessage("error: " + err, event.threadID, event.messageID);
	}
	return {
		send: async (form, callback) => {
			try {
				return await api.sendMessage(form, event.threadID, callback);
			} catch (err) {
				if (JSON.stringify(err).includes('spam')) {
					throw err;
				}
				throw err; 
			}
		},
		reply: async (form, callback) => {
			try {
				return await api.sendMessage(form, event.threadID, callback, event.messageID);
			} catch (err) {
				if (JSON.stringify(err).includes('spam')) {
					throw err;
				}
				throw err; 
			}
		},
		str: async (T, U) => {
			let F;
			if (!U) {
				F = { attachment: await funcs.str(T) };
			} else {
				F = { body: T, attachment: await funcs.str(U) };
			}
			api.sendMessage(F, event.threadID, event.messageID);
		},
		unsend: async (messageID, callback) => await api.unsendMessage(messageID, callback),
		edit: async (from, callback = event.messageReply.messageID) => await api.editMessage(from, callback),
		react: async function (emoji) {
			try {
				return await new Promise((resolve, reject) => {
					api.setMessageReaction(emoji, event.messageID, (err, data) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					}, true);
				});
			} catch (err) {
				throw err;
			}
		},
		err: async (err) => await sendMessageError(err),
		error: async (err) => await sendMessageError(err)
	};
}



function randomString(max, onlyOnce = false, possible) {
  if (!max || isNaN(max))
    max = 10;
  let text = "";
  possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < max; i++) {
    let random = Math.floor(Math.random() * possible.length);
    if (onlyOnce) {
      while (text.includes(possible[random]))
        random = Math.floor(Math.random() * possible.length);
    }
    text += possible[random];
  }
  return text;
}

async function downloadFile(url = "", path = "") {
  if (!url || typeof url !== "string")
    throw new Error(`The first argument (url) must be a string`);
  if (!path || typeof path !== "string")
    throw new Error(`The second argument (path) must be a string`);
  const getFile = await axios.get(url, {
    responseType: "arraybuffer"
  });
  fs.writeFileSync(path, Buffer.from(getFile.data));
  return path;
}


async function getStreamsFromAttachment(attachments) {
  const streams = [];
  for (const attachment of attachments) {
    const url = attachment.url;
    const ext = Mods.getExtFromUrl(url);
    const fileName = `${Mods.randomString(10)}.${ext}`;
    streams.push({
      pending: axios({
        url,
        method: "GET",
        responseType: "stream"
      }),
      fileName
    });
  }
  for (let i = 0; i < streams.length; i++) {
    const stream = await streams[i].pending;
    stream.data.path = streams[i].fileName;
    streams[i] = stream.data;
  }
  return streams;
}


async function getStreamFromURL(url = "", pathName = "", options = {}) {
	if (!options && typeof pathName === "object") {
		options = pathName;
		pathName = "";
	}
	try {
		if (!url || typeof url !== "string")
			throw new Error(`The first argument (url) must be a string`);
		const response = await axios({
			url,
			method: "GET",
			responseType: "stream",
			...options
		});
		if (!pathName)
			pathName = Mods.randomString(10) + (response.headers["content-type"] ? '.' + Mods.getExtFromMimeType(response.headers["content-type"]) : ".noext");
		response.data.path = pathName;
		return response.data;
	}
	catch (err) {
		throw err;
	}
}


async function translate(text, lang) {
	if (typeof text !== "string")
		throw new Error(`The first argument (text) must be a string`);
	if (!lang)
		lang = 'en';
	if (typeof lang !== "string")
		throw new Error(`The second argument (lang) must be a string`);
	const wordTranslate = [''];
	const wordNoTranslate = [''];
	const wordTransAfter = [];
	let lastPosition = 'wordTranslate';

	if (word.indexOf(text.charAt(0)) == -1)
		wordTranslate.push('');
	else
		wordNoTranslate.splice(0, 1);

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (word.indexOf(char) !== -1) { // is word
			const lengWordNoTranslate = wordNoTranslate.length - 1;
			if (wordNoTranslate[lengWordNoTranslate] && wordNoTranslate[lengWordNoTranslate].includes('{') && !wordNoTranslate[lengWordNoTranslate].includes('}')) {
				wordNoTranslate[lengWordNoTranslate] += char;
				continue;
			}
			const lengWordTranslate = wordTranslate.length - 1;
			if (lastPosition == 'wordTranslate') {
				wordTranslate[lengWordTranslate] += char;
			}
			else {
				wordTranslate.push(char);
				lastPosition = 'wordTranslate';
			}
		}
		else { // is no word
			const lengWordNoTranslate = wordNoTranslate.length - 1;
			const twoWordLast = wordNoTranslate[lengWordNoTranslate]?.slice(-2) || '';
			if (lastPosition == 'wordNoTranslate') {
				if (twoWordLast == '}}') {
					wordTranslate.push("");
					wordNoTranslate.push(char);
				}
				else
					wordNoTranslate[lengWordNoTranslate] += char;
			}
			else {
				wordNoTranslate.push(char);
				lastPosition = 'wordNoTranslate';
			}
		}
	}

	for (let i = 0; i < wordTranslate.length; i++) {
		const text = wordTranslate[i];
		if (!text.match(/[^\s]+/))
			wordTransAfter.push(text);
		else
			wordTransAfter.push(Mods.translateAPI(text, lang));
	}

	let output = '';

	for (let i = 0; i < wordTransAfter.length; i++) {
		let wordTrans = (await wordTransAfter[i]);
		if (wordTrans.trim().length === 0) {
			output += wordTrans;
			if (wordNoTranslate[i] != undefined)
				output += wordNoTranslate[i];
			continue;
		}

		wordTrans = wordTrans.trim();
		const numberStartSpace = lengthWhiteSpacesStartLine(wordTranslate[i]);
		const numberEndSpace = lengthWhiteSpacesEndLine(wordTranslate[i]);

		wordTrans = ' '.repeat(numberStartSpace) + wordTrans.trim() + ' '.repeat(numberEndSpace);

		output += wordTrans;
		if (wordNoTranslate[i] != undefined)
			output += wordNoTranslate[i];
	}
	return output;
}

async function uploadImgbb({ file, type = 'file' }) {
  try {
    const res_ = await axios({
      method: 'GET',
      url: 'https://imgbb.com'
    });

    const auth_token = res_.data.match(/auth_token="([^"]+)"/)[1];
    const timestamp = Date.now();

    const res = await axios({
      method: 'POST',
      url: 'https://imgbb.com/json',
      headers: {
        "content-type": "multipart/form-data;",
      },
      data: {
        source: file,
        type: type,
        action: 'upload',
        timestamp: timestamp,
        auth_token: auth_token
      }
    });

    return res.data;
  } catch (err) {
    let error;
    if (err.response) {
      error = new Error();
      Object.assign(error, err.response.data);
    } else
      error = new Error(err.message);

    throw error;
  }
}
async function shortenURL(url) {
	try {
		const result = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
		return result.data;
	}
	catch (err) {
		let error;
		if (err.response) {
			error = new Error();
			Object.assign(error, err.response.data);
		}
		else
			error = new Error(err.message);
	}
}
async function findUid(link) {
	const response = await axios.post("https://id.traodoisub.com/api.php", qs.stringify({ link }));
	const uid = response.data.id;
	if (!uid) {
		const err = new Error(response.data.error);
		for (const key in response.data)
			err[key] = response.data[key];
		if (err.error == "Vui lòng thao tác chậm lại") {
			err.name = "SlowDown";
			err.error = "Please wait a few seconds";
		}
		else if (err.error == "Vui lòng nhập đúng link facebook") {
			err.name = "InvalidLink";
			err.error = "Please enter the correct facebook link";
		}
		else if (err.error == "Không thể lấy được dữ liệu vui lòng báo admin!!!") {
			err.name = "CannotGetData";
			err.error = "Unable to get data, please report to admin!!!";
		}
		else if (err.error == "Link không tồn tại hoặc chưa để chế độ công khai!") {
			err.name = "LinkNotExist";
			err.error = "Link does not exist or is not set to public!";
		}
		throw err;
	}
	return uid;
}
function randomNumber(min, max) {
	if (!max) {
		max = min;
		min = 0;
	}
	if (min == null || min == undefined || isNaN(min))
		throw new Error('The first argument (min) must be a number');
	if (max == null || max == undefined || isNaN(max))
		throw new Error('The second argument (max) must be a number');
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeHomeDir(fullPath) {
	if (!fullPath || typeof fullPath !== "string")
		throw new Error('The first argument (fullPath) must be a string');
	while (fullPath.includes(process.cwd()))
		fullPath = fullPath.replace(process.cwd(), "");
	return fullPath;
}

function splitPage(arr, limit) {
	const allPage = _.chunk(arr, limit);
	return {
		totalPage: allPage.length,
		allPage
	};
}

function translateAPI(text, lang) {
	return new Promise((resolve, reject) => {
		axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
			.then(res => {
				resolve(res.data[0][0][0]);
			})
			.catch(err => {
				reject(err);
			});
	});
}
async function share(stream) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://api.zippysha.re/upload',
      httpsAgent: agent,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        file: stream
      }
    });

    const fullUrl = res.data.data.file.url.full;
    const res_ = await axios({
      method: 'GET',
      url: fullUrl,
      httpsAgent: agent,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43"
      }
    });

    const downloadUrl = res_.data.match(/id="download-url"(?:.|\n)*?href="(.+?)"/)[1];
    res.data.data.file.url.download = downloadUrl;

    return downloadUrl;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while sharing the file.");
  }
}

function Anbunumbers(str, styleNumber) {
	const styles = {
			1: {
					'0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
			},
			2: {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
			},
			3: {
					'0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
			}
	};

	const fancyNumbers = styles[styleNumber] || styles[1];
	return str.split('').map(char => fancyNumbers[char] || char).join('');
}


const Mods = {
  convertTime,
  createQueue,
  CustomError,
  getExtFromMimeType,
  splitPage,
  translateAPI,
  removeHomeDir,
  randomNumber,
  findUid,
  share,
  translate,
  cleanAnilistHTML,
  randomString,
  getExtFromUrl,
  getPrefix,
  getTime,
  log,
  message,
  downloadFile,
  getStreamsFromAttachment,
  getStreamFromURL,
  uploadImgbb,
  throwError,
  AES,
  shortenURL,
	Anbunumbers,
	str: getStreamFromURL,
	trgm: translateAPI,
	imgd:getStreamFromURL,
  homeDir
};

module.exports = Mods;
  