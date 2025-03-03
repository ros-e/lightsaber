import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionsBitField } from 'discord.js';
import type Command from '../../interfaces/command';

const ChangeIconCommand: Command = {
  name: 'banner',
  description: `Change guild banner`,
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

    if ((interaction.guild?.premiumSubscriptionCount ?? 0) < 2) {
      return interaction.reply({ content: 'This command requires the server to be at least level 2 boosted.' });
    }

    const serverBanner = interaction.options.get('image')?.attachment;
    
    if (!serverBanner) {
      return interaction.reply({ content: 'Image not uploaded.' });
    }
    
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`Banner Successfully Updated`)
      .setImage(serverBanner.url)
      .setTimestamp();
    try {
      await interaction.guild?.setBanner(serverBanner.url);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: 'There was an error while changing the guild icon.', });
    }
  },
};

export default ChangeIconCommand;
