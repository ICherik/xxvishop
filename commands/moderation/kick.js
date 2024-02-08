const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: ':x: You do not have permission to execute this command'})
        }

        const user =interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'no reason provided'

        try {
            await interaction.guild.members.kick(user, { reason: reason });
            interaction.reply({content: `Successfully kicked ${user.tag} from this server`})
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to kic the user', ephemeral: true})
        }
    },
};