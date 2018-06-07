const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const dieMsg = {
        "noArg":[
            `${message.author} s\'est noyé dans son verre d'eau!`,
            `${message.author} à voulu jouer à la roulette russe mais n'a pas eu de chance.`,
            `${message.author} s\'est fait rouler dessus par un bus.`,
            `${message.author} s\'est fait désintegrer par un laser parceque les lasers c'est fun!`,
            `${message.author} a servi de casse croute pour Jean-Michel Zombie.`,
            `${message.author} n'a pas vu le temps passer et est mort de viellesse.`,
            `${message.author} a été victime de la foudre.`,
            `${message.author} n\'aurai pas dû jouer avec le feu!`,
            `${message.author} a voulu voir le fond d'un ravin d'un peu trop près.`,
            `${message.author} était un pingouin qui respire par le cul. Il n'aurai jamais dû s'asseoir...`,
            `La mort de ${message.author} fait désormais partie des darwin awards.`,
            `${message.author} est mort de rire.`,
            `${message.author} s\'est pris une bombe en pleine face.`,
            `${message.author} a tout fait péter! (y compris sa personne)`,
            `${message.author} s\'est fait tabasser à mort par le gang des pélicans.`,
            `${message.author} a voulu devenir un buisson. Malheureusement un incendie s\'est déclaré là où il avait pris racine.`,
            `le roi ${message.author} I est mort, vive le roi ${message.author} II!`,
            `Il était une fois ${message.author} un hero random venant de nulle part qui n'avait plus que 1HP. *Spoiler:* Il s\'est fait tuer par le premier monstre venu.`,
            `${message.author} a voulu manger un champignon rouge à pois blanc. Il avait seulement oublié qu'il nétait pas dans un jeu vidéo.`,
            `Manque de chance pour ${message.author}, la mort ça tue!`,
            `${message.author} est tombé dans la lave`,
            `${message.author} n\'a pas appris à voler asser vite!`,
            `Protip: Le poison c'est pas bon pour la santé ${message.author}.`,
            `${message.author} a utilisé la commande \"${config.prefix} kill\" sur un serveur discord, ca tourne mal: explications.`
        ],
        "withArg":[
            `${message.author} tire sur ${args[0]}.`,
            `${message.author} pousse ${args[0]} dans le vide.`,
            `${args[0]} s\'est fait tuer à coup de hache par ${message.author}.`,
            `-${message.author}:\"Le ciel est bleu, quel beau temps! Battons nous!\" -${args[0]}:\"._.\" / //A few seconds later: \"${args[0]} a gagné 10xp et 100${config.currency}!\"`,
            `${message.author} tente de tuer ${args[0]}... Mais cela échoue.`,
            `${message.author} utilise pistolet sur ${args[0]}. C\'est super efficace! ${args[0]} est décédé!`,
            `${message.author} a tué ${args[0]} ainsi que 34 moutons possédés et 75 poulets démoniaques.`,
            `${message.author} *clic droit ${args[0]}.exe -> supprimer -> clic droit corbeille -> vider la corbeille -> Voulez vous supprimer ${args[0]}.exe définitivement? -> oui*`,
            `${message.author} utilise son ulti sur ${args[0]}!`,
            `${message.author} is firing his laser on ${args[0]}!`,
            `${message.author} *pointe sa baguette magique sur ${args[0]}:* \"Avada Kedavra!\"`,
            `${message.author} percute ${args[0]} avec son camion.`,
            `${message.author} empale ${args[0]} avec une lance.`,
            `${args[0]} et ${message.author} sont sur un bateau. ${args[0]} tombe à l'eau et se noie. Qui reste sur le bateau? :3`,
            `${args[0]} surprend ${message.author} un couteau à la main. ${args[0]} se retourne vers ${message.author} avec un fusil à pompe. les yeux de ${args[0]} lancent une lueur inquiétante dans la pénombre: \"Surprise!\" *coup de fusil à pompe*`,
            `${args[0]} meurt sous les coups meurtriers de l'ours en peluche de ${message.author}`,
            `${args[0]} est un pingouin qui respire par le cul. ${message.author} pousse ${args[0]} et le force à s'asseoir...`,
            `${message.author} lance un couteau sur ${args[0]}. Mais celui ci esquive, prends le couteau désormais planté dans le mur et le renvoie sur ${message.author} qui meurt.`,
            `${message.author} lance un couteau sur ${args[0]}. Celui ci n'a pas le temps d'esquiver et meurt.`,
            `${message.author} lance un missile nucléaire sur ${args[0]}. ${args[0]} était assis juste à coté de ${message.author}...`,
            `${message.author} prends le controle du corps de ${args[0]} et le force à écouter du JUL pendant une heure. Les cerveaux de ${args[0]} et ${message.author} ont subi des dommages irreversibles. Ils finissent sourds, aveugles et muets, ils ont attrappé le cancer et finissent par sombrer dans la folie pour enfin mourrir d'insomnie dans d'atroces souffrances.`,
            `${args[0]} est touché au coeur par une photo de chaton trop mignon que lui a envoyé ${message.author}.`
        ]
    }
    if(!args[0]) message.channel.send(dieMsg.noArg[Math.floor(Math.random()*dieMsg.noArg.length)]);
    else message.channel.send(dieMsg.withArg[Math.floor(Math.random()*dieMsg.withArg.length)]);
}

module.exports.help = {
    name: `kill`
}