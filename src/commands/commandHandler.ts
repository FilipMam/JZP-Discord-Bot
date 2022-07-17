import { COMMANDS } from "./types";
import { CommandInteraction } from "discord.js";
import { handler as podziekujHandle } from "./podziekuj/podziekuj";

export const handleCommand = (interaction: CommandInteraction) => {
    switch (interaction.commandName) {
        case COMMANDS.THANKS:
            podziekujHandle(interaction);
            break;
        default:
            break;
    }
};
