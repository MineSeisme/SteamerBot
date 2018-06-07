const Discord = require("discord.js");
const color = require("../utils/color.js");

module.exports.run = (message,colRole,colData,t) => {

    if(!message.guild.available) return;
    if(!message.guild.roles.find('name',colRole)) return;

    if(!colData){

        colData = {
        h: 0,
        s: 0,
        l: 0
        };

    };

    colData = {
        h: (Math.cos(t/1.5) + 1) * 30 + 10,
        s: Math.random() * 0.2 + 0.8,
        l: 0.4 + Math.cos(t/1.5)/5 + 1/5
    };

    message.guild.roles.find('name',colRole).setColor(color.hslToDec(colData.h,colData.s,colData.l));
    
    return colData;
}

module.exports.help = {
    name: "Fire"
}