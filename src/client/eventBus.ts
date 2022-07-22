import { sendMessageToChannel } from "../utils/actions";
import { CHANNELS } from "../utils/contstants/ids";
import { getMainRanking } from "../utils/getters";
import { getRankingOfTheWeek } from "../utils/rankings";
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

        if (message.content === "!rankingTygodnia") {
            const ranking = await getRankingOfTheWeek();
            message.reply(ranking);
        }
    });
};

export { registerGlobalEvents };
