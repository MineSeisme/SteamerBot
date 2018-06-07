const Discord = require("discord.js");


module.exports.run = async (bot, message, args) => {

  if(!args[0]) return;

  let emoji = args[0].slice( 1 , args[0].length - 1);
  message.channel.send(emoji);
}

module.exports.help = {
  name: "emoji_id"
}