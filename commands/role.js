const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    
    if(!args[0]) return message.channel.send(`veuillez entrer un nom de role à équiper ou déséquiper!`);

    let rMember = message.author;

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
            tempRole:{}
        };

        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
         })
    };

    let invLowerCase = []
    profile[rMember.id].inventory.roles.forEach(item => {
        invLowerCase.push(item.toLowerCase());
    })

    let tRole = profile[rMember.id].inventory.roles[invLowerCase.indexOf(args[0].toLowerCase())];

    if( !invLowerCase.includes(args[0].toLowerCase()) ) return message.channel.send("Ce role n'est pas dans ton inventaire ou le nom de role que tu as mis n'existe pas!")
    if( !message.guild.roles.find('name',tRole ) ) return message.channel.send("Désolé mais ce role est actuellement indisponible sur ce serveur! :(");

    message.guild.members.get(rMember.id).roles.forEach((role) => { 
        if(config.shopRoles.includes(role.name)) message.guild.members.get(message.author.id).removeRole(role.id); //enlever les autres roles du shop
    });

    if( message.guild.member(rMember.id).roles.find('name',tRole) ){

        message.guild.members.get(rMember.id).removeRole(message.guild.roles.find('name', tRole )); //enlever le role
        message.channel.send(`Tu viens de déséquiper le role ${tRole}!`);
    
    }else{

        message.guild.members.get(rMember.id).addRole(message.guild.roles.find('name', tRole )); //donner le role
        message.channel.send(`Tu viens d'équiper le role ${tRole}!`);
    
    };
    

}

module.exports.help = {
    name: `role`
}