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

    await updateUserAndIncrementGiven(author, createdTimestamp);
    await updateUserAndIncrementReceived(target);

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

const updateUserAndIncrementGiven = async (user: User, lastGiven: number) => {
    const exitistingUser = await DiscordUser.updateOne(
        {
            discordId: user.id,
        },
        { $inc: { thanksGiven: 1 }, lastGiven }
    );

    if (exitistingUser.matchedCount === 0) {
        await DiscordUser.create({
            discordId: user.id,
            username: user.username,
            thanksGiven: 1,
            lastGiven,
        });
    }
};

const updateUserAndIncrementReceived = async (user: User) => {
    const exitistingUser = await DiscordUser.updateOne(
        {
            discordId: user.id,
        },
        { $inc: { thanksReceived: 1 } }
    );

    if (exitistingUser.matchedCount === 0) {
        await DiscordUser.create({
            discordId: user.id,
            username: user.username,
            thanksReceived: 1,
        });
    }
};

export default { run, handler };
