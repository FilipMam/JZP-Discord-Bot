import DiscordJS, { Client, Intents, TextChannel } from "discord.js";
import { registerCommands } from "../commands";
import { handleCommand } from "../commands/commandHandler";
import mongoose from "mongoose";
import { DiscordUser } from "../schema/discord-user";
import { registerGlobalEvents } from "./eventBus";

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
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            handleCommand(interaction);
        }
    });

    client.on("messageCreate", async (message) => {
        if (message.content === "!ranking") {
            const users = await DiscordUser.find({});
            const ranking = users
                .filter((user) => user.thanksReceived > 0)
                .sort((a, b) => b.thanksReceived - a.thanksReceived)
                .map(({ discordId, thanksReceived, username }, i) => {
                    if (!username) {
                        console.log(discordId);
                    }

                    return `#${i + 1} ${username} (${thanksReceived})`;
                })
                .join("\n");
            message.reply(ranking);
        }
    });

    registerGlobalEvents();

    client.login(process.env.DISCORD_TOKEN);
};

export { client, initClient };
