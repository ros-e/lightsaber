import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionsBitField } from 'discord.js';
import type Command from '../../interfaces/command';

const ChangeIconCommand: Command = {
  name: 'icon',
  description: `Change guild icon`,
  options: [
    {
      name: 'image',
      description: 'Image to upload',
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
  ],
  execute: async (client, interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
    }

    const serverIcon = interaction.options.get('image')?.attachment;
    
    if (!serverIcon) {
      return interaction.reply({ content: 'Image not uploaded.' });
    }
    
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`Icon Successfully Updated`)
      .setImage(serverIcon.url)
     .setTimestamp();
    try {
      await interaction.guild?.setIcon(serverIcon.url);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: 'There was an error while changing the guild icon.', });
    }
  },
};

export default ChangeIconCommand;
