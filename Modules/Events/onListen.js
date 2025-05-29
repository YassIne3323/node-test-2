const allOnEvent = global.Nero.onListen;

module.exports = {
	Nero: {
		name: "Listener",
    eventType: ["log:unsubscribe", "log:subscribe"],
		version: "1.1",
		Credits: "Nero",
		description: "",
	},

	Begin: async ({ api, Message, event, threadsData, usersData, Role }) => {
		try {
			for (const item of allOnEvent) {
				if (typeof item === "string") continue;
				item.onListen({ api, Message, event, threadsData, usersData, Role });
			}
		} catch (error) {
			
			console.error("An error occurred in Begin function:", error);
		}
	}
};