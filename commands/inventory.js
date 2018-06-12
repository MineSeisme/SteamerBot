const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    
    let rMember = message.author;
    let invDisp = {"head":``,"disp":``};
    let invEmbed = new Discord.RichEmbed()
    .setTitle(`**${rMember.username}'s inventory!**`);

    if(profile[rMember.id].inventory == {roles:[],commandes:[],misc:[]} ) return message.channel.send("Ton inventaire est vide! :(")

    if(profile[rMember.id].inventory.roles.length > 0){

        invDisp = {"head":`Roles`,"disp":``};

        profile[rMember.id].inventory.roles.forEach(item => {
            invDisp.disp = invDisp.disp + `\`${item} (\" ${config.prefix} role ${item}\ " to equip)\`\n`;
        });
        invEmbed.addField(invDisp.head,invDisp.disp);
    };
    
    if(profile[rMember.id].inventory.commandes.length > 0){

        invDisp = {"head":`Commandes`,"disp":``};

        profile[rMember.id].inventory.commandes.forEach(item => {
            invDisp.disp = invDisp.disp + `\`${config.prefix} ${item} \`\n`;
        });

        invEmbed.addField(invDisp.head,invDisp.disp);
    };

    if(profile[rMember.id].inventory.misc.length > 0){

        invDisp = {"head":`Misc`,"disp":``};

        profile[rMember.id].inventory.misc.forEach(item => {
            invDisp.disp = invDisp.disp + `\`${item}\`\n`;
        });

        invEmbed.addField(invDisp.head,invDisp.disp);
    };
    invEmbed.setThumbnail(rMember.avatarURL);
    message.channel.send(invEmbed);
}

module.exports.help = {
    name: `inventory`
}