const discord = require('discord.js');


module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(' ');
    let reports = message.guild.channels.find('name', 'logs');

    if (!target) return message.reply('please specify a member to report!');
    if (!reason) return message.reply('please specify a reason for this report!');
    if (!reports) return message.reply(`please create a channel called ${logs} to log the reports!`);

    let embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Reported Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Reported By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Reported Time', message.createdAt)
        .addField('Reported In', message.channel)
        .addField('Reported Reason', reason)
        .setFooter('Reported user imformation', target.user.displayAvatarURL);

    message.channel.send(`${target} was reported by ${message.author} for ${reason}`).then(msg => msg.delete(2000));
    reports.send(embed);

};

exports.help = {
  name: "report",
  category: "Moderation",
  description: "report a user to server moderators (needs a logs channel to send reports)",
  usage: "report @user"
};
