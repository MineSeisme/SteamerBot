const Discord = require("discord.js");


module.exports.run = async (bot, message, args) => {

  let botmessage = args.join(" ");
  message.reply(botmessage);
}

module.exports.help = {
  name: "dis"
}
