const { graphQlQueryToJson } = require("graphql-query-to-json");
const ora = require("ora");
const { log } = global.Mods;

const  config  = global.Settings; 
const databaseType = config.DATABASE.type;


function fakeGraphql(query, data, obj = {}) {
	if (typeof query != "string" && typeof query != "object")
		throw new Error(`The "query" argument must be of type string or object, got ${typeof query}`);
	if (query == "{}" || !data)
		return data;
	if (typeof query == "string")
		query = graphQlQueryToJson(query).query;
	const keys = query ? Object.keys(query) : [];
	for (const key of keys) {
		if (typeof query[key] === 'object') {
			if (!Array.isArray(data[key]))
				obj[key] = data.hasOwnProperty(key) ? fakeGraphql(query[key], data[key] || {}, obj[key]) : null;
			else
				obj[key] = data.hasOwnProperty(key) ? data[key].map(item => fakeGraphql(query[key], item, {})) : null;
		}
		else
			obj[key] = data.hasOwnProperty(key) ? data[key] : null;
	}
	return obj;

}

module.exports = async function ({api}) {
	var threadModel, userModel, globalModel, sequelize = null;
	switch (databaseType) {
		case "mongodb": {
			const spin = ora({
				text: "Connecting a MONGODB database",
				spinner: {
					interval: 80,
					frames: [
						'⠋', '⠙', '⠹',
						'⠸', '⠼', '⠴',
						'⠦', '⠧', '⠇',
						'⠏'
					]
				}
			});
			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };
			spin.start();
			try {
				var { threadModel, userModel, globalModel } = await require("../connectDB/connectMongoDB.js")(config.DATABASE.uriMongodb);
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				global.loading("MONGODB","Successfully connected mongodb database!");
			}
			catch (err) {
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.err(`An error occurred when connecting the Mongodb database: ${err.message}`, "MONGODB");
				process.exit();
			}
			break;
		}
		case "sqlite": {
			const spin = ora({
				text: "Connecting DataBase",
				spinner: {
					interval: 80,
					frames: [
						'⠋', '⠙', '⠹',
						'⠸', '⠼', '⠴',
						'⠦', '⠧', '⠇',
						'⠏'
					]
				}
			});
			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };
			spin.start();
      
			try {
				var { threadModel, userModel, globalModel, sequelize } = await require("../connectDB/connectSqlite.js")();
				process.stderr.clearLine = defaultClearLine;
				spin.stop();
				global.loading("Connected With SQLite!", "SQLITE");
        
			}
			catch (err) {
				process.stderr.clearLine = defaultClearLine;
				spin.stop();
			global.loading(`An error occurred while connecting to a SQLITE database: ${err.message}` , "SQLITE");
        
				process.exit();
			}
			break;
		}
		default:
			break;
	}

	const threadsData = await require("./threadsData.js")(databaseType, threadModel, api, fakeGraphql);
	const usersData = await require("./usersData.js")(databaseType, userModel, api, fakeGraphql);
	
	const globalData = await require("./globalData.js")(databaseType, globalModel, fakeGraphql);

	global.DB = {
		...global.DB,
		threadModel,
		userModel,
		globalModel,
		threadsData,
		usersData,
		globalData,
		sequelize
	};

	return {
		threadModel,
		userModel,
		globalModel,
		threadsData,
		usersData,
		globalData,
		sequelize,
		databaseType
	};
};