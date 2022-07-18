import DiscordJS from "discord.js";
import { COMMANDS } from "../types";
import { thanksSchema } from "../../schema/thanks";
import { discordUserSchema } from "../../schema/discord-user";

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
    )) as any;

    const { thanksReceived: targetReceived } = (await findDiscordUser(
        targetId
    )) as any;

    await discordUserSchema.updateOne(
        {
            id: authorId,
        },
        { thanksGiven: authorGiven + 1, lastGiven: createdTimestamp }
    );

    await discordUserSchema.updateOne(
        {
            id: targetId,
        },
        { thanksReceived: targetReceived + 1 }
    );

    await thanksSchema.create({
        author: authorId,
        target: targetId,
        createdTimestamp,
    });

    interaction.reply(`${authorName} podziękował ${targetName}!`);
};

const findDiscordUser = async (discordId?: string) => {
    if (!discordId) return;

    let record = await discordUserSchema.findOne({
        id: discordId,
    });

    if (!record) {
        record = await discordUserSchema.create({
            id: discordId,
        });
    }

    return record;
};

export default { run, handler };
