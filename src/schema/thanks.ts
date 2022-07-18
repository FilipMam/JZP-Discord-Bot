import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true,
};

const ThanksSchema = new mongoose.Schema({
    author: reqString,
    target: reqString,
    createdTimestamp: Number,
});

const thanksSchema = mongoose.model("thanks", ThanksSchema);

export { ThanksSchema, thanksSchema };
