module.exports.Nero = {
	name: "معرف",
	version: "1.0.0", 
	Role: 0,
	credits: "Nero",
	description: "ايدي الجروب", 
	Class: "خدمات",
	usages: " ",
	Rest: 5, 
	dependencies: '',
};

module.exports.Begin = async function({ api, event }) {
  api.sendMessage(event.threadID, event.threadID);
};
