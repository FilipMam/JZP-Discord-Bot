import { client } from "../client/client";
import { getGuild } from "../utils/getters";
import { handleCommand } from "./commandHandler";
import thanksCommand from "./thanks/thanks";

const commands = [thanksCommand];

const registerCommands = () => {
    const guild = getGuild();
    const commandsAPI = guild ? guild.commands : client.application?.commands;

    commands.forEach((command) => {
        command.run(commandsAPI);
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            handleCommand(interaction);
        }
    });
};

export { commands, registerCommands };
