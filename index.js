const tokenfile = process.env.SECRET;
const config = require("./config.json");
const profile = require('./profiles/profileData.json');

const Discord = require("discord.js");
const color = require("./utils/color.js");

const fs = require("fs");

const prefix = config.prefix;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.col = new Discord.Collection();

let colData = {};
let t = 0;

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
33

bot.on("guildMemberAdd", member => {

    if(member.guild.channels.find('name',config.inLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:arrow_right: ${member} est arrivé!`)
        .setColor('#5bf014');
        member.guild.channels.find('name',config.inLog).send(embed);
    };

    let role = member.guild.roles.find("name", config.autoRole);

    if(!role) return;
    member.addRole(role);

    if(!member.guild.channels.find('name', config.welcomeChannel)) return;
    member.guild.channels.find('name', config.welcomeChannel).send(`Bienvenue ${member.user.username}. Je te souhaite le bienvenue sur le serveur, 
je me présente, je m'appelle ${bot.user.username} utilise moi avec la commande "**${prefix} help**"`);
    console.log(`Ajout du Grade ${config.autoRole} à ${member.user.username}`)

});

bot.on("guildMemberRemove", (member) =>{

    if(member.guild.channels.find('name',config.outLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:arrow_left: ${member} est parti!`)
        .setColor('#f0b314');
        member.guild.channels.find('name',config.outLog).send(embed);
    };

});

bot.on("guildBanAdd", (guild, user) =>{

    if(guild.channels.find('name',config.banLog)){
        let embed = new Discord.RichEmbed()
        .setDescription(`:asterisk: ${user} s'est fait ban!`)
        .setColor('#f01414');
        guild.channels.find('name',config.banLog).send(embed);
    };

});

bot.on("guildMemberUpdate", (oldMember, newMember) => {

    config.tempRoles.forEach((i) =>{

        if(!(!oldMember.roles.find(`name`, i.name) && newMember.roles.find(`name`, i.name)) )return;
    
        if(!profile[newMember.id]){
            profile[newMember.id] = {
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
    
        profile[newMember.id].tempRole[i.name] = Date.now();

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

    } else if (message.content.toLowerCase().startsWith(prefix)) {

        message.channel.send("Cette commande n'existe pas!");
    };
    
    bot.col.forEach((colFile) => { //update role colors
        colData[colFile.help.name] = colFile.run(message, colFile.help.name , colData[colFile.help.name] , t);
    });
    t = t + 1; 

    let guildUser = message.guild.members.get(message.author.id);

    config.tempRoles.forEach( (i) =>{ //remove temp role after duration expired

        if(message.guild.roles.find('name', i.name)){

            let tmpRole = message.guild.roles.find(`name`,i.name);

            message.guild.roles.find('name', i.name).members.forEach( (rMember) =>{
            
             if(message.createdTimestamp - profile[rMember.id].tempRole[i.name] > i.duration * 3600000 && !profile[rMember.id].inventory.roles.includes(i.name)) guildUser.removeRole(tmpRole.id);
    
            });
         };
   });
   
})


bot.login(process.env.SECRET);