module.exports = {
  name: "dmexcept",
  description:"Bu komutu kullanarak tüm kullanıcılara dm'den mesaj atabilirsiniz.",
  usage: "!dmtoeveryone <everyRole> <exceptRole>",
  adminOnly: true,
  channelOnly: false,
  channel: "",
  guildOnly: true,
  dmAvailable: false,
  execute(message, DB, args, fs, transporter, prefix) {
    
    let everyRoleId = args[0];
    let exceptRoleId = args[1];
    let freeLength = everyRoleId.length + exceptRoleId.length + 3 + "!dmexcept".length;
    let yazı = message.content.slice(freeLength);

    
    let idList = message.client.users.cache.map(user => user.id);
    for (let i = 0; i < idList.length ;i++){
      let memberId = idList[i];
      let member = message.guild.members.cache.get(memberId);

      if ((member.roles.cache.findKey(role => role.id === everyRoleId) !== undefined) && (member.roles.cache.findKey(role => role.id === exceptRoleId)) === undefined){
        member.user.send(yazı);
      }
    }
  }
};