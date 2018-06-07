const Discord = require("discord.js");
const profile = require("../profiles/profileData.json");
const config = require("../config.json");
const fs = require('fs');

const roleBuy = require('../shopCategory/roleBuy.js');
const commandeBuy = require('../shopCategory/commandeBuy.js');
const miscBuy = require('../shopCategory/miscBuy.js');

module.exports.run = async (bot, message, args) => {

    let rMember = message.author;
    let shopDisp = {"head":``,"disp":``};
    let itemsLength = 0;
    let shopEmbed = new Discord.RichEmbed()
    .setTitle(`-The amazing Shop!-`)
    .setDescription(`\`(${rMember.username}'s profile: money: ${profile[rMember.id].money}\`${config.currency}\` - level: ${profile[rMember.id].level})\``);

    let getShopItem = function getShopItem(itemNameOrId){

        let out = -1;
          
        if(!isNaN(itemNameOrId)){

            let rCategory = "";
            let index = -1;
            
            if(itemNameOrId < config.shopItems.roles.length){
                rCategory = 'roles';
                index = itemNameOrId
            }
            else if(itemNameOrId < config.shopItems.roles.length + config.shopItems.commandes.length){
                rCategory = 'commandes';
                index = config.shopItems.roles.length - itemNameOrId
            }
            else if(itemNameOrId < config.shopItems.roles.length + config.shopItems.commandes.length + config.shopItems.misc.length){
                rCategory = 'misc';
                index = (config.shopItems.roles.length + config.shopItems.commandes.length) - itemNameOrId
            };

            if(itemNameOrId >= 0 && itemNameOrId <= config.shopItems.roles.length + config.shopItems.commandes.length + config.shopItems.misc.length)
            out = config.shopItems[rCategory][index];

        }else{

            Object.keys(config.shopItems).forEach((category) =>{

                config.shopItems[category].forEach((item) => {
                    if(item.name.toLowerCase() == itemNameOrId.toLowerCase() && out == -1) out = item;
                });
            
            });
        }

        return out;
    };
    
    let getShopCategory = function getShopCategory(itemNameOrId){

        let out = -1;
          
        if(!isNaN(itemNameOrId)){

            
            if(itemNameOrId < config.shopItems.roles.length){
                out = 'roles';
            }
            else if(itemNameOrId < config.shopItems.roles.length + config.shopItems.commandes.length){
                out = 'commandes';
            }
            else if(itemNameOrId < config.shopItems.roles.length + config.shopItems.commandes.length + config.shopItems.misc.length){
                out = 'misc';
            };

            if(itemNameOrId < 0 || itemNameOrId > config.shopItems.roles.length + config.shopItems.commandes.length + config.shopItems.misc.length)
            out = -1;

        }else{

            Object.keys(config.shopItems).forEach((category) =>{

                config.shopItems[category].forEach((item) => {
                    if(item.name.toLowerCase() == itemNameOrId.toLowerCase() && out == -1) out = category;
                });
            
            });
        }

        return out;
    };

    if(args[0] && getShopItem(args[0]) == -1) 
    return message.channel.send("veuillez entrer un numero ou un nom d'objet valide du magasin!");

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

    if(!args[0]){
        
        if(config.shopItems.roles.length >0){

            shopDisp = {"head":`Roles`,"disp":``};
            config.shopItems.roles.forEach( item => {

                if(!message.guild.roles.find('name',item.props.role)) return  shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.roles.indexOf(item)} | -role actuellement indisponible sur ce serveur! :(-\`\n`;

                if( profile[rMember.id].level >= item.lvlReq && profile[rMember.id].money >= item.price ) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.roles.indexOf(item)} | ${item.name} (disponible, prix: ${item.price}\`${config.currency}\`)\`\n`;
                else if(profile[rMember.id].level < item.lvlReq) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.roles.indexOf(item)} | ${item.name} (indisponible, niveau requis: ${item.lvlReq})\`\n`;
                else 
                    shopDisp.disp = shopDisp.disp + `\`${config.shopItems.roles.indexOf(item)} | ${item.name} (indisponible, prix: ${item.price}\`${config.currency}\`)\`\n`;

            });
            shopEmbed.addField(shopDisp.head,shopDisp.disp);
            itemsLength = itemsLength + config.shopItems.roles.length;

        };

        
        if(config.shopItems.commandes.length > 0){
            
            shopDisp = {"head":`Commandes`,"disp":``}
            config.shopItems.commandes.forEach( item => {

                if( profile[rMember.id].level >= item.lvlReq && profile[rMember.id].money >= item.price ) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.commandes.indexOf(item) + itemsLength} | ${item.name} (disponible, prix: ${item.price}\`${config.currency}\`)\`\n`;
                else if(profile[rMember.id].level < item.lvlReq) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.commandes.indexOf(item) + itemsLength} | ${item.name} (indisponible, niveau requis: ${item.lvlReq})\`\n`;
                else 
                    shopDisp.disp = shopDisp.disp + `\`${config.shopItems.commandes.indexOf(item) + itemsLength} | ${item.name} (indisponible, prix: ${item.price}\`${config.currency}\`)\`\n`;

            });
            shopEmbed.addField(shopDisp.head,shopDisp.disp);
            itemsLength = itemsLength + config.shopItems.commandes.length;
            
        };

        if(config.shopItems.misc.length > 0){
            
            shopDisp = {"head":`Misc`,"disp":``}
            config.shopItems.misc.forEach( item => {

                if( profile[rMember.id].level >= item.lvlReq && profile[rMember.id].money >= item.price ) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.misc.indexOf(item) + itemsLength} | ${item.name} (disponible, prix: ${item.price}\`${config.currency}\`)\`\n`;
                else if(profile[rMember.id].level < item.lvlReq) 
                    shopDisp.disp = shopDisp.disp + `\` ${config.shopItems.misc.indexOf(item) + config.shopItems.commandes.length + config.shopItems.roles.length} | ${item.name} (indisponible, niveau requis: ${item.lvlReq})\`\n`;
                else 
                    shopDisp.disp = shopDisp.disp + `\`${config.shopItems.misc.indexOf(item) + itemsLength} | ${item.name} (indisponible, prix: ${item.price}\`${config.currency}\`)\`\n`;

            });
            shopEmbed.addField(shopDisp.head,shopDisp.disp);
            itemsLength = itemsLength + config.shopItems.misc.length;
            
        };
        shopEmbed.setFooter(`Pour les détails: \" ${config.prefix} shop <numero ou nom d'objet du shop> \"`);

    }else if(args[0] && getShopItem(args[0]) != -1){

        if(args[1] && args[1].toLowerCase() == "buy"){
            let item = getShopItem(args[0]);
            
            if( profile[rMember.id].level < item.lvlReq )
            return message.channel.send(`Désolé mais il te manque ${item.lvlReq - profile[rMember.id].level} niveau(x) pour acheter cela!`);
            else if(profile[rMember.id].money < item.price)
            return message.channel.send(`Désolé mais il te manque${item.price - profile[rMember.id].money}\`${config.currency} pour acheter cela!`);  
        
            if (getShopCategory(args[0]) == 'roles') return roleBuy.run(message, item);
            if (getShopCategory(args[0]) == 'commandes') return commandeBuy.run(message, item);
            if (getShopCategory(args[0]) == 'misc') return miscBuy.run(message, item);
        };

        let item = getShopItem(args[0]);

        if( profile[rMember.id].level >= item.lvlReq && profile[rMember.id].money >= item.price ){
            shopDisp = {"head":`${item.name} (disponible):`,"disp":`\`prix:${item.price}\`${config.currency}\` niveau requis: ${item.lvlReq}`};
            shopEmbed.setFooter(`Pour acheter: \" ${config.prefix} shop ${item.name} buy \"`);
        }else if(profile[rMember.id].level < item.lvlReq){
            shopDisp = {"head":`${item.name} (insdisponible):`,"disp":`\`prix:${item.price}\`${config.currency}\` niveau requis:${item.lvlReq} (niveaux manquants: ${item.lvlReq - profile[rMember.id].level})`};
            shopEmbed.setFooter("(indisponible)");
        }else{
            shopDisp = {"head":`${item.name} (indisponible):`,"disp":`\`prix:${item.price}\`${config.currency}\` (manque: ${item.price - profile[rMember.id].money}\`${config.currency}\` ) niveau requis:${item.lvlReq}`};
            shopEmbed.setFooter("(indisponible)");
        }
        
        shopDisp.disp = shopDisp.disp + `\ndescription: ${item.description}\``;
        shopEmbed.addField(shopDisp.head,shopDisp.disp);
    }
    message.channel.send(shopEmbed);
    
}

module.exports.help = {
    name: `shop`
}