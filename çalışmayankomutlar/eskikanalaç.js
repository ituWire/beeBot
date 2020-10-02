module.exports = {
    name: "kanalaç",
    description: "Özel kategorisi başlığı altında 24 saat süreli kanal açmanızı sağlar. !kanalaç (kanal adı) komutu ile kullanabilirsiniz.\n\nÖrnek: **!derskoduara İtünün Köpekleri**",
    usage: "!kanalaç kod",
    guildOnly: true,
    channelOnly: true,
    adminOnly: false,
    channel: "kanal-açma",
    execute(message,DB,args,fs, transporter,client){
        let yazı = args.join('-');
        if (yazı=== ""){
            return;
        } else {
            fs.writeFile('dosyaadi.txt', yazı, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            let cloneChannel = message.channel.clone();
        }
      
    }
};

/*
client.on("channelCreate", channel => {
  if (channel.parentID === "760913166011596800"){
    fs.readFile('dosyaadi.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    
    
    channel.setName(data)
    setTimeout(function(){
      channel.delete();
      console.log("bu bir yazıdır")}, 86400000
      )
    });
    }

});
*/