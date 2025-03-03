import { CommandInteraction, EmbedBuilder } from 'discord.js';
import type Command from '../../interfaces/command';

const serverInfoCommand: Command = {
  name: 'info',
  description: `Server Info`,
  execute: async (client, interaction: CommandInteraction) => {
    try {
      const servname = await interaction.guild?.name;
      const embed = new EmbedBuilder()
        .setColor('White')
        .setTitle(servname as string)
        .addFields(
          { name: '**Members**:', value: String(interaction.guild?.memberCount || '0'), inline: true },
          { name: '**Text Channels**:', value: String(interaction.guild?.channels.cache.filter((c) => c.type === 0).toJSON().length || '0'), inline: true },
          { name: '**Voice Channels**:', value: String(interaction.guild?.channels.cache.filter((c) => c.type === 2).toJSON().length || '0'), inline: true },
          { name: '**Vanity**:', value: interaction.guild?.vanityURLCode ? `discord.gg/${interaction.guild.vanityURLCode}` : 'None', inline: true },
          { name: '**Roles**:', value: String(interaction.guild?.roles.cache.size || '0'), inline: true },
          { name: '**Owner**:', value: `<@${interaction.guild?.ownerId}>`, inline: true }
        )
        .setThumbnail(interaction.guild?.iconURL({ forceStatic: false }) || null)
        .setImage(interaction.guild?.bannerURL({ forceStatic: false, size: 512 }) || null)
        .setFooter({ text: `Created on ${interaction.guild?.createdAt}` });
      
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Error')
        .setDescription('Please report this to <@469425831891042307>');
      return await interaction.reply({ embeds: [embed] });
    }
  }
};

export default serverInfoCommand;