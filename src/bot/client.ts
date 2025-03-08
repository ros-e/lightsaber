import { Client, Events, CommandInteraction, Collection, ActivityType, type PresenceStatusData, type ApplicationCommandData } from 'discord.js';
import fg from 'fast-glob';
import type Command from '../interfaces/command';
import { activity } from "../config.json";

class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    
    public async start(): Promise<void> {
        this.login(process.env.DISCORD_TOKEN);
        this.setMaxListeners(0);
        
        this.once(Events.ClientReady, async (c) => {
            console.log(`Logged in as ${c.user.tag}`);
            c.user.setPresence({
                activities: [{
                    name: "/bin/bash",
                    type: ActivityType.Listening,
                }],
                status: activity.status as PresenceStatusData
            });
            await this.loadAndRegisterCommands();
            this.on(Events.InteractionCreate, async (interaction) => {
                if (!interaction.isCommand()) return;
                const command = this.commands.get(interaction.commandName);
                if (!command) return;
                try {
                    await command.execute(this, interaction as CommandInteraction);
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                }
            });
        });
    }
    
    private async loadAndRegisterCommands(): Promise<void> {
        try {
            const commandFiles: string[] = await fg(
                `${__dirname.replace(/\\/g, '/')}/../commands/**/*{.ts,.js}`,
                { ignore: ['**/*.d.ts'] } 
            );
    
            const commandsToRegister: ApplicationCommandData[] = [];
            const currentCommandNames: string[] = [];
            await Promise.all(commandFiles.map(async (file) => {
                try {
                    const command: Command = (await import(file)).default;
                    if (command && command.name) {
                        this.commands.set(command.name, command);
                        currentCommandNames.push(command.name);
                        commandsToRegister.push({
                            name: command.name,
                            description: command.description,
                            options: command.options,
                        });
                    }
                } catch (err) {
                    console.error(`Failed to load command from file ${file}:`, err);
                }
            }));
            await this.application?.commands.set(commandsToRegister);
            console.log(`Registered ${commandsToRegister.length} commands globally`);
            try {
                const existingCommands = await this.application?.commands.fetch();
                if (existingCommands) {
                    const commandsToRemove = existingCommands.filter(cmd => 
                        !currentCommandNames.includes(cmd.name)
                    );
                    for (const [id, cmd] of commandsToRemove) {
                        await this.application?.commands.delete(id);
                        // console.log(`Unregistered /${cmd.name} command globally`);
                    }
    
                    if (commandsToRemove.size > 0) {
                        console.log(`Unregistered ${commandsToRemove.size} outdated commands in total`);
                    }
                }
            } catch (error) {
                console.error('Error fetching or deleting commands from Discord:', error);
            }
    
        } catch (error) {
            console.error('Error loading or registering commands:', error);
        }
    }    
}

export { Bot };