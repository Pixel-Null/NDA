const Discord = require('discord.js');
const client = new Discord.Client();
const utils = require('./bot_modules/utils.js');
const messages = require('./bot_modules/messages.js');
const admincommands = require('./bot_modules/admincommands.js');
const config = require('./config.json');

// Bot Version
const version = 1.1;

client.on('ready', () => {
    console.log(`Discord bot ready.`);
    console.log(`Running v${version}.`);
    if (parseFloat(config.version) < version) console.log(`Config outdated! (Config version ${config.version}).`);
    client.user.setPresence({ game: { name: `with ${client.users.size} people across ${client.guilds.size} guilds.` }, status: 'online' })
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.charAt(0) === config.prefix){
        var args = msg.content.split(' ');
        var command = args.shift().substr(1);
        switch(command.toLowerCase()){
            case 'help':
                msg.channel.send(messages.gethelp(msg.author));
                break;
            case 'kick':
                if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(messages.missingpermissions("1 - Missing permissions."));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.comparerank(msg.member, member)) return msg.channel.send(messages.missingpermissions("2 - Can't alter member."));
                var reason = args[1];
                msg.channel.send(
                    new Discord.RichEmbed()
                        .addField(`${member.user.tag} kicked.`,`${reason ? reason : `No reason specified.`}`)
                );
                member.kick(reason);
                utils.log(`User kicked.`, `${msg.author} has kicked ${user}.\n${reason}`);
                break;
            case 'ban':
                if (!msg.member.hasPermission('BAN_MEMBERS')) return msg.channel.send(messages.missingpermissions("1 - Missing permissions."));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.comparerank(msg.member, member)) return msg.channel.send(messages.missingpermissions("2 - Can't alter member."));
                var reason = args[1];
                msg.channel.send(
                    new Discord.RichEmbed()
                        .addField(`${member.user.tag} banned.`,`${reason ? reason : `No reason specified.`}`)
                );
                member.ban(reason);
                utils.log(`User banned.`, `${msg.author} has banned ${user}.\n${reason}`);
                break;
        }
    }
})
client.login(config.private.token);