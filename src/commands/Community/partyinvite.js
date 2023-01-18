const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
var { party_array, invites, party_leaders } = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Creates a party')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Who you will like to invite')
                .setRequired(true)
        ),
        
    async execute(interaction, client) {
        const invitedUser = interaction.options.getUser('user');
        const inviteEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`:bangbang: <@!${invitedUser.id}>, you have been invited to join <@!${interaction.user.id}>'s party! You have 30 seconds to accept.`)
        const pleaseCreatePartyEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: <@!${interaction.user.id}>, you need to create a party first!`)
        const cannotInviteThemEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: <@!${interaction.user.id}>, You cannot invite that person!`)
        const theyAreAlreadyInYourParty = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: <@!${interaction.user.id}>, They are already in your party!`)
        
        const partyExpired = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: Party invite to ${invitedUser.tag} has expired!`)

        const alreadyInvitedThem = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:x: You have already invited ${invitedUser.tag}!`)

        
        if(party_leaders.length == 0){
            await interaction.reply({ embeds: [pleaseCreatePartyEmbed] });
            return;
        }

        if(invitedUser.bot || invitedUser.id == interaction.user.id){
            await interaction.reply({ embeds: [cannotInviteThemEmbed] });
            return;
        }

        //Check to see if the invited person is already in your party. If it is, return and send an error embed saying that they are already in your party.
        for(let i = 0; i < party_array.length; i++){
            for(let j = 0; j < party_array[i].members.length; j++){
                console.log('Member ID: ' + party_array[i].members[j] + ' Invited ID ' + invitedUser.id);
                console.log('Interaction ID: ' + interaction.user.id)
                if(invitedUser.id == party_array[i].members[j]) return await interaction.reply({ embeds: [theyAreAlreadyInYourParty] })
            }
        }

        for(let i = 0; i < party_leaders.length; i++){
            if(interaction.user.id != party_leaders[i]) continue;
            if(i == party_leaders.length) return await interaction.reply({ embeds: [pleaseCreatePartyEmbed] });
        }

        for(let i = 0; i < invites.length; i ++){
            if(invitedUser.id == invites[i]) continue;
            if(i == invites.length) return await interaction.reply({ embeds: [alreadyInvitedThem] });
        }

        await interaction.reply({ embeds: [inviteEmbed] })
        await invites.push(
            {
                inviter: interaction.user.id,
                accepter: invitedUser.id,
                confirmation: false,
            }
        )
        
        
        // for(let i = 0; i < invites.length; i++){
        //     if(invites[i].time == Date.now() - 1){
        //         await interaction.followUp({ embeds: [partyExpired] })
        //     }
        // }
        
        
        for(let i = 0; i < invites.length; i++){
            if(!invites[i].confirmation){
                setTimeout(async () => {
                    await interaction.editReply({ embeds: [partyExpired] })
                    invites.splice(i, 1)
                    console.log(invites)
                    return;
                }, 30000);
            }
        }

        console.log(invitedUser)
        console.log(party_leaders)
        
    }
}