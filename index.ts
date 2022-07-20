import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import { commands } from "./src/commands";
import { handleCommand } from "./src/commands/commandHandler";
import mongoose from "mongoose";
import { DiscordUser } from "./src/schema/discord-user";

const GUILD_ID = "814227146423402547";

dotenv.config();

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", async () => {
    console.log("The bot is ready");

    await mongoose.connect(`${process.env.MONGO_DB_TOKEN}`, {
        keepAlive: true,
    });
    const guild = client.guilds.cache.get(GUILD_ID);
    const commandsAPI = guild ? guild.commands : client.application?.commands;

    commands.forEach((command) => {
        command.run(commandsAPI);
    });
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        handleCommand(interaction, client);
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

client.login(process.env.DISCORD_TOKEN);
