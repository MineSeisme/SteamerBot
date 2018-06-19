const Discord = require("discord.js");
const config = require("../config.json")
const profile = require("../profiles/profileData.json");
const fs = require('fs');

const prefix = config.prefix;


module.exports.run = async (bot, message, args) => {

    let rMember = message.author;

        var Array1 = [0,0,0];
        var displayArray = [0,0,0];
        var slotItems = config.slotEmojis
        var factor = 1;
    
        let getItem = function getItem(x,y){
            var item = (Array1[x] + y) % slotItems.length;
            return item;
        };
    
    
        var money = args[0]; 
    
      if(isNaN(money)){
        message.channel.send("Tu dois entrer un nombre valide");
      }else if(profile[rMember.id].money == 0){
        message.channel.send(`Alors? Comment on se sent quand on est pauvre? ${config.bonusEmoji}`);
      }else if(profile[rMember.id].money < money){
        message.channel.send(`Tu n'as passez d'argent pour parier tout ca, sale pauvre! ${config.bonusEmoji}`);
      }else if(money < config.slotMin){
        message.channel.send(`Tu dois parier au minimun ${config.slotMin}${config.currency}`);
      }else {
         Array1[0]= Math.floor(Math.random() * slotItems.length);
         Array1[1]= Math.floor(Math.random() * slotItems.length);
         Array1[2]= Math.floor(Math.random() * slotItems.length);
         displayArray[0] = slotItems[getItem(0,0)] + "  -  " + slotItems[getItem(1,0)] + "  -  " + slotItems[getItem(2,0)];
         displayArray[1] = slotItems[getItem(0,1)] + "  -  " + slotItems[getItem(1,1)] + "  -  " + slotItems[getItem(2,1)];
         displayArray[2] = slotItems[getItem(0,2)] + "  -  " + slotItems[getItem(1,2)] + "  -  " + slotItems[getItem(2,2)];
       
        if(getItem(0,1) == getItem(1,1) && getItem(1,1) == getItem(2,1)||getItem(0,0) == getItem(1,1) && getItem(1,1) == getItem(2,2)||getItem(0,2) == getItem(1,1) && getItem(1,1) == getItem(2,0)) {
    
            if(getItem(1,1) == slotItems.length - 1 && getItem(0,1) == getItem(1,1) && getItem(1,1) == getItem(2,1)){
                factor = config.slotFac1;
            }else if(getItem(1,1) == 0){
                factor = config.slotFac5;
            }else if(getItem(0,1) == getItem(1,1) && getItem(1,1) == getItem(2,1)){
                factor = config.slotFac4;
            }else if(getItem(1,1) == slotItems.length - 1){
                factor = config.slotFac2;
            }else if(getItem(1,1) == 3){
                factor = config.slotFac3;
            }else{
                factor = 4;
            };
        }else{
            factor = 0;
        };
        
     var moneyWon = (Math.round(money) * factor) - Math.round(money);

     profile[rMember.id].money = profile[rMember.id].money + moneyWon;


     var slot = new Discord.RichEmbed()
     .addField( "Slot machine:", "\n \n" + displayArray[0] + "\n \n" + displayArray[1] + "\n \n" + displayArray[2]);
     
        if(factor === 0){
            slot.setColor('0xff0000');
            profile[config.botUserId].money = profile[config.botUserId].money + Math.round(money * 1);
            slot.addField("Tu as perdu:", money + config.currency);
        }else if(factor === 1) {
            slot.setColor('0x00ff00');
            slot.addField("Tu as gagné:", `Rien, absolument rien! ${config.bonusEmoji}`);
        }else{
            slot.setColor('0x0000ff');
            slot.addField("Tu as gagné:", moneyWon + config.currency) ;
            }; 
        
        message.channel.send(slot);
        console.log("slot" + moneyWon );
      }

       fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
        if (err) console.log(err);
     });
  
}

module.exports.help = {
    name: `slot`
}