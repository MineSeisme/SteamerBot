const Discord = require('discord.js');
const config = require("../config.json");
const fs = require("fs");

let cmdList = `\`\`\`AsciiDoc\n`;

fs.readdir("./commands", (err, files) => {

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    jsfile.forEach((f, i) => {
        let props = require(`../commands/${f}`);
        if(!config.hiddenCmds.includes(props.help.name)){
          
          if(config.cmdDescription[props.help.name]) cmdList = cmdList + `\`${config.prefix} ${props.help.name}\' ${config.cmdDescription[props.help.name]}\n`;
          else cmdList = cmdList + `\`${config.prefix} ${props.help.name}\'\n`;
        };
    });
  cmdList = cmdList + `\`\`\``;
});
console.log(cmdList);

module.exports.run = async (bot, message, args) => {
    
    console.log(cmdList);

    var embed = new Discord.RichEmbed()
        .setTitle("Liste des commandes :")
        .setDescription(cmdList)
        .setColor("#04B4AE")
    message.channel.send(embed);
}

module.exports.help = {
    name: `help`
}
