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
        h: (colData.h + 20) % 360,
        s: 1,
        l: 0.5
    };

    message.guild.roles.find('name',colRole).setColor(color.hslToDec(colData.h,colData.s,colData.l));
    
    return colData;
}

module.exports.help = {
    name: "Rainbow"
}