import { ICron } from ".";
import nodeCron from "node-cron";
import { sendMessageToChannel } from "../src/utils/actions";
import { CHANNELS } from "../src/utils/contstants/ids";

const popeCron: ICron = {
    init: () => {
        nodeCron.schedule(
            "05 12 * * * ",
            function print2137() {
                sendMessageToChannel("Ooooo panieee", CHANNELS.TAG_TESTING);
            },
            {
                scheduled: true,
                timezone: "Europe/Warsaw",
            }
        );
    },
};

export { popeCron };
