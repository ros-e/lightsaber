import { CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type Command from '../../interfaces/command';

const SpotifyCommand: Command = {
  name: 'spotify',
  description: `Connect your Spotify account to the bot`,
  execute: async (client, interaction: CommandInteraction) => {
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle('Spotify Account Not Connected')
      .setDescription('Your Spotify account is not connected. Please connect your Spotify account to use this feature.');

    const button = new ButtonBuilder()
      .setLabel('Connect Spotify')
      .setStyle(ButtonStyle.Link)
      .setURL('https://www.youtube.com/watch?v=lRuZmRnEtaI'); 

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    return await interaction.reply({ embeds: [embed], components: [row] });
  },
};

export default SpotifyCommand;
