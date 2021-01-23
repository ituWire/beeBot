// module.exports = {
//     name: "notdağılımısıfırla",
//     author: "268784805053857793",
//     channel: "not-dağılımı-kaydet",
//     description: "not-specified",
//     usage: "not-specified",
//     channelOnly: true,
//     channel: "not-dağılımı-kaydet",
//     guildOnly: true,
//     execute(message,DB,args,fs, transporter,client){
//         DB.run(`DROP TABLE notdağılımı`, [],
//         function(err){
//         if (err) {
//             return console.log(err.message);
//         }
//         let dbSchema2 = "CREATE TABLE IF NOT EXISTS notdağılımı (dersKodu text, dersHocası text, resimUrl text, mesaj text);"
//         DB.exec(dbSchema2, function(err){
//             if (err) {
//                 console.log(err)
//             }
//         });
//         console.log("notdağılımı tablosu sıfırlandı");
//         });
//     }
// };
