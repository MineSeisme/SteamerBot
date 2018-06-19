const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {

    let rMemberA = message.author;
    let rMemberB = message.mentions.users.first();
    let amount = args[1];

    if(isNaN(amount) || amount < config.minGive) return message.channel.send(`tu dois entrer une somme à donner suppérieure ou égale à ${config.minGive}${config.currency}!`);
    amount = Math.round(amount);

    if(!profile[rMemberB.id]){
            console.log(`creation d'un profil pour ${rMemberB.username} avec l'id ${rMemberB.id}`);
        profile[rMemberB.id] = {
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
  
    
    if(amount > profile[rMemberA.id].money) return message.channel.send(`il te manque ${amount - profile[rMemberA.id].money}${config.currency} pour donner tout ca!`)
    
    message.channel.send(`${rMemberA} a donné ${amount}${config.currency} à ${rMemberB}`)
    let cashDispA = new Discord.RichEmbed()
    .setTitle(`${rMemberA.username}\'s account`)
    .setColor(config.color3)
    .setThumbnail(rMemberA.avatarURL)
    .addField("money:(old)",`\`${profile[rMemberA.id].money}\`${config.currency}`)
   
    let cashDispB = new Discord.RichEmbed()
    .setTitle(`${rMemberB.username}\'s account`)
    .setColor(config.color3)
    .setThumbnail(rMemberB.avatarURL)
    .addField("money:(old)",`\`${profile[rMemberB.id].money}\`${config.currency}`)

    profile[rMemberA.id].money = profile[rMemberA.id].money - amount;
    profile[rMemberB.id].money = profile[rMemberB.id].money + amount;

    fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
        if (err) console.log(err);
    });

    cashDispA.addField("money:(new)",`\`${profile[rMemberA.id].money}\`${config.currency}`)
    cashDispB.addField("money:(new)",`\`${profile[rMemberB.id].money}\`${config.currency}`)
    message.channel.send(cashDispA);
    message.channel.send(cashDispB);

     
}

module.exports.help = {
    name: `give`
}