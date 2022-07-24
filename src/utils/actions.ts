import { TextChannel } from "discord.js";
import { getChannel } from "./getters";

const sendMessageToChannel = (message: string, channelId: string) => {
    const channel = getChannel(channelId);
    if (channel) {
        (channel as TextChannel).send(message);
    }
};

export { sendMessageToChannel };
