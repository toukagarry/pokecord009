const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {   
  let embed = new Discord.RichEmbed()
    .setTitle("Information")
    .setColor(0xFF4500)
    .setDescription("It will tell you what Pokemon it is whenever Pokecord spawns one. As such, you no longer have to rack your brains or even search Google. Sometimes, you may just miss a rare Pokemon like this.")
    .addField("Developer", "unknown")
    .addField("Bot invite link", "https://discordapp.com/oauth2/authorize?client_id=" + client.user.id + "&scope=bot&permissions=8")
    .addField("Server invite link", "https://discord.gg/fnNJaPh");
  
  message.channel.send(embed);
};

exports.help = {
  name: "info",
  category: "General",
  description: "Get some information about me.",
  usage: "info"
};
