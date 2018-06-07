const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "Tu n'as pas la permission de gérer les messages");
  if (!args[0] || args[0] >= 101 || args[0] < 1 || isNaN(args[0])) return message.channel.send("veuillez entrer un nombre de messages à supprimer entre 1 et 100!");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`:wastebasket: | ${args[0]} messages ont été supprimés, toujours un plaisir de travailler avec vous ${message.author.username}`).then(msg => msg.delete(5000));
  });
}

module.exports.help = {
  name: "clear"
}