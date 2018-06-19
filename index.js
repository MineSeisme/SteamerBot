const config = require("./config.json");
const profile = require('./profiles/profileData.json');

const Discord = require("discord.js");
const color = require("./utils/color.js");

const fs = require("fs");

const prefix = config.prefix;

const bot = new Discord.Client();

const http = require('http'); //keep the bot awake
const express = require('express');
const app = express();
app.get("/", (request, response) => response.sendStatus(200));
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

bot.commands = new Discord.Collection();
bot.col = new Discord.Collection();

let last = 0;
let colData = {};
let t = 0;

console.log(config.botUserId);

 if(!profile[config.botUserId]){
            
     console.log(`Compte cagnotte ${config.botUserId} activé!`);
   
            profile[config.botUserId] = {
                money: 0,
                xp: 0,
                level: 666,
                next: 1,
                inventory:{roles:[],commandes:[],misc:[]},
                description: `AsciiDoc\nBonjour je suis Steamou!\n=========================\nJe suis un bot créé par \`Pixelisator\' et inspiré par \`Steamou\' le chat de Paradox créé par \`Shimo\'!\n:miaou: :3`,
                lastMessage: 0,
                lastReward: 0,
                tempRole:{}
            };
   
            fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
         })
        };
    


fs.readdir("./commands", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.lenght <= 0) {
        console.log("Je ne trouve pas les modules de commande.");
        return;
    }

    console.log(`==================== Loading Commands ====================`);
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        let fileCmd = prefix + " " + props.help.name
        bot.commands.set(fileCmd, props);
        console.log(` => ${f}   activated   [Syntaxe = ${fileCmd}]`);
        console.log(`----------------------------------------------------------`);
    });
    console.log('\n');
})


fs.readdir("./color_Roles", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.lenght <= 0) {
        console.log("Je ne trouve pas de fichier color_Role");
        return;
    }

    console.log(`=================== Loading ColorRoles ===================`);
    jsfile.forEach((f, i) => {
        let props = require(`./color_Roles/${f}`);
        let fileCmd = props.help.name
        bot.col.set(fileCmd, props);
        console.log(` => ${f}   activated ${fileCmd}   `);
        console.log(`----------------------------------------------------------`);
    });
    console.log('\n');
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} activé sur ${bot.guilds.size} serveur!`);
    bot.user.setActivity(`${prefix}_help`, { type: "PLAYING" });
});


bot.on("guildMemberAdd", member => {
  

    if(member.guild.channels.find('name',config.inLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:arrow_right: ${member.user.tag} est arrivé!`)
        .setColor('#5bf014');
        member.guild.channels.find('name',config.inLog).send(embed);
    };

    if(!member.guild.channels.find('name', config.welcomeChannel)) return;
  
    member.guild.channels.find('name', config.welcomeChannel).send(`Bienvenue ${member.user}! Je me présente, je m\'appelle ${bot.user}! Pense bien à lire les <#${member.guild.channels.find('name',config.rulesChannel).id}>, c'est important si tu veux éviter de te faire ban bêtement!`);
  
  let role = member.guild.roles.find("name", config.autoRole);
  
  if(!role) return;
    member.addRole(role);
    console.log(`Ajout du Grade ${config.autoRole} à ${member.user.username}`)

});

bot.on("guildMemberRemove", (member) =>{

    if(member.guild.channels.find('name',config.outLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:arrow_left: ${member.user.tag} est parti!`)
        .setColor('#f0b314');
        member.guild.channels.find('name',config.outLog).send(embed);
    };

});

bot.on("guildBanAdd", (guild, user) =>{

    if(guild.channels.find('name',config.banLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:asterisk: ${user.tag} s'est fait ban!`)
        .setColor('#f01414');
        guild.channels.find('name',config.banLog).send(embed);
    };

});

bot.on("guildMemberUpdate", (oldMember, newMember) => {

    config.tempRoles.forEach((i) =>{

        if(!(!oldMember.roles.find(`name`, i.name) && newMember.roles.find(`name`, i.name)) )return;
      
      if(i.name = config.warnRole){
        
        let expireDate = new Date;
        let now = new Date(Date.now());
        console.log(now);
        expireDate.setTime(now.getTime() + (3600000 * i.duration));
        console.log(expireDate);
        let embed = new Discord.RichEmbed()
        .setDescription(`:grey_exclamation: ${newMember.user.tag} s'est pris le role ${config.warnRole}!\n Il gardera ce role jusqu'au ${expireDate.getDate()}/${expireDate.getMonth()}/${expireDate.getFullYear()}`)
        .setColor('#ffffff');
        newMember.guild.channels.find(`name`, config.warnLog).send(embed);
      };
        
      console.log(`creation d'un profil pour ${newMember.user.username} avec l'id ${newMember.user.id}`);
      
        if(!profile[newMember.user.id]){
          
            profile[newMember.user.id] = {
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
          
        };
        profile[newMember.user.id].tempRole[i.name] = Date.now();
        console.log(profile[newMember.user.id]);

        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
         })
      
        console.log(`${newMember.user.tag} a obtenu le role temporaire ${i.name} pour ${i.duration} heure(s)`);

    })
})


bot.on("message", async message => {

  
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let prefix = config.prefix;

    let cmd = messageArray[0] + " " + messageArray[1];
    cmd = cmd.toLowerCase();
    let args = messageArray.slice(2);

    let commandfile = bot.commands.get(cmd);

    if(!profile[message.author.id]){
      
      console.log(`creation d'un profil pour ${message.author.username} avec l'id ${message.author.id}`);
        
      profile[message.author.id] = {
        
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
      
       fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
        });
    };

    if(message.createdTimestamp - profile[message.author.id].lastMessage >= 3000 && !config.xpExclude.includes(message.channel.name) && message.content.length > 2){
        
        profile[message.author.id].lastMessage = message.createdTimestamp;
        profile[message.author.id].xp = profile[message.author.id].xp + Math.round(Math.random(9) + 1);

        if(profile[message.author.id].xp >= profile[message.author.id].next){
            profile[message.author.id].xp = 0;
            profile[message.author.id].level = profile[message.author.id].level + 1;
            profile[message.author.id].next = (profile[message.author.id].level + 1) * 10;
        }
        profile[message.author.id].level
        
        fs.writeFile("./profiles/profileData.json", JSON.stringify(profile, null, 1), (err) =>{
            if (err) console.log(err);
        });
    };

    let canUseCmd = function canUseCmd(){ //if it is a shop command and if the user doesn't have the cmd in his inv return false, else return true

        if(config.shopCommandes.includes(cmd.split(" ")[1])){

            if(!profile[message.author.id]) return false;
            else return profile[message.author.id].inventory.commandes.includes(cmd.split(" ")[1]);

        }else return true;

    };


    if (commandfile) { //run commands

        if(!canUseCmd()) return message.channel.send("Désolé mais tu n'as pas cette commande dans ton inventaire, tu ne peux donc pas l'utiliser! :(")

        if (config.commandesRetardées.includes(cmd.split(" ")[1])) {
            let rnd = Math.floor(Math.random() * config.excuses.length);

            message.channel.send(config.excuses[rnd].texte);

            setTimeout(
                function (cf) {
                    cf.run(bot, message, args);
                },
                config.excuses[rnd].delai * 1000,
                commandfile
            );
        } else commandfile.run(bot, message, args);

        console.log(`La commande "${message.content}" a été exécutée par ${message.author.tag} dans le salon #${message.channel.name}`);

    };
    if(message.CreatedTimestamp - last >= 10 * 60000){
    bot.col.forEach((colFile) => { //update role colors
        colData[colFile.help.name] = colFile.run(message, colFile.help.name , colData[colFile.help.name] , t);
    });
    t = t + 1;
    };
    config.tempRoles.forEach( (tmpRole) => {
   
    if(!message.guild.roles.find('name',tmpRole.name)) return;
    message.guild.roles.find('name',tmpRole.name).members.forEach( (member) => {
      
      if(!profile[member.user.id]) return;
      if(!profile[member.user.id].tempRole[tmpRole.name]) return;
      
      let tDuration = tmpRole.duration
      
      if(tmpRole.hasOwnProperty("altDuration")) tDuration = tmpRole.duration * !profile[member.user.id].includes(tmpRole.name) + tmpRole.altDuration * profile[member.user.id].includes(tmpRole.name);
      
      if(message.createdTimestamp - profile[member.user.id].tempRole[tmpRole.name] >= 3600000 * tDuration){
        member.removeRole(message.guild.roles.find('name',tmpRole.name));
        
        if(tmpRole.hasOwnProperty("altDuration")){
          profile[member.user.id].inventory.splice(profile[member.user.id].inventory.indexOf(tmpRole.name),1);
        }
      };
            
    });
  });
  last = message.createdTimestamp();
})

bot.login(process.env.TOKEN);