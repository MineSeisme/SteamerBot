const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = (message, item) => {

    rMember = message.author;

    if(profile[rMember.id].inventory.commandes.includes(item.name.toLowerCase()))
    return message.channel.send(`Tu as déjà la commande \" ${config.prefix} ${item.name} \" dans ton inventaire!`);

    message.channel.send(`tu peux désormais utiliser la commande \" ${config.prefix} ${item.name} \"`);

    
    let oldCash = profile[rMember.id].money;
    profile[rMember.id].money = profile[rMember.id].money - item.price;

    message.channel.send(`\`${message.author.username}'s money: ${profile[rMember.id].money}\`${config.currency}\`  (old: ${oldCash}\`${config.currency}\`)\``)

    profile[rMember.id].inventory.commandes.push(item.name.toLowerCase());
   
    fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
     if (err) console.log(err);
    });
}