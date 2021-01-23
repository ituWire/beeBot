const Discord = require("discord.js");

module.exports = {
    name: "müzikçalar",
    description: "Müzikçaların bulunduğunuz ses kanalına katılmasını sağlar",
    usage: "!müzikçalar",
    adminOnly: false,
    channelOnly: false,
    channel: "",
    guildOnly: true,
    async execute(message,DB,args,fs,transporter,prefix,client){
        if(message.guild.voice){
            message.reply("Already in a channel");
        } else {
            if(message.member.voice.channel !== null){
                await message.member.voice.channel.join()
                    .then(async function(connection){
                        const x = "./voices/startvoice.mp3";
                        connection.play(x)
                            .then(connection => {
                                connection.disconnect()
                            })
                        })
                    .catch(console.error);

            } else {
                message.reply("Connect to a channel dummy!")
            }
        }


    }
}