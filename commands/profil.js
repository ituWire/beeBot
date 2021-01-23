const Discord = require('discord.js');
const {levelCoefficent} = require("../config.json");

module.exports = {
    name: "profil",
    description: "!profil  komutunu kullanarak profilinizi görüntüleyebilirsiniz.",
    guildOnly: true,
    channelOnly: false,
    adminOnly: false,
    channel: "",
    dmAvailable: false,
    execute(message, DB, args,fs,transporter,client){
      let user = message.member;
  
      let sql = "SELECT * FROM leveller WHERE (studentId=?)"; 
      DB.all(sql, [user.id],(err, rows) => {
        if (err) throw err;
        
        rows = rows[0]
        let studentLevel = rows.studentLevel;
        let studentXp = rows.studentXp;
        let imageUrl = message.author.displayAvatarURL({format:"png", dynamic: true}); // Kullanıcının profil resmi
        
        // XP BAR //
        let xpBar = "|";
        let val = Math.floor((parseInt(studentXp)) / (20 * studentLevel));
        for(let i = 0; i<10; i++){
          if (i < val){
            xpBar += "#";
          } else {
            xpBar += "-";
          }
        }
        xpBar += "|";
        // XP BAR //
        
        //profille ilgili bilgiler rows'ta buradan kullanıcıya mesaj atılacak.
        //'https://steemitimages.com/p/BgxWBRxjvNhfmisUGwx9Ym2spzEnbDqnWQzRBfr1hS5VPk5bvWV9FQwAe37EWydV3QbDuFMKQTxX2Trtx5agmaThwWn6NH8deU4x8y43ubPk1osHYJicSLXt9mokUDSV1fbRrCPb3WAbBdyXpou7zMPwwWHEtU3LVsnLuuGrG8FFJQW?format=match&mode=fit&width=640'
        const exampleEmbed = new Discord.MessageEmbed()
          .setImage(imageUrl)
          .setTitle(`Sayın ${message.author.username}, Leveliniz: ${studentLevel}`)
          .setDescription(`Tecrübe: ${xpBar}`);
        message.channel.send(exampleEmbed)
      });

   
    }}

