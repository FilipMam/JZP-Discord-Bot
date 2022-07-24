import DiscordJS, { Client, Intents } from "discord.js";
import { registerCommands } from "../commands";
import mongoose from "mongoose";
import { registerGlobalEvents } from "./eventBus";
import { initCrons } from "../../crons";

let client: Client;

const initClient = () => {
    client = new DiscordJS.Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    client.on("ready", async () => {
        console.log("The bot is ready");

        await mongoose.connect(`${process.env.MONGO_DB_TOKEN}`, {
            keepAlive: true,
        });

        registerCommands();
        registerGlobalEvents();
        initCrons();
    });

    client.login(process.env.DISCORD_TOKEN);
};

export { client, initClient };
