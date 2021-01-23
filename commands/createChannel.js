let CronJob = require("cron").CronJob;

module.exports = {
  name: "kanalaç",
  description:
    "Özel kategorisi başlığı altında 24 saat süreli kanal açmanızı sağlar. *!kanalaç <kanal adı>* komutu ile kullanabilirsiniz.\n\nÖrnek: **!kanalaç yol arkadaşı ilanı**",
  usage: "!kanalaç kanal-ismi",
  guildOnly: true,
  channelOnly: true,
  adminOnly: false,
  channel: "kanal-açma",
  dmAvailable: false,
  execute(message, DB, args, fs, transporter, client) {
    try {
      if (args.length === 0) throw new Error("Lütfen bir kanal adı giriniz !");

      let guild = message.guild;
      let channelName = args.join("-").toLowerCase();

      let channelNames = [];
      for (const ch of guild.channels.cache.array()) {
        if (ch.parent) {
          if (ch.parent.name.toLowerCase() === "gündem") {
            channelNames.push(ch.name);
          }
        }
      }

      if (channelNames.includes(channelName))
        throw "Bu adı kullanan başka bir kanal daha var";

      let channel = guild.channels
        .create(channelName, "text")
        .then(ch => {
          let category = guild.channels.cache.get("760913166011596800");
          if (!category) throw new Error("Category channel does not exist");
          ch.setParent(category.id);
          
          return ch;
        })
        .then(ch => {
          let date = new Date();
          date.setSeconds(date.getSeconds() + 24 * 60 * 60);
          let job = new CronJob(
            date,
            function() {
              ch.delete();
              job.stop();
            }
          );
          job.start();
        }).catch(console.error);

    } catch (error) {
      message.reply(error);
    }
  }
};
