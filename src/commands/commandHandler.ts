import { COMMANDS } from "./types";
import { Client, CommandInteraction } from "discord.js";
import { handler as thanksHandler } from "./thanks/thanks";

export const handleCommand = (
    interaction: CommandInteraction,
    client: Client
) => {
    switch (interaction.commandName) {
        case COMMANDS.THANKS:
            thanksHandler(interaction, client);
            break;
        default:
            break;
    }
};
