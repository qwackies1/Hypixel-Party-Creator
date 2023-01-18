const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
var { party_array, party_leaders } = require('../../global.js');
console.log(party_array)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates a party'),
        // .addSubcommand((group) => 
        //     group
        //         .setName('list')
        //         .setDescription('Lists party members')
        // )
        // .addSubcommand((group) => 
        //     group
        //         .setName('invite')
        //         .setDescription('Creates a party')
        //         .addUserOption((option) =>
        //             option
        //                 .setName('user')
        //                 .setDescription('Who you will like to invite')
        //                 .setRequired(true)
        //         )
        // ),
        
    async execute(interaction, client) {
        const createdPartyEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`:white_check_mark:  <@!${interaction.user.id}>'s party has been created.`)

        const alreadyCreatedEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: You already created a party! Disband the first one to create a new one.`)

        for(let i = 0; i < party_leaders.length; i++){
            console.log(party_leaders[i])
            if(interaction.user.id == party_leaders[i]){
                await interaction.reply({ embeds: [alreadyCreatedEmbed] })
                return;
            }
        }

        await party_array.push(
            {
                leader: interaction.user.id,
                members: []
            }
        )
        await interaction.reply({ embeds: [createdPartyEmbed] })

        party_leaders.push(interaction.user.id);
        console.log(interaction.user.id)
        console.log(party_array)
    }

}