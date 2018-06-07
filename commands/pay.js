const Discord = require("discord.js");
const config = require("../config.json")
const profile = require("../profiles/profileData.json");
const fs = require('fs');

const prefix = config.prefix;
const ProfilePreset = {
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


module.exports.run = async (bot, message, args) => {

    rMember = message.author;

    if(!profile[rMember.id]){
        profile[rMember.id] = ProfilePreset;
        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
           if (err) console.log(err);
        })
    };

    var last = profile[rMember.id].lastReward;
    var delay = config.payDelay * 60000;
    var timeMsg = message.createdTimestamp;

    if( delay - (timeMsg - last) <= 0 ){

            profile[rMember.id] = {
                money: profile[rMember.id].money + config.payAmount,
                xp: profile[rMember.id].xp,
                level: profile[rMember.id].level,
                next: (profile[rMember.id].level + 1) * 10,
                inventory: profile[rMember.id].inventory,
                description: profile[rMember.id].description,
                lastMessage: profile[rMember.id].lastMessage,
                lastReward: timeMsg,
                tempRole:profile[rMember.id].tempRole
             }
     
             fs.writeFile("./profiles/profileData.json", JSON.stringify(profile), (err) =>{
                if (err) console.log(err);
             })

        message.channel.send(`Tu as reçu ${config.payAmount}${config.currency}`);
    }else{
        if((delay - (timeMsg - last)) < 60000){
            message.channel.send(`Tu dois attendre encore ${(delay - (timeMsg - last)) / 1000} secondes.`);
        }else if((delay - (timeMsg - last)) < 3600000){
            message.channel.send(`Tu dois attendre encore ${Math.round((delay - (timeMsg - last)) / 60000)} minutes.`);
        }else{
            message.channel.send(`Tu dois attendre encore ${Math.round((delay - (timeMsg - last)) / 3600000)} heures.`);
        };
    };

}

module.exports.help = {
    name: `pay`
}