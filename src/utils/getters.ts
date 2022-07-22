import { client } from "../client/client";
import { GUILD_ID } from "./contstants/ids";

const getGuild = () => client.guilds.cache.get(GUILD_ID);

const getChannel = (id: string) =>
    client.channels?.cache?.find((channel) => channel.id === id);

export { getGuild, getChannel };
