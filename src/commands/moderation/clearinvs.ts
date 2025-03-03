import { CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import type Command from '../../interfaces/command';

const ClearInvsCommand: Command = {
  name: 'clearinvites',
  description: `Remove all existing invites in guild`,
  execute: async (client, interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
    }
    try {
      const invites = await interaction.guild?.invites.fetch();
      if(!invites || invites.size == 0) {
           const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('No invites found')
          .setDescription('There are no invites to clear.');
        return await interaction.reply({ embeds: [embed] });
      }
       invites.forEach(async (invite) => {
        await invite.delete();
      });
    const embed = new EmbedBuilder()
        .setColor('White')
        .setTitle('All invites cleared')
        .setDescription('All invites have been successfully removed.');
      return await interaction.reply({ embeds: [embed] });

    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Error')
        .setDescription('An error occurred while trying to clear invites.');
      return await interaction.reply({ embeds: [embed] });
    }}};

export default ClearInvsCommand;
