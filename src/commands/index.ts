import { client } from "../client/client";
import { getGuild } from "../utils/getters";
import thanksCommand from "./thanks/thanks";

const commands = [thanksCommand];

const registerCommands = () => {
    const guild = getGuild();
    const commandsAPI = guild ? guild.commands : client.application?.commands;

    commands.forEach((command) => {
        command.run(commandsAPI);
    });
};

export { commands, registerCommands };
