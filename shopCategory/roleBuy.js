const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = (message, item) => {

    let rMember = message.author;
  
    if(!message.guild.roles.find('name',item.props.role)) return message.channel.send("Désolé mais ce role est actuellement indisponible sur ce serveur! :(");

    if(message.guild.members.get(rMember.id).roles.has(message.guild.roles.find('name', item.props.role).id) && item.props.temp == true)
    return message.channel.send(`Tu as déjà le role ${item.props.role}!`);

    if(profile[rMember.id].inventory.roles.includes(item.props.role))
    return message.channel.send(`Tu as déjà le role ${item.props.role} dans ton inventaire!`);

    message.guild.members.get(rMember.id).roles.forEach((role) => { 
        if(config.shopRoles.includes(role.name)) message.guild.members.get(rMember.id).removeRole(role.id); //enlever les autres roles du shop
    });
    message.guild.members.get(rMember.id).addRole(message.guild.roles.find('name', item.props.role)); //donner le role

    let duration = -1;
    config.tempRoles.forEach( tempRole =>{
        if(tempRole.name == item.props.role) duration = tempRole.duration;
    });

    if( item.props.temp == true && duration != -1) message.channel.send(`tu viens d'obtenir le role ${item.props.role} pour ${duration} heures!`);
    else message.channel.send(`tu viens d'obtenir le role ${item.props.role}!`);


    let oldCash = profile[rMember.id].money;
    profile[rMember.id].money = profile[rMember.id].money - item.price;

    message.channel.send(`\`${message.author.username}'s money: ${profile[rMember.id].money}\`${config.currency}\`  (old: ${oldCash}\`${config.currency}\`)\``)

    if(!item.props.temp) profile[rMember.id].inventory.roles.push(item.props.role);
   
    fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
     if (err) console.log(err);
    });
}