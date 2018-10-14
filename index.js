// Setting the config & calling the package
const botconfig = require("./config.json");
const package = require("./package.json")
const Discord = require("discord.js");
const client = new Discord.Client();

// What happens when the bot is started
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.username}...`);
  client.user.setActivity("with JavaScript code!", { type: 'PLAYING' });
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
})

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
})


// Command rules
client.on("message", async message => {
  if(message.author.bot) return; // Checks if command author is the bot iself.
  if(message.channel.type === "dm") return; // Checks if the command is used in DMs.
  if(message.content.indexOf(botconfig.prefix) !== 0) return;

  const args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

  var invoke = message.content.split(" ")[0].substr(botconfig.prefix.length);
      console.log(invoke, args); // Logging all commands.

  // Variables
  var author = message.author; // The person who sent the message.
  var msg = message.content.toUpperCase(); // Takes a message and makes it all upper-case.
  var cont = message.content; // Raw message content
  var prefix = botconfig.prefix; // The prefix of the bot (stands before every command).
  var guild = msg.guild;
  var channel = msg.channel;
  var chan = message.channel;
  var send = message.channel.send;

  if(command === "help") {
    const helpcmds = require("./help.json")
    message.channel.send(helpcmds.commands)
  }

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! :ping_pong: \n**My Latency is:** ${m.createdTimestamp - message.createdTimestamp}ms. \n**API Latency is:** ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    if(args[0]) {
      const sayMessage = args.join(" "); // Reads the message (args) after the say command and puts it into the 'sayMessage' variable.
      message.delete().catch(O_o=>{}); // Deletes the message of the sender.
      message.channel.send(":information_source: " + sayMessage); // Sends the given message after the say command.
  } else {
    message.delete().catch(O_o=>{});
    message.channel.send("You didn't specifiy a text!");
    }
  }

  if(command === "sayembed") {
    message.delete().catch(O_o=>{});
    if(args[0]) {
      const sayMessage = args.join(" ");
      const embed = new Discord.RichEmbed()
      .setDescription(sayMessage)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setFooter("Embed created by: " + message.author.tag)
      message.channel.sendEmbed(embed);
  } else {
    message.channel.send("You didn't specifiy a text!")
  }
  }

  if(command === "stats") {
    const embed = new Discord.RichEmbed()
    .setTitle("General Info & Stats")
    .setDescription("Here, you can find general info as well as some stats about me!")
    .setColor(0x9b59b6)
    .addField("Version:", package.version)
    .addField("Owner:", "<@!" + botconfig.owner + ">" + "(" + botconfig.ownertag + ")")
    .addField("Currently serving:", client.guilds.size + " guilds!")
    .setAuthor(client.user.tag, client.user.avatarURL)
    .setFooter("Thanks so much for using me!", 'https://cdn.discordapp.com/emojis/466609019050524673.png?v=1')
    .setThumbnail('https://cdn.discordapp.com/avatars/223058695100170241/a_ebbefb609630aa6e54cefa0337868fe8.gif')
    message.channel.sendEmbed(embed);
  }

  if(command === "invite") {
    const botid = client.user.id
    const embed = new Discord.RichEmbed()
    .setTitle("Invite me, " + client.user.username + "!")
    .setDescription("You can **invite me** using this link: [Click Here](https://discordapp.com/oauth2/authorize?client_id=" + botid + "&scope=bot&permissions=8)")
    .addField("Anything Else?", "Yes, sadly, you can\'t invite me quite yet, because the bot is currently set to \'private\' and can only be invited by my owner Ink#0001.")
    .setColor(0xe67e22)
    message.channel.sendEmbed(embed)
  }

  if(command === "stealavatar") {
    const user = message.mentions.users.first();
    if(user) {
    const embed = new Discord.RichEmbed()
    .setTitle("Avatar of " + user.tag)
    .setDescription("View it [here](" + user.avatarURL + ")!")
    .addField("Raw Link", user.avatarURL)
    .setThumbnail(user.avatarURL)
    .setColor(0x34495e)
    .setAuthor(user.username, user.avatarURL)
    .setFooter("Requested by: " + message.author.tag)
    message.channel.sendEmbed(embed);
    }
    else {
      message.channel.send("You didn\'t specify a user!")
    }
  }

  if(command === "eval") {
    if(message.author.id !== botconfig.owner) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  if(command === "shutdown") {
    if(message.author.id !== botconfig.owner) return;
      const embed = new Discord.RichEmbed()
      .setDescription("**Shutting down..** :sleeping:")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setFooter("Requested by: " + message.author.tag)
      .setColor(0xc0392b)
      message.channel.sendEmbed(embed)
      setTimeout(function(){ // This is how to make a timeout of 1000ms :)
      client.destroy();
    }, 1000);

  }

  if(command === "setgame") {
    if(message.author.id !== botconfig.owner) return;
      client.user.setActivity(args[1], { type: args[0] })
      const embed = new Discord.RichEmbed()
      .setDescription("The Playing Status has been changed to " + args[0] + " " + args[1])
      .setAuthor(message.author.username, message.author.avatarURL)
      .setFooter("Requested by: " + message.author.tag)
      .setColor(0x27ae60)
      message.channel.sendEmbed(embed);
      console.log("Bot Activity has been changed to " + args[0] + " " + args[1])
  }

  if(command === "setstatus") {
    if(message.author.id !== botconfig.owner) return;
    client.user.setStatus(args[0])
    const embed = new Discord.RichEmbed()
    .setDescription("The Bot Status has been changed to " + args[0] + "!")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setFooter("Requested by: " + message.author.tag)
    .setColor(0x27ae60)
    message.channel.sendEmbed(embed);
    console.log("Bot Status has been changed to " + args[0] + "!")
  }

  if(command === "setname") {
    if(message.author.id !== botconfig.owner) return;
    client.user.setUsername(args[0])
    const embed = new Discord.RichEmbed()
    .setDescription("The username of the bot has been set to " + args[0] + "!")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setFooter("Requested by: " + message.author.tag)
    .setColor(0x27ae60)
    message.channel.sendEmbed(embed)
    console.log("The bot username has been set to " + args[0] + "!")
  }

  if(console === "setavatar") {
    if(message.author.id !== botconfig.owner) return;
    client.user.setAvatar(args[0])
    const embed = new Discord.RichEmbed()
    .setDescription("The avatar of the bot has been changed to " + args[0] + "!")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setFooter("Requested by: " + message.author.tag)
    .setColor(0x27ae60)
    message.channel.sendEmbed(embed);
    console.log("The avatar has been changed to " + args[0] + "!")
  }
});

client.login(botconfig.token);
