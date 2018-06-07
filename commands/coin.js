const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require('fs');

const prefix = config.prefix;


module.exports.run = async (bot, message, args) => {
    
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
            tempRole: {}
        };    
    };

    var money = args[0];

    if(isNaN(money)) return message.channel.send("Tu dois entrer un nombre valide");

    if(profile[rMember.id].money == 0) return message.channel.send(`Alors? On est ruiné? ${config.bonusEmoji}`);

    if(profile[rMember.id].money < money) return message.channel.send(`Tu n'as passez d'argent pour parier tout ca, quel dommage! ${config.bonusEmoji}`);
   
    if(money < config.coinMin) return message.channel.send(`Tu dois parier au minimun 100${config.currency}`);
          
      randnum = Math.random();
      var coin = new Discord.RichEmbed()
      if(randnum > 0.5){

          coin.setColor('0x0000ff');
          coin.addField("Coin",`Tu as gagné ${money}${config.currency}`);

          money = Math.round(money * 1);

      }else{
          coin.setColor('0xff0000');
          coin.addField("Coin:",`Tu as perdu ${money}${config.currency}`);

          money = Math.round(money * -1);

      }
    
        profile[rMember.id].money = profile[rMember.id].money + money;
    
         fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
         })
    
        coin.attachFile("./media/coin.png")
        coin.setThumbnail("attachment://coin.png");
        message.channel.send(coin);

}

module.exports.help = {
    name: `coin`
}