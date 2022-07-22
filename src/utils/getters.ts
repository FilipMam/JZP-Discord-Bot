import { client } from "../client/client";
import { DiscordUser } from "../schema/discord-user";
import { Thanks } from "../schema/thanks";
import { GUILD_ID } from "./contstants/ids";

const getGuild = () => client.guilds.cache.get(GUILD_ID);

const getChannel = (id: string) =>
    client.channels?.cache?.find((channel) => channel.id === id);

const getMainRanking = async () => {
    const users = await DiscordUser.find({});
    return users
        .filter((user) => user.thanksReceived > 0)
        .sort((a, b) => b.thanksReceived - a.thanksReceived)
        .map(({ discordId, thanksReceived, username }, i) => {
            if (!username) {
                console.log(discordId);
            }

            return `#${i + 1} ${username} (${thanksReceived})`;
        })
        .join("\n");
};

const getUser = async (userId: string) => {
    return client.users.cache.find(({ id }) => id === userId);
};

const getUsername = (userId: string) => "";

export { getGuild, getChannel, getMainRanking, getUser, getUsername };
