function doğrulamaKodu(){
  let sayı = Math.floor(Math.random() * 1000000);
  if (sayı >=100000){
    return sayı;
  }
  else{
    return doğrulamaKodu()
  }
}


module.exports = {
    name: "üyeol",
    description: "!üyeol komutunu kullanarak üye olabilirsiniz. \n Uyarı: İtü mailinizi ve öğrenci numaranızı yanlış girmeniz yetki hataları almanıza sebep olabilir. Mailinize doğrulama kodu gelmesi yaklaşık 2 dakika sürmektedir. \n\nÖrnek: **!üyeol kullanıcıadı@itu.edu.tr 123456789 İsim Soyisim**",
    usage: "!üyeol ITU e-mail Öğrenci No Ad-Soyad",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "hoşgeldiniz",
    execute(message, DB, args,fs, transporter,client){
        let user = message.author;
        if (args.length > 3) {
          let mail_name = args[0];
          let numara = args[1];
          let isim = "";
          for (let ilk = 2; ilk < args.length; ilk++) {
            isim += args[ilk];
          }
          let index = mail_name.search("@itu.edu.tr")
          if (index != -1) {
            let counter = 0;
            if (numara.length == 9) {
              if (isim != "") {
                let doğrulama_kodu = doğrulamaKodu()
                let rows=[];
                
                /////database => rows başlangıcı
                let sql = "SELECT * FROM kayit"; 
                DB.all(sql, [],(err, rows) => {
                if (err) {
                  throw err;
                }
                //////////mail sistemine bakılmalı. açık olabilir.
                for (let i = 0; i < rows.length; i++){
                  if (user.id == rows[i]['id'] || mail_name == rows[i]['mail']){
                    counter++;
                    }
                  }
                  
                ///doğrulama kodu database'e eklenip mail gönderildikten sonra tekrardan !onayla komutu ile kontrol edilecek.
                  if (counter === 0){
                    
                    //database ve mail gönderme kısmı
                    DB.run(`INSERT INTO kayit VALUES( ?, ?, ?, ?, ? )`, [user.id, mail_name, numara, isim, doğrulama_kodu.toString(10)], function(err) {
                        if (err) {
                          return console.log(err.message);
                        }
                        // get the last insert id
                        console.log(`A row has been inserted with row id ${this.lastID}`);
                      });
                    /////////////
    
                    user.send("<@" + user.id + "> Onay mailiniz itu mailinize gönderilmiştir.");
    
                    /////////// mail gönderme kısmı
                    var mailOptions = {
                      from: "ITUDiscordBotu@gmail.com",
                      to: mail_name,
                      subject: "ITUStudent Discord Sunucusu Doğrulama Kodu",
                      text: "Discord doğrulama kodunuz " + doğrulama_kodu.toString(10)
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("Email sent: " + info.response);
                      }
                    });
                    /////////////////
                    
                   }
                  else{
                    user.send(`<@${user.id}>, itumailinizde hata oluşmuştur. Lütfen admine danışınız.`)
                    }
                });
                /////database => rows sonu
                
              } else {
                message.channel.send(`<@${user.id}>, isim soyisminizi yanlış girdiniz.`);
              }
            } else {
              message.channel.send(`<@${user.id}>, öğrenci numaranız hatalı (9 haneli olmak zorundadır).`);
            }
          } else {
            message.channel.send(`<@${user.id}>, itümailiniz hatalı.`);
          }
        } else {
          message.channel.send(`<@${user.id}>, kaydınızın gerçekleşmesi için istenilen tüm bilgileri girmelisiniz.`);
        }
    }  
};
    