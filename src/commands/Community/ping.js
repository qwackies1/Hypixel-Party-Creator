const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the ping of the bot.'),

    async execute(interaction, client){
        await interaction.reply(`Latency is ${client.ws.ping}ms`)
    }
}