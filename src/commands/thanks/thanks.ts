import DiscordJS, { Client, User } from "discord.js";
import { COMMANDS } from "../types";
import { Thanks } from "../../schema/thanks";
import { DiscordUser, IDiscordUser } from "../../schema/discord-user";
import { CommandInteraction } from "discord.js";
import { updateRankRole } from "../../utils/roles/ranks";

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

export const handler = async (interaction: CommandInteraction) => {
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

    const updatedAuthor = await updateUserAndIncrementGiven(
        author,
        createdTimestamp
    );

    const updatedTarget = await updateUserAndIncrementReceived(target);

    Thanks.create({
        author: author.id,
        target: target.id,
        createdTimestamp,
    });

    interaction.reply(`${author.username} podziękował ${target.username}!`);

    const newRole = updateRankRole(
        updatedTarget.thanksReceived,
        interaction.guild?.members.cache.get(updatedTarget.discordId)
    );
};

const updateUserAndIncrementGiven = async (user: User, lastGiven: number) => {
    const exitistingUser = await DiscordUser.findOneAndUpdate(
        {
            discordId: user.id,
        },
        { $inc: { thanksGiven: 1 }, lastGiven },
        { returnDocument: "after" }
    );

    if (!exitistingUser) {
        return await DiscordUser.create({
            discordId: user.id,
            username: user.username,
            thanksGiven: 1,
            lastGiven,
        });
    }

    return exitistingUser;
};

const updateUserAndIncrementReceived = async (user: User) => {
    const exitistingUser = await DiscordUser.findOneAndUpdate(
        {
            discordId: user.id,
        },
        { $inc: { thanksReceived: 15 } }
    );

    if (!exitistingUser) {
        return await DiscordUser.create({
            discordId: user.id,
            username: user.username,
            thanksReceived: 1,
        });
    }

    return exitistingUser;
};

export default { run, handler };
