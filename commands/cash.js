const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async (bot, message, args) => {


    let rMember =  message.guild.member(message.mentions.users.first()) || message.author;
    
    if(args[0]) args[0] = args[0].toLowerCase();

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
        
        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
        });
    };
    let cashDisp = new Discord.RichEmbed()
     .setTitle(`${rMember.username}\'s account`)
     .setColor(config.color3)
     .setThumbnail(rMember.avatarURL)
     .addField("money: ",`\`${profile[rMember.id].money}\`${config.currency}`)
     message.channel.send(cashDisp);
     
}

module.exports.help = {
    name: `cash`
}