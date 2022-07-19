import mongoose from "mongoose";

interface IThanks {
    author: string;
    target: string;
    createdTimestamp: number;
}

const reqString = {
    type: String,
    required: true,
};

const thanksSchema = new mongoose.Schema<IThanks>({
    author: reqString,
    target: reqString,
    createdTimestamp: Number,
});

const Thanks = mongoose.model("thanks", thanksSchema);

export { IThanks, Thanks };
