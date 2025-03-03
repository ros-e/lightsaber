import { CommandInteraction, EmbedBuilder } from 'discord.js';
import type Command from '../../interfaces/command';

const pingCommand: Command = {
  name: 'ping',
  description: `Displays the current latency of the bot's connection to Discord`,
  execute: async (client, interaction: CommandInteraction) => {
    const embed = new EmbedBuilder()
      .setColor("White") 
      .setTitle(`Latency is ${interaction.client.ws.ping}ms`)
   return await interaction.reply({ embeds: [embed] });
  },
};

export default pingCommand;
