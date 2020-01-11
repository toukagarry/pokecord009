const fs = require('fs');
const http = require('http');
const moment = require('moment');
const imageHash = require('image-hash');

const db = require('./Pokemons.json')
const imghash = require('imghash');
imghash
  .hash('./image.png')
  .then((hash) => {
    console.log(hash); // 'f884c4d8d1193c07'
  });
const request = require('request').defaults({ encoding: null });

const Discord = require('discord.js');
var client = new Discord.Client();
const newUsers = [];

const express = require('express');
const app = express();
client.afk = new Map();

if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.commands = new Discord.Collection();
client.cmdhelp = new Discord.Collection();


client.loadCommands = () => {
  fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split('.').pop() === 'js');

    console.log(`LOG Loading a total of ${jsFiles.length} commands.`);

    jsFiles.forEach((f, i) => {
      delete require.cache[require.resolve(`./commands/${ f }`)];
      let props = require(`./commands/${ f }`);
      console.log("LOG Loading command: " + f);
      client.commands.set(f, props);
      client.cmdhelp.set(props.help.name, props.help);
    });
  });
};

client.loadCommands();

client.on('ready', () => {
  console.log(`READY Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`, "Ready", "event");
  client.user.setActivity(`with ichika`);
});

client.on('error', error => {
  console.log(`ERROR ${error}`);
  client.log(error, "Error", "error");
});

client.on('guildCreate', guild => {
  console.log(`GUILD JOIN ${guild.name} (${guild.id}),Owner ${guild.owner.tag}`);
  client.log(`${guild.name} (${guild.id}),Owner ${guild.owner.tag}`, "Guild Join", "joinleave");
});


client.on('guildDelete', guild => {
  console.log(`GUILD LEAVE ${guild.name} (${guild.id})`);
  client.log(`${guild.name} (${guild.id})`, "Guild Leave", "joinleave");
});



client.on("guildMemberAdd", (member) => { // Check out previous chapter for information about this event
let guild = member.guild;
let date = member.user.createdAt;
const newDate = date.toLocaleDateString();
let memberTag = member.user.tag;
if(guild.systemChannel){
  
   
    guild.systemChannel.send(new Discord.RichEmbed() 
    .setTitle("A new user joined" ) 
    .setDescription(memberTag + " has joined the guild") 
    .setThumbnail(member.user.displayAvatarURL)
    .setFooter(member.guild.owner)
  .addField("Welcome to", guild.name )
  .addField("Created at:", moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a') , true)
  .addField("Joined Server", moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a'), true)
    .addField("Members now", member.guild.memberCount) 
    .setTimestamp()
                      
    );
}
});

client.on('message', message => {
  try {
  	let embed = new Discord.RichEmbed()
  		.setColor(0xFF4500);
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('SEND_MESSAGES')) return;
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('EMBED_LINKS')) {
      return message.channel.send("I need the `Embed Links` permission. Please contact an administrator on this server.");
    }

    if (message.author.id == '365975655608745985') {
      message.embeds.forEach((e) => {
        if (e.description !== undefined && e.description.startsWith("Guess the pokémon and type")) {
          if (e.image) {
            let url = e.image.url;
            
            request(url, async function(err, res, body) {
              if (err !== null) return;
            
              imghash
                .hash(body)
                .then(hash => {
                  let result = db[hash];
                  
                  if (result === undefined) {
                    embed
                      .setTitle("Pokemon Not Found")
                      .setDescription("Please contact the owner ichika to add this Pokemon to the database.");
                      
                    return message.channel.send(embed);
                  }
                
                  embed
                    .setTitle(":100:  " + result)
                  message.channel.send(embed);
                
                  console.log("[" + message.guild.name + "/#" + message.channel.name + "] " + result);
                })
            });
          }
        }
      });
    }
    
    
    if (message.author.id == '365975655608745985') {
      message.embeds.forEach((e) => {
        if (e.description !== undefined && e.description.startsWith("Guess the pokémon and type")) {
          if (e.thumbnail) {
            let url = e.thumbnail.url;
            
            request(url, async function(err, res, body) {
              if (err !== null) return;
            
              imghash
                .hash(body)
                .then(hash => {
                  let result = db[hash];
                  
                  if (result === undefined) {
                    embed
                      .setTitle("Pokemon Not Found")
                      .setDescription("Please contact the owner ichika to add this Pokemon to the database.");
                      
                    return message.channel.send(embed);
                  }
                
                  embed
                    .setTitle(":100:  " + result)
                  message.channel.send(embed);
                
                  console.log("[" + message.guild.name + "/#" + message.channel.name + "] " + result);
                })
            });
          }
        }
      });
    }
    

    if (message.author.bot) return;
   

    let prefix = false;
	  let args = message.content;
  	let command = "";
    
    const logsCommands = client.channels.get("576585970279907339");

    //Disables commands in a private chat
    if  (message.channel.type == "dm") {
        console.log(`${message.author.tag} tried to use a command in DM!`);
        return logsCommands.send(`${message.author.tag} tried to use a command in DM!`);
    }
    //Users blacklist
    if (message.author.id == "") {
        console.log(`[BlackList] ${message.author.tag} tried to use a command!`);
        return logsCommands.send(`[BlackList] ${message.author.tag} tried to use a command!`);
    }

    //Channels blacklist
    if (message.channel.id == "") return;

    //Servers blacklist
    if (message.guild.id == "") {
        console.log(`[Blacklist] ${message.author.tag }tried to use a common while server is blacklisted`);
        return logsCommands.send(`[Blacklist] ${message.author.tag} tried to use a command! `);
    }
      
    if (message.content.startsWith("<@" + client.user.id + ">")) {
      prefix = "<@" + client.user.id + ">";
    }
    else if (message.content.startsWith("<@!" + client.user.id + ">")) {
      prefix = "<@!" + client.user.id + ">";
    } else {
      return;
    }
    
    args = message.content.slice(prefix.length).trim().split(/ +/g);
    command = args.shift().toLowerCase();

    let cmd = client.commands.get(command + ".js");
    
    if (cmd) {
      cmd.run(client, message, args);
      console.log(`[${message.guild.name}/#${message.channel.name}] ${message.author.tag} (${message.author.id}): ${cmd.help.name}`);
    }
  } catch (error3) {
    console.log("ERROR at Message: " + error3);
    client.log(error3, "Error at Message", "error");
  }
});

client.clean = async (text) => {
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  if (typeof evaled !== "string")
    text = require("util").inspect(text, {depth: 1});

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(process.env.TOKEN, "--NO--TOKEN--");

  return text;
};

client.log = async (content, title, type) => {
  let embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(content.toString().substr(0, 2048))
    .setColor(0xFF4500)
    .setTimestamp();
  
  if (type === "event") {
    client.channels.get(process.env.EVENTCHANNEL).send(embed);
  }
  else if (type === "error") {
    client.channels.get(process.env.ERRORCHANNEL).send(embed);
  }
  else if (type === "joinleave") {
    client.channels.get(process.env.JOINLEAVECHANNEL).send(embed);
  }
};

client.login(process.env.BOT_TOKEN);

