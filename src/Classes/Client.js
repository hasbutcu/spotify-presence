const { Client, CustomStatus, RichPresence, SpotifyRPC  } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

class oxy extends Client {
    constructor(opt) {
        super(
            {
                ...opt,
                checkUpdate: false,
            }
        )
     
    }


    joinChannel(channel, opt) {
        try {
            if(!channel.joinable) return console.log(`[${this.user.tag}] ${channel.name} Kanalına Giriş Yapamıyorum.`)
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                group: [this.user.id],
                ...opt
            })
            console.log(`[${this.user.tag}] Başarıyla ${channel.name} kanalına bağlandı!`)
        } catch (error) {
            console.log(`[${this.user.tag}] Ses Kanalına Bağlanamadı!`)
        }
    }
}


module.exports = {
    oxy,
    CustomStatus,
    RichPresence,
    SpotifyRPC
}