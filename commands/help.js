const fs = require("fs");

module.exports = {
  name: "yardım",
  description: `Kullanılabilir tüm komutları açıklamaları ile birlikte döndürür.
isteğe bağlı olarak özel bir komut veya komutlar için aratılabilir.`,
  usage: "!yardım [komut-isimleri] || !yardım",
  guildOnly: false,
  channelOnly: false,
  adminOnly: false,
  channel: "",
  dmAvailable: false,
  execute(message, DB, args, fs, transporter, client) {
    let blocks = read(args);
    blocks.forEach(block => {
      const messageEmbed = {
        color: "DARK_GOLD",
        title: "!" + block.name,
        author: {
          name: client.name,
        },
        fields: [
          {
            value: block.description,
            name: "Açıklama"
        
          }
        ]
      };
      message.author.send({embed: messageEmbed});
    });
  }
};

function read(args) {
  let result = [];
  const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

  for (const commandFile of commandFiles) {
    let {name, description, usage, adminOnly} = require(`./${commandFile}`);
    if ((args.length !== 0 && !args.includes(name)) || adminOnly) continue;

    result.push({ name, description, usage });
  }

  return result;
}
