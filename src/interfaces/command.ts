import type { ApplicationCommandOptionData, CommandInteraction, InteractionResponse } from 'discord.js';

export default interface Command {
  name: string;
  description: string;
  permissions?: string;
  options?: ApplicationCommandOptionData[]; 
  execute: (client: any, interaction: CommandInteraction) => Promise<InteractionResponse<boolean> | undefined>; 
}
