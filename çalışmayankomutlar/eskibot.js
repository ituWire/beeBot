const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const nodemailer = require("nodemailer");
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'kayitlar.db';
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');

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

let dbSchema2 = "CREATE TABLE IF NOT EXISTS notdağılımı (dersKodu text, dersHocası text, resimUrl text, mesaj text);"

DB.exec(dbSchema2, function(err){
    if (err) {
        console.log(err)
    }
});



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

  try {
    command.execute(message,args);
  } catch (error) {
    console.error(error);
    message.reply('sıkıntı var agaa!');
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
  let temp = "ITU Student sunucumuza hoş geldiniz. <@" + user.id +">\nÜye olmak için:\n!üyeol komutunu kullanarak üye olabilirsiniz. Bu komutu kullanırken yanına sırasıyla itümail, 9 haneli öğrenci numaranız ve isim soy isminizi yazmanızı sizden rica ediyoruz. \nHesabınıza gelen doğrulama kodunu !onayla komutundan sonra yazarak discord serverımıza katılabilirsiniz. \n!üyeol kullanıcıadı@itu.edu.tr 999999999 İsim Soyisim \n!onayla 123456";
  user.send(temp);
});

client.login(token);


client.on("channelCreate", channel => {
  if (channel.parentID === "758941755654930433"){
    fs.readFile('dosyaadi.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    
    
    channel.setName(data)
    setTimeout(function(){
      channel.delete();
      console.log("bu bir yazıdır")}, 10000
      )
    });
    }

});

