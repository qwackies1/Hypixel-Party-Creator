const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all of the commands.'),
    
    async execute(interaction, client) {
        console.log(interaction)
        let page = 0;

        const page1 = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Help Center')
            .setDescription('Command Guide:')
            .addFields({ name: "/help", value: "Lists commands" })
            .addFields({ name: "/ping", value: "Checks the ping of the bot" })
            .addFields({ name: "/create", value: "Creates a party" })
            .setTimestamp()

        const page2 = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Help Center Continued...')
            .setDescription('Command Guide:')
            .addFields({ name: "/invite", value: "Invites people to your party" })
            .addFields({ name: "/accept", value: "Accepts a party invite" })
            .addFields({ name: "/disband", value: "Disbands your party" })
            .setTimestamp()

        const pages = [page1, page2];

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('before')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('1048646701533102120'),

                new ButtonBuilder()
                    .setCustomId('next')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('1048646695027744768'),
            )

        const message = await interaction.reply({ embeds: [page1], components: [buttons] })
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId == "next" && page < pages.length - 1){
                page++;

                if(i.user.id !== interaction.user.id){
                    await i.reply({ content: `Only ${interaction.user.tag} can change pages. Do /help if you want to do it yourself.`, ephemeral: true})
                    return;
                }

                await i.update({ embeds: [pages[page]], components: [buttons] })
            }

            if (i.customId == "before" && page > 0){
                page--;

                if(i.user.id !== interaction.user.id){
                    await i.reply({ content: `Only ${interaction.user.tag} can change pages. Do /help if you want to do it yourself.`, ephemeral: true})
                    return;
                }

                await i.update({ embeds: [pages[page]], components: [buttons] })
            }
        })

    }
}