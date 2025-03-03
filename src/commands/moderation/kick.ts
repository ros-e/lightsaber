import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionsBitField } from 'discord.js';
import type Command from '../../interfaces/command';

const kickCommand: Command = {
  name: 'kick',
  description: `Kicks the selected user from the guild`,
  options: [
    {
      name: 'user',
      description: 'The user to kick (mention or ID)',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the kick',
      type: ApplicationCommandOptionType.String,
      required: false,
    }
  ],
  execute: async (client, interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
    }

    const targetUser = interaction.options.get('user')?.user;
    const reasonOption = interaction.options.get('reason');
    const reason = reasonOption ? reasonOption.value as string : 'No reason provided';
    
    if (!targetUser) {
      return interaction.reply({ content: 'User not found.', flags: 64 });
    }
    
    if (!interaction.guild) {
      return interaction.reply({ content: 'This command can only be used in a server.' });
    }
    
    const targetMember = interaction.guild.members.cache.get(targetUser.id);
    
    if (!targetMember) {
      return interaction.reply({ content: 'That user is not in this server.' });
    }
    
    if (!targetMember.kickable) {
      return interaction.reply({ content: 'I cannot kick this user due to permission hierarchy.' });
    }
    
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`🚪 ${targetUser.tag} has been kicked!`)
      .setThumbnail(targetUser.displayAvatarURL({ forceStatic: false }))
      .addFields(
      { name: '**Reason:**', value: reason, inline: true },
      { name: '**Kicked by:**', value: interaction.user.tag, inline: true }
      )
      .setFooter({ text: `Guild: ${interaction.guild.name}` })
      .setTimestamp();

    try {
      await targetUser.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)  
            .setTitle(`You have been kicked from **${interaction.guild.name}**`)
            .addFields(
             {name: '**Reason for kick:**', value:reason, inline:true, },
             { name: '**Action Taken by:**', value:interaction.user.tag, inline:true}
            )
            .setThumbnail(interaction.guild.iconURL({ forceStatic: false })!)  
            .setTimestamp()
        ]
      });
      await targetMember.kick(reason);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while kicking the member.', flags: 64 });
    }
  },
};

export default kickCommand;
