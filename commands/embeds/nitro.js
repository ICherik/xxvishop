const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder,ButtonStyle } = require('discord.js');
const { ownerId,guildIcon } = require ('../../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('nitro')
        .setDescription('create a button for embeds'),

    async execute(interaction) {
        if(interaction.user.id !== ownerId) return
            const bnitro = new ButtonBuilder()
                .setLabel('Nitro Price')
                .setStyle(ButtonStyle.Success)
                .setCustomId('embed')
                .setEmoji('<:7021nitro:1182672510865649714>');
            
            const bticket = new ButtonBuilder()
                .setCustomId('open_ticket')
                .setLabel('Buy')
                .setEmoji('<:XXCard:1182672526078386247>')
                .setStyle(ButtonStyle.Primary);

            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024})})
            .setDescription(':white_check_mark: **برای مشاهده قیمت محصولات بر روی دکمه زیر کلیک نمایید** :white_check_mark:')
            .setColor(`DarkButNotBlack`);

            const buttonRow = new ActionRowBuilder().addComponents(bnitro)

        
            interaction.reply({ content: 'done', ephemeral: true })
            const channel = interaction.guild.channels.cache.get('1181994214242926744')
        
            channel.send({ embeds: [embed], components: [buttonRow], ephemeral: false })
    }
}