const Discord = require('discord.js');
const config = require("../config.json");
const fs = require("fs");

let cmdList = ``

fs.readdir("./commands", (err, files) => {

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    jsfile.forEach((f, i) => {
        let props = require(`../commands/${f}`);
        if(!config.hiddenCmds.includes(props.help.name)) cmdList = cmdList + `${config.prefix} ${props.help.name}\n`;
    });
});

module.exports.run = async (bot, message, args) => {

    var embed = new Discord.RichEmbed()
        .setTitle("Liste des commandes :")
        .setDescription(cmdList)
        .setColor("#04B4AE")
    message.channel.send(embed);
}

module.exports.help = {
    name: `help`
}
