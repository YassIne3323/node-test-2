module.exports.Nero = {
  name: "نظام",
  Role: 3,
  credits: "𝐘-𝐀𝐍𝐁𝐔",
  Class: "المطور",
  description: "تشغيل أو إيقاف النظام",
  Rest: 0
};

module.exports.Begin = async ({ args, Message }) => {
  const action = args[0];

  if (!action || !["تشغيل", "ايقاف"].includes(action)) {
    return Message.reply("❗ استخدم: نظام [تشغيل/ايقاف]");
  }

  const requestedState = action === "تشغيل" ? false : true;
  if (global.Settings.AdminOnly === requestedState) {
    const alreadyMsg = action === "تشغيل"
      ? "🔁 | الـنـظـام بـالـفـعـل فـي حـالـة الـتـشـغـيـل"
      : "🔁 | الـنـظـام بـالـفـعـل فـي حـالـة الإيـقـاف";
    return Message.reply(alreadyMsg);
  }

  global.Settings.AdminOnly = requestedState;
  const response = action === "تشغيل"
    ? "✅ | تـم تـشـغـيـل الـنـظـام"
    : "❌ | تـم إيـقـاف تـشـغـيـل الـنـظـام";

  return Message.reply(response);
};
