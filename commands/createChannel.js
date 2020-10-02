let CronJob = require('cron').CronJob;

module.exports = {
    name: "kanalaç",
    description: "Özel kategorisi başlığı altında 24 saat süreli kanal açmanızı sağlar. !kanalaç (kanal adı) komutu ile kullanabilirsiniz.\n\nÖrnek: **!derskoduara İtünün Köpekleri**",
    usage: "!kanalaç kanal-ismi",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "kanal-açma",
    execute(message,DB,args,fs, transporter,client){
        try {
          if (args.length === 0) throw new Error("Lütfen bir kanal adı giriniz !");
          
          let guild = message.guild;
          let channelName = args.join("-").toLowerCase();
          
          let channelNames = [];
          for(const ch of guild.channels.cache.array()){
            if(ch.parent){
              if (ch.parent.name.toLowerCase() === "özel"){
                channelNames.push(ch.name);
              }
            }
          }
          
          if(channelNames.includes(channelName)) throw "Bu adı kullanan başka bir kanal daha var"
          
          guild.channels.create(channelName, "text")
            .then(channel => {
              let category = guild.channels.cache.get("760913166011596800");
              if (!category) throw new Error("Category channel does not exist");
              channel.setParent(category.id);
            })
            .catch(console.error);
          
          
        } catch (error){
            message.reply(error);
        }

    }
}