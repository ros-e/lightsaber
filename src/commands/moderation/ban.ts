import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionsBitField } from 'discord.js';
import type Command from '../../interfaces/command';

const BanCommand: Command = {
  name: 'ban',
  description: `Bans the selected user from the guild`,
  options: [
    {
      name: 'user',
      description: 'The user to ban (mention or ID)',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the ban',
      type: ApplicationCommandOptionType.String,
      required: false,
    }
  ],
  execute: async (client, interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
    }

    const targetUser = interaction.options.get('user')?.user;
    const reasonOption = interaction.options.get('reason');
    const reason = reasonOption ? reasonOption.value as string : 'No reason provided';
    
    if (!targetUser) {
      return interaction.reply({ content: 'User not found.' });
    }
    
    if (!interaction.guild) {
      return interaction.reply({ content: 'This command can only be used in a server.' });
    }
    
    const targetMember = interaction.guild.members.cache.get(targetUser.id);
    
    if (!targetMember) {
      return interaction.reply({ content: 'That user is not in this server.' });
    }
    
    if (!targetMember.bannable) {
      return interaction.reply({ content: 'I cannot ban this user.' });
    }
    
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${targetUser.tag} has been Banned!`)
      .setThumbnail(targetUser.displayAvatarURL({ forceStatic: false }))
      .addFields(
        { name: 'Reason', value: reason, inline: true },
        { name: 'Banned by', value: interaction.user.tag, inline: true },
        { name: 'Guild', value: interaction.guild.name, inline: true }
      )
      .setTimestamp();

    try {
      await targetUser.send({
        embeds: [
          new EmbedBuilder()
            .setColor('White')  
            .setTitle(`You have been banned from **${interaction.guild.name}**`)
            .addFields(
              { name: 'Reason for ban', value: reason, inline: true },
              { name: 'Action Taken by', value: interaction.user.tag, inline: true }
            )
            .setThumbnail(interaction.guild.iconURL({ forceStatic: false })!)  
            .setTimestamp()
        ]
      });
      await targetMember.ban({ reason });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while banning the member.', flags: 64 });
    }
  },
};

export default BanCommand;
