import mongoose from "mongoose";

interface IDiscordUser {
    id: string;
    thanksGiven: number;
    thanksReceived: number;
    lastGiven: number;
    username: string;
}

const discordUserSchema = new mongoose.Schema<IDiscordUser>({
    id: {
        type: String,
        required: true,
    },
    thanksGiven: {
        type: Number,
        default: 0,
    },
    thanksReceived: {
        type: Number,
        default: 0,
    },
    lastGiven: {
        timestamp: Number,
    },
    username: {
        type: String,
    },
});

const DiscordUser = mongoose.model("discordUser", discordUserSchema);

export { DiscordUser, IDiscordUser };
