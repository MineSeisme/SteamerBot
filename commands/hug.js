const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  
  let rMember =  message.mentions.users.array();
  
  if(rMember == 0) return message.channel.send(`*hug ${message.author}*`);
  let mention = ``;
  
  message.mentions.users.forEach( (user) => {
    mention = mention + ` ${user}`;
  })
  
  message.channel.send(`*hug${mention}*`);
}

module.exports.help = {
    name: "hug"
}