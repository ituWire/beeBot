module.exports = {
    name: "onayla",
    description:
      "İTÜMailinize gelen doğrulama kodunu !onayla komutundan sonra yazarak discord serverımıza katılabilirsiniz. \n\nÖrnek: **!onayla 123456**",
    usage: "!onayla kod",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "hoşgeldiniz",
    dmAvailable: false,
    execute(message, DB, args, fs, transporter, client) {
      let user = message.author;
      let sql = "SELECT * FROM kayit WHERE (id = ?)";
      DB.all(sql, [user.id], (err, rows) => {
        if (err) throw err;
        let counter = rows.length;
        rows = rows[0];
        
  
        if (counter > 0 && rows.kod === args[0]) {
          //ITUStudent rolü
          let role = message.guild.roles.cache.get("758939803923513366");
          message.member.roles.add(role).catch(console.error);
  
          //lisans-yükseklisans rolü-hazırlık
          switch (rows.secenek) {
            case "h":
              role = message.guild.roles.cache.get("762242073163333642");
              message.member.roles.add(role).catch(console.error);
              break;
            case "yl":
              role = message.guild.roles.cache.get("762232376175886338");
              message.member.roles.add(role).catch(console.error);
              break;
            case "l":
              role = message.guild.roles.cache.get("762232261180915722");
              message.member.roles.add(role).catch(console.error);
              break;
            default:
              // lisans
              user.send(
                "Eğitim seçeneği rolü eklemeniz başarısız oldu. Lütfen admine danışınız."
              );
          }
  
          //fakülte rolü ekleme
          let fakulteKodu = rows.numara.substring(0, 2);
          switch (fakulteKodu) {
            case "01":
              role = message.guild.roles.cache.get("762232588600606761"); //inşaat
              message.member.roles.add(role).catch(console.error);
              break;
            case "02":
              role = message.guild.roles.cache.get("762232863826903070"); //mimarlık
              message.member.roles.add(role).catch(console.error);
              break;
            case "03":
              role = message.guild.roles.cache.get("762233030425182229"); //makina
              message.member.roles.add(role).catch(console.error);
              break;
            case "04":
              role = message.guild.roles.cache.get("762233030781173761"); //elektrik-elektronik
              message.member.roles.add(role).catch(console.error);
              break;
            case "05":
              role = message.guild.roles.cache.get("762233354950017058"); //maden
              message.member.roles.add(role).catch(console.error);
              break;
            case "06":
              role = message.guild.roles.cache.get("762233357945274381"); //kimya-metalurji
              message.member.roles.add(role).catch(console.error);
              break;
            case "07":
              role = message.guild.roles.cache.get("762234525912399872"); //işletme
              message.member.roles.add(role).catch(console.error);
              break;
            case "08":
              role = message.guild.roles.cache.get("762233361224957959"); //gemi inşaat
              message.member.roles.add(role).catch(console.error);
              break;
            case "09":
              role = message.guild.roles.cache.get("762233363754385418"); //fen-edebiyat
              message.member.roles.add(role).catch(console.error);
              break;
            case "11":
              role = message.guild.roles.cache.get("762233366006988820"); //uçak-uzay
              message.member.roles.add(role).catch(console.error);
              break;
            case "12":
              role = message.guild.roles.cache.get("762233368494211072"); //konservatuvar
              message.member.roles.add(role).catch(console.error);
              break;
            case "13":
              role = message.guild.roles.cache.get("762233911400595476"); //denizcilik
              message.member.roles.add(role).catch(console.error);
              break;
            case "14":
              role = message.guild.roles.cache.get("762233914990919680"); //tekstil
              message.member.roles.add(role).catch(console.error);
              break;
            case "15":
              role = message.guild.roles.cache.get("762233920556498984"); //bilgisayar
              message.member.roles.add(role).catch(console.error);
              break;
            default:
              user.send(
                "Fakülte rolü ekleme işleminiz başarısız oldu. Lütfen admine danışınız."
              );
              break;
          }
  
          user.send("<@" + user.id + "> kaydınızın başarılı.");
        } else if (counter > 0 && rows.kod != args[0]) {
          DB.run(`DELETE FROM kayit WHERE id = ?`, [user.id], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`Satır silme işlemi başarılı ${this.lastID}`);
  
            let role = message.guild.roles.cache.get("758939803923513366");
            message.member.roles.remove(role).catch(console.error);
  
            user.send("<@" + user.id + "> hatalı doğrulama kodu girmeniz sonucu kaydınız sistemimizden silinmiştir. Tekrar !üyeol komutu ile doğrulama kodu alabilirsiniz.");
          });
        } else {
          user.send("<@" + user.id +"> Sistemimizde doğrulama kodunuz bulunamamıştır. !üyeol komutunu kullanarak üye olabilirsiniz.");
        }
      });
    }
  };
  