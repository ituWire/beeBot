const Discord = require("discord.js");
const {prefix, token, admins} = require("./config.json");
const client = new Discord.Client();
const nodemailer = require("nodemailer");
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'kayitlar.db';
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");

client.commands = new Discord.Collection();
const command_files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of command_files){

  const command = require(`./commands/${file}`);

  client.commands.set(command.name,command);

}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


/////database intro
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')
});


let dbSchema = "CREATE TABLE IF NOT EXISTS kayit (id int, mail text, numara text, isim text, kod text);"
DB.exec(dbSchema, function(err){
    if (err) {
        console.log(err)
    }
});

// let dbSchema2 = "CREATE TABLE IF NOT EXISTS notdağılımı (dersKodu text, dersHocası text, resimUrl text, mesaj text);"
// DB.exec(dbSchema2, function(err){
//     if (err) {
//         console.log(err)
//     }
// });


let dbSchema5 = "CREATE TABLE IF NOT EXISTS leveller (studentId int, studentXp int, studentLevel int, backgroundUrl text);";//to be continued bu gklpVi
DB.exec(dbSchema, function(err){
    if (err) {
        console.log(err);
    }
});
/////////////////////////////////////
/**//*/ XP toplama fonksiyonu başı*/

// client.on("message", message => {//bunu ayrı bir komuta koy
// //   let data = [];
// //   if (message.author.bot) return;
// //   if (message.content.length < 4) return;
// //   if (message.guild) { 
// //     const dataBase = "SELECT * FROM leveller";
// //     DB.all(dataBase, [],(err, data) => {
// //       if (err) {
// //         throw err;
// //       }
// //       for(let i=0; i<data.length;i++){        
// //       }     
// //     });
//      const command = client.commands.get('XPsayma') ;
//      command.execute(message,DB,client);
      
      
// });
      
  
/*/*///* XP toplama komutu sonu

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
  console.log("Ready!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);
  const adminRole = message.guild.roles.cache.get('758939878288261132');

  try {
    
      if (command.guildOnly && message.channel.type === "dm"){
        throw `This command cannot run via direct message.`;
      }
   
      if(command.channelOnly && (message.channel.name !== command.channel)){
        throw `This command only runs at ${command.channel}`;
      }

      if(command.adminOnly && !(message.member.roles.cache.array().includes(adminRole))){
        throw `This command is only for admin's usage !`;
      }
      
      command.execute(message,DB,args,fs, transporter,prefix,client);
    
  } catch (error) {
    console.error(error);
    message.reply(error);
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
  let temp = "ITU Student sunucumuza hoş geldiniz. <@" + user.id +">\nÜye olmak için:\n!üyeol komutunu kullanarak üye olabilirsiniz. Bu komutu kullanırken yanına sırasıyla itümail, 9 haneli öğrenci numaranız ve isim soy isminizi yazmanızı sizden rica ediyoruz. \nİTÜMailinize gelen doğrulama kodunu !onayla komutundan sonra yazarak discord serverımıza katılabilirsiniz. \n Uyarı: İtü mailinizi ve öğrenci numaranızı yanlış girmeniz yetki hataları almanıza sebep olabilir. Mailinize doğrulama kodu gelmesi yaklaşık 2 dakika sürmektedir. \nÖrnek: **!üyeol kullanıcıadı@itu.edu.tr 123456789 İsim Soyisim** \n**!onayla 123456**";
  user.send(temp);
});

client.login(token);