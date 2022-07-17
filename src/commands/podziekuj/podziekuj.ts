import DiscordJS from "discord.js";
import { COMMANDS } from "../types";

export const run = (
    commandsAPI:
        | DiscordJS.GuildApplicationCommandManager
        | DiscordJS.ApplicationCommandManager<
              DiscordJS.ApplicationCommand<{
                  guild: DiscordJS.GuildResolvable;
              }>,
              {
                  guild: DiscordJS.GuildResolvable;
              },
              null
          >
        | undefined
) => {
    commandsAPI?.create({
        name: COMMANDS.THANKS,
        description: "Wybierz osobę, której chcesz podziękować:",
        options: [
            {
                name: "target",
                description: "Komu?",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
            },
        ],
    });
};

import { CommandInteraction } from "discord.js";

export const handler = (interaction: CommandInteraction) => {
    const { options } = interaction;
    const targetName = options.get("target")?.user?.username;
    const authorName = interaction.user.username;
    interaction.reply(`${authorName} podziękował ${targetName} za pomoc!`);
};

export default { run, handler };
