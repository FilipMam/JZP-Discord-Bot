import DiscordJS, { Client, User } from "discord.js";
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

export const handler = async (
    interaction: CommandInteraction,
    client: Client
) => {
    const { options, createdTimestamp } = interaction;
    const target = options.get("target")?.user;
    const author = interaction.user;

    if (!target || !author) return;

    if (author.id === target.id) {
        interaction.reply({
            content: "Podziękuj sobie w lustrze a nie na Discordzie! xD",
            ephemeral: true,
        });

        return;
    }

    findDiscordUser(author).then(async (user) => {
        DiscordUser.updateOne(
            {
                discordId: author.id,
            },
            {
                thanksGiven: user?.thanksGiven ? user?.thanksGiven + 1 : 1,
                lastGiven: createdTimestamp,
            }
        ).then();
    });

    findDiscordUser(target).then(async (user) => {
        DiscordUser.updateOne(
            {
                discordId: target.id,
            },
            {
                thanksReceived: user?.thanksReceived
                    ? user?.thanksReceived + 1
                    : 1,
            }
        ).then();
    });

    Thanks.create({
        author: author.id,
        target: target.id,
        createdTimestamp,
    });

    interaction.reply(`${author.username} podziękował ${target.username}!`);
};

const findDiscordUser = async (user?: User) => {
    if (!user) return;
    const { id, username } = user;

    let record = await DiscordUser.findOne({
        discordId: id,
    });

    if (!record) {
        record = await DiscordUser.create({
            discordId: id,
            username,
        });
    }

    return record as IDiscordUser;
};

export default { run, handler };
