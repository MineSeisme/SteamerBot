const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {

    let rMember =  message.guild.member(message.mentions.users.first()) || message.author;
    let content = args.slice(1).join(" ");
    
    if(args[0]) args[0] = args[0].toLowerCase();

    if (message.member.hasPermission("MANAGE_MESSAGES") && args[0] == "edit" && rMember == message.guild.member(message.mentions.users.first()) && message.guild.member(message.mentions.users.first() == args[0]))
    content = args.slice(2).join(" ");   
    else if(args[0] == "edit")
    rMember = message.author;
    if(!profile[rMember.id] || args[0] == "edit"){

        if(!profile[rMember.id]){

            profile[rMember.id] = {
                money: config.startMoney,
                xp: 0,
                level: 0,
                next: 10,
                inventory:{roles:[],commandes:[],misc:[]},
                description: `${config.prefix} profile edit (your text here)`,
                lastMessage: 0,
                lastReward: 0,
                tempRole: {}
            };
        };

        if(args[0] == "edit"){
            console.log(content);
            profile[rMember.id].description = content.replace("\\n","\n");
        }; 
        
        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
        });
    };

    let profileDisp = new Discord.RichEmbed()
     .setTitle(`${rMember}\'s profile`)
     .setColor(config.color3)
     .setThumbnail(rMember.avatarURL)
     .addField("level:",`\`${profile[rMember.id].level} ( ${profile[rMember.id].xp} / ${profile[rMember.id].next} xp )\``)
     .addField("money: ",`\`${profile[rMember.id].money}\`${config.currency}`)
     .addField("description: ",`\`\`\`${profile[rMember.id].description}\`\`\``);
     message.channel.send(profileDisp);
     
}

module.exports.help = {
    name: `profile`
}