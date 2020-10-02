module.exports = {
    name: "onayla",
    description: "İTÜMailinize gelen doğrulama kodunu !onayla komutundan sonra yazarak discord serverımıza katılabilirsiniz. \n\nÖrnek: **!onayla 123456**",
    usage: "!onayla kod",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "hoşgeldiniz",
    execute(message,DB,args,fs, transporter,client){
        let user = message.author;
        let rows= [];
        let sql = "SELECT * FROM kayit"; 
        DB.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        let counter = 0;
        for (let i= 0; i < rows.length; i++){
        //console.log(user.id);
      
            if (user.id == rows[i]['id']){
                if (args[0] == rows[i]['kod']){
                    counter++;
            } else {
                user.send("<@" + user.id +"> Sistemimizde doğrulama kodunuz bulunamamıştır. !üyeol komutunu kullanarak üye olabilirsiniz.");
                }
            }
      
        } 
      
        if (counter > 0){
        
            let role = message.guild.roles.cache.get("758939803923513366");
            message.member.roles.add(role).catch(console.error);
        
            user.send("<@" + user.id +"> kaydınızın başarılı.");
        } else {
            DB.run(`DELETE FROM kayit WHERE id = ?`, [user.id], function(err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`Satır silme işlemi başarılı ${this.lastID}`);
          
            let role = message.guild.roles.cache.get("758939803923513366");
            message.member.roles.remove(role).catch(console.error);
          
          user.send("<@" + user.id +"> hatalı işlem sonucu kaydınız sistemimizden silinmiştir. Tekrar !üyeol komutu ile doğrulama kodu alabilirsiniz.")
          });        
        }   
    
    });  
  }
}
