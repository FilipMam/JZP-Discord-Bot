import DiscordJS from "discord.js";
import { COMMANDS } from "../types";
import { Thanks } from "../../schema/thanks";
import { DiscordUser, IDiscordUser } from "../../schema/discord-user";

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

export const handler = async (interaction: CommandInteraction) => {
    const { options, createdTimestamp } = interaction;
    const { username: targetName, id: targetId } =
        options.get("target")?.user || {};
    const { username: authorName, id: authorId } = interaction.user || {};

    if (targetId === authorId) {
        interaction.reply({
            content: "Podziękuj sobie w lustrze a nie na Discordzie! xD",
            ephemeral: true,
        });

        return;
    }

    const { thanksGiven: authorGiven } = (await findDiscordUser(
        authorId
    )) as IDiscordUser;

    const { thanksReceived: targetReceived } = (await findDiscordUser(
        targetId
    )) as IDiscordUser;

    await DiscordUser.updateOne(
        {
            id: authorId,
        },
        { thanksGiven: authorGiven + 1, lastGiven: createdTimestamp }
    );

    await DiscordUser.updateOne(
        {
            id: targetId,
        },
        { thanksReceived: targetReceived + 1 }
    );

    await Thanks.create({
        author: authorId,
        target: targetId,
        createdTimestamp,
    });

    interaction.reply(`${authorName} podziękował ${targetName}!`);
};

const findDiscordUser = async (discordId?: string) => {
    if (!discordId) return;

    let record = await DiscordUser.findOne({
        id: discordId,
    });

    if (!record) {
        record = await DiscordUser.create({
            id: discordId,
        });
    }

    return record;
};

export default { run, handler };
