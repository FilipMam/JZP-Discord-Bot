import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import { commands } from "./src/commands";
import { handleCommand } from "./src/commands/commandHandler";
import { COMMANDS } from "./src/commands/types";

const GUILD_ID = "814227146423402547";

dotenv.config();

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
    console.log("The bot is ready");
    const guild = client.guilds.cache.get(GUILD_ID);
    const commandsAPI = guild ? guild.commands : client.application?.commands;

    commands.forEach((command) => {
        command.run(commandsAPI);
    });
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        handleCommand(interaction);
    }
});

client.on("messageCreate", (message) => {});

client.login(process.env.DISCORD_TOKEN);
