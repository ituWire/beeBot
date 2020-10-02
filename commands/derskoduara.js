const essentials = require("../scripts/scrapper.js");
module.exports = {
    name: "derskoduara",
    description: "!derskoduara (derskodu) (hoca adı) şeklinde yazarak itutakipci.com sitesindeki not dağılım resimlerine ve hoca yorumlarına ulaşabilirsiniz. (Hoca adı opsiyonel.)\n\nÖrnek: **!derskoduara mat103e gül inan**",
    usage: "!derskoduara kod (hoca ismi)",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "not-dağılımı-ara",
    execute(message,DB,args,fs, transporter,client){
      essentials.findTeacherPage(args,result => {
        result.forEach(block => {
            let teacherLink = block.teacherLink;
            let teacherName = block.teacherName;
            let lessonCode  = block.lessonCode.trim().split(/ +/).join("");

            essentials.setInfo(teacherLink,lessonCode,result => {
                message.author.send(`**Öğretmen adı: ${teacherName}**\nDers Kodu: ${lessonCode}\nDetaylı Bilgi: ${block.teacherLink}`)
                result.forEach(block => {
                    let messages = [
                                    `Dönem: ${block.lessonSeason}`,
                                    `Dağılım: ${block.mediaUrl}`
                                   ];
                    messages.forEach(msg => {
                      message.author.send(msg);
                    })
                })
            })
        })
    })

    }
};


