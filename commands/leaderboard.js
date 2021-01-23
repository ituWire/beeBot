const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
  name: "leaderboard",
  description:"Bu komutu kullanarak en yüksek levele sahip kişileri görebilirsiniz.",
  usage: "!leaderboard",
  adminOnly: false,
  channelOnly: false,
  channel: "",
  guildOnly: true,
  dmAvailable: false,
  execute(message, DB, args, fs, transporter, prefix) {
    let sql =
      "SELECT * FROM leveller ORDER BY studentlevel DESC, studentXp DESC LIMIT 10 ";
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      let yazı = ``;
      
      
      for (let i = 0; i < rows.length; i++) {
        let guildMember = message.guild.members.cache.get(rows[i].studentId.toString());
        let user = guildMember.user;
        yazı += `${i + 1}. ${user.username}\n`;
      }
      
      const embed = new Discord.MessageEmbed()
        .setThumbnail(
          "https://media.discordapp.net/attachments/760424599636410378/760623376472866866/Baslksz-1.jpg?width=484&height=677"
        )
        .setColor("#ff0000")
        .setTitle("Liderler")
        .setDescription(`${yazı}`);
      
      message.channel.send({embed: embed});
      
    });
  }
};
