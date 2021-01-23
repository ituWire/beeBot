const Discord = require("discord.js");
const {prefix, token, admins, guildId} = require("./config.json");
const client = new Discord.Client();
const nodemailer = require("nodemailer");
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'kayitlar.db';
const express = require('express');
const app = express();
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");
let CronJob = require("cron").CronJob;

client.commands = new Discord.Collection();
const command_files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of command_files){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const voice_files = fs.readdirSync("./commands/voiceCommands").filter(file => file.endsWith(".js"));
for (const file of voice_files){
  const command = require(`./commands/voiceCommands/${file}`);
  client.commands.set(command.name, command)
}

/////database intro
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')
});


let dbSchema = "CREATE TABLE IF NOT EXISTS kayit (id int, mail text, numara text, isim text, kod text, secenek text);"
DB.exec(dbSchema, function(err){
    if (err) {
        console.log(err)
    }
});


let dbSchema2 = "CREATE TABLE IF NOT EXISTS leveller (studentId text, studentXp int, studentLevel int, backgroundUrl text);";//to be continued bu gklpVi
DB.exec(dbSchema2, function(err){
    if (err) {
        console.log(err);
    }
});
/////////////////////////////////////



///////mail sistemi< buraya dokunmayalım lütfen
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ITUDiscordBotu@gmail.com",
    pass: "botdiscorditu"
  }
});
////////////////////////



client.on("ready", () => {
  
  try{
    console.log("Ready!");
    /////// ÖZEL KATEGORISI KONTROLU ///////
    
    let guild = client.guilds.cache.get(guildId);
    let channels = [];
    for (let channel of guild.channels.cache.array()){
      if (channel.parent){
        if ((channel.parent.name.toLowerCase() === "gündem") && (channel.name !== "kanal-açma")){
          channels.push(channel);
          //console.log(channel.name);
        }
      } 
    }
  
  
    const currentTime = new Date();
    const dayLength = 24 * 60 * 60; // seconds
    for (const channel of channels){
      const diff = (currentTime - channel.createdAt) / 1000;
      //console.log(diff / 3600);
      if((diff) < (dayLength)){
        const date = new Date();
        date.setSeconds(date.getSeconds() + (dayLength - diff));
        let job = new CronJob(date,function() {
          channel.delete();
          job.stop();
        });
        job.start();
      } else {
        channel.delete();
      }
    }
    
  } catch (error){
      console.error(error);
  }
  ////////////////////////////////////
});

client.on("message", message => {
  ////Kullanıcı XP verileri işleme başlangıcı
  /// resim urlsini yazcaz database'e                     // beeBot Id
  if (message.content.length > 3 && message.author.id !== "759074904137531422"){
    
    const userId = message.author.id;
    let sql = "SELECT * FROM leveller WHERE (studentId=?)"; 
    DB.all(sql, [userId.toString()],(err, rows) => {
    if (err) {
      throw err;
      }

      if (rows.length === 0){ // kullanıcının database'de verisi yok ise eklenir.
        let studentId = message.author.id;
        let studentXp = 0;
        let studentLevel = 0;
        let backgroundUrl = ""; /// url'yi yazcazz
        DB.run(`INSERT INTO leveller VALUES( ?, ?, ?, ?)`, [studentId.toString(), studentXp, studentLevel, backgroundUrl], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id    

          console.log(`leveller tablosuna kullanıcı: ${studentId.toString()}, ${this.lastID} satır eklendi.`);
          });
      }
      else { //kullanıcı verisi var ise update etmemiz gerek.
        let studentId = message.author.id;
        let levelKatsayısı = 200;

        let studentXp = rows[0].studentXp;
        let studentLevel = rows[0].studentLevel;
        let newStudentLevel = studentLevel;
        let newStudentXp = studentXp + message.content.length;

        while (newStudentXp > newStudentLevel * levelKatsayısı){
          newStudentXp -= newStudentLevel * levelKatsayısı;
          newStudentLevel++;
        }

        DB.run("UPDATE leveller SET studentXp = ?, studentLevel = ? WHERE studentId = ?", [newStudentXp, newStudentLevel, studentId.toString()], function(err) {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`leveller tablosu ${studentId.toString()} no'lu kişinin verileri güncellendi (level: ${newStudentLevel}, xp: ${newStudentXp}). ${this.changes}`);
        });
      }
    });    
  }
  
  ////Kullanıcı XP verileri işleme sonu
    
  if (!message.content.startsWith(prefix)){
    if (message.channel.name === "hoşgeldiniz" && message.author.id !== "759074904137531422" ){
      message.delete();
    }
    return;
  }

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)){
    message.author.send("Girdiğiniz komut geçersiz.Komutu doğru yazdığınızdan emin olunuz.");
    
    setTimeout(
      function(){message.delete()}, 6000
    );
    return;
  }
  const command = client.commands.get(commandName);
  
  let adminRole;
  if (message.guild !== null){
    adminRole = message.guild.roles.cache.get('763319365625970689'); //758939878288261132
  }
  
  try {
    
      if (command.guildOnly && message.channel.type === "dm"){
        console.log(message.channel);
        throw `This command cannot run via direct message.`;
      }
   
      if(command.channelOnly){
        if (message.channel.type === "dm"){
          if(!command.dmAvailable){
            throw `Bu komut özel mesaj yoluyla çalışmamaktadır !`;
          }
        } else {
          if(message.channel.name !== command.channel){
            throw `Bu komut sunucuda sadece **${command.channel}** kanalında çalışmaktadır !`
          }
        }
      }

      if(command.adminOnly && !(message.member.roles.cache.array().includes(adminRole))){
        throw `This command is only for admin's usage !`;
      }
      
      command.execute(message,DB,args,fs, transporter,prefix,client);
      
    
  } catch (error) {
    console.error(error);
    message.reply(error);
  }
  if(message.channel.type !== "dm"){
      if (message.channel.name === "hoşgeldiniz" && message.author.id !== "759074904137531422" ){
        message.delete();
      } else if (message.channel.name !== "hoşgeldiniz" && message.author.id !== "759074904137531422" ) {
        setTimeout(function(){message.delete()}, 6000);        
      }
  }

});
///*/*/site için
// app.use(express.static("public"));
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
//   console.log(Date.now() + " Ping alındı aktivite devam ediyor.");
//   //response.render(__dirname+'/index.html')
// });
// app.listen(process.env.PORT);
// setInterval(() => {
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
//   console.log(Date.now() + " Ping alındı aktivite devam ediyor.");
// }, 10000);

///*/*/*/

client.on("guildMemberAdd", member => {
  let user = member;
  let temp = "ITU Student sunucumuza hoş geldiniz. <@" + user.id +">\nÜye olmak için:\nHoşgeldiniz kanalında !üyeol komutunu kullanarak üye olabilirsiniz. Bu komutu kullanırken yanına sırasıyla itümail, 9 haneli öğrenci numaranız, isim soy isminizi ve eğitim tercihinizi (lisans için L, yüksek lisans için YL, hazırlık için H) yazmanızı sizden rica ediyoruz. \nİTÜMailinize gelen doğrulama kodunu !onayla komutundan sonra yazarak discord serverımıza katılabilirsiniz. \n Uyarı: İtü mailinizi ve öğrenci numaranızı yanlış girmeniz yetki hataları almanıza sebep olabilir (Bölümünüz farklı atanabilir vs.). Mailinize doğrulama kodu gelmesi yaklaşık 2 dakika sürmektedir. \nÖrnek: **!üyeol kullanıcıadı@itu.edu.tr 123456789 İsim Soyisim L** \n**!onayla 123456**";
  user.send(temp);
  
  let studentId = member.id;
  let studentXp = 0;
  let studentLevel = 0;
  let backgroundUrl = ""; /// url'yi yazcazz
  DB.run(`INSERT INTO leveller VALUES( ?, ?, ?, ?)`, [studentId.toString(), studentXp, studentLevel, backgroundUrl], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`leveller tablosuna ${this.lastID} satır eklendi.`);
    });


});

client.on("guildMemberRemove", member => {
  let user = member.user;
  DB.run("DELETE FROM kayit WHERE id = ?", [user.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`Satır silme işlemi başarılı ${this.lastID}`);
  });
  
  DB.run("DELETE FROM leveller WHERE studentId = ?", [user.id.toString()], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`Satır silme işlemi başarılı ${this.lastID}`);
  });
  
})

client.login(token);