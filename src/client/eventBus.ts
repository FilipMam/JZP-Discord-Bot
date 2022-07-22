import { sendMessageToChannel } from "../utils/actions";
import { CHANNELS } from "../utils/contstants/ids";
import { getMainRanking } from "../utils/getters";
import { client } from "./client";

const registerGlobalEvents = () => {
    client.on("rankUp", (message) => {
        sendMessageToChannel(message, CHANNELS.TAG_TESTING);
    });

    client.on("messageCreate", async (message) => {
        if (message.content === "!ranking") {
            const ranking = await getMainRanking();
            message.reply(ranking);
        }
    });
};

export { registerGlobalEvents };
