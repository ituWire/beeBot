// const {prefix, token} = require("../config.json");
// module.exports = {
//     name: "notkaydet",
//     description: "not-specified",
//     usage: "not-specified",
//     guildOnly: true,
//     channelOnly: true,
//     channel: "not-dağılımı-kaydet",
//     execute(message,DB,args,fs, transporter,client){
//         const args2 = message.content
//         .slice(prefix.length).slice(name.length + 1).split(">>");
//         for (let i= 0; i < args2.length; i++){
//             args2[i] = args2[i].trim()
//         }
    
//         let dersKodu = args2[0].split().join().toLowerCase();
//         let dersHocası = args2[1].split().join().toLowerCase();
//         let dersYorumu = args2[2];
//         message.channel.messages.fetch(message.id)
//         .then(message =>     
//         DB.run(`INSERT INTO notdağılımı VALUES( ?, ?, ?, ?)`,
//         [dersKodu, dersHocası, message.link],
//         function(err) {
//             if (err) {
//                 return console.log(err.message);
//             }
//             console.log(`A row has been inserted with row id ${this.lastID}`);
//             console.log(message.attachments.array());
//             message.author.send(message.attachments.array()[0].proxyURL)
//         }));
//     }
// };
