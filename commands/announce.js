const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {  
  name: "announce",
  description: "Duyuru yaptırır.",
  usage: "!announce announcement",
  adminOnly: true,
  channelOnly: false,
  channel: "",
  guildOnly: true,
  dmAvailable: false,
  execute(message,DB,args,fs,transporter,prefix,client){
    //let channelName
    let channel= message.channel;
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if (message.content.length < 11) {message.channel.send(`Eee duyuru yapılacak şeyi yazmadın ki <@${message.author.id}> kardeş`); return ;}
    //if(! message.member.roles.cache.has('758939878288261132')){message.reply("Yetkiye sahip değilsiniz."); return;}
    //console.log(message.content.length);
    let announcement = message.content.slice("!announce".length);
    
    const embed = new Discord.MessageEmbed()
                  .setThumbnail('https://media.discordapp.net/attachments/760424599636410378/760623376472866866/Baslksz-1.jpg?width=484&height=677')
                  .setColor('#0099aa')
                  .setTitle('Önemli Duyuru')
                  .setDescription(`${announcement}`)  
                  .setFooter('Duyuru ' + message.author.username+' tarafından yapıldı.');         

    
    message.channel.send(embed).then(embedSent => embedSent.react('🐝'));
    //message.delete();
    //setTimeout(function(){message.delete()}, 6000)
  }
}


