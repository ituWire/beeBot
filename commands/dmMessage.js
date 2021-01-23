module.exports = {
  name: "dmeveryone",
  description:"Bu komutu kullanarak tüm kullanıcılara dm'den mesaj atabilirsiniz.",
  usage: "!dmtoeveryone <everyRole>",
  adminOnly: true,
  channelOnly: false,
  channel: "",
  guildOnly: true,
  dmAvailable: false,
  execute(message, DB, args, fs, transporter, prefix) {
    
    let everyRoleId = args[0];
    let freeLength = everyRoleId.length + 2 + "!dmeveryone".length;
    let yazı = message.content.slice(freeLength);
    
    let idList = message.client.users.cache.map(user => user.id);
    for (let i = 0; i < idList.length ;i++){
      let memberId = idList[i];
      let member = message.guild.members.cache.get(memberId);

      if (member.roles.cache.findKey(role => role.id === everyRoleId)){
        member.user.send(yazı);
      };
      //console.log(member.roles.cache.findKey(role => role.id === exceptId))
    }
  }
};