import { sendMessageToChannel } from "../utils/actions";
import { CHANNELS } from "../utils/contstants/ids";
import { client } from "./client";

const registerGlobalEvents = () => {
    client.on("rankUp", (message) => {
        sendMessageToChannel(message, CHANNELS.TAG_TESTING);
    });
};

export { registerGlobalEvents };
