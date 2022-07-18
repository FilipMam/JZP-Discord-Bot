import mongoose from "mongoose";

export const DiscordUserSchema = new mongoose.Schema({
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

const discordUserSchema = mongoose.model("discordUser", DiscordUserSchema);

export { discordUserSchema };
