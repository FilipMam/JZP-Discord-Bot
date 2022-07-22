import { client } from "../../client/client";
import { DiscordUser } from "../../schema/discord-user";
import { IThanks, Thanks } from "../../schema/thanks";
import { getUsername } from "../getters";

const getRankingOfTheMonth = async () => {};

const getThanksFromLastWeek = async () => {
    const now = new Date();
    const weekAgo = now.getTime() - 1000 * 60 * 60 * 24 * 7;
    const thanks = await Thanks.find({
        createdTimestamp: { $gte: weekAgo },
    });
    return thanks;
};
type ranking = { [k: string]: number };

const getRanking = async (thanks: IThanks[]) => {
    const rawRanking = thanks.reduce((prev, curr) => {
        const { author, target } = curr;
        if (prev[target]) {
            prev[target] = prev[target] + 5;
        } else {
            prev[target] = 5;
        }

        if (prev[author]) {
            prev[author] = prev[author] + 1;
            prev[author] = 1;
        }

        return prev;
    }, {} as ranking);

    const rankingTuple = Object.entries(rawRanking).slice(0, 10);

    const users = await DiscordUser.find({});
    const userNames = users.map(({ username, discordId }) => ({
        discordId,
        username,
    }));

    const sortedRankingTuple = rankingTuple.sort(
        ([_, itemAScore], [__, itemBScore]) => itemBScore - itemAScore
    );

    const message = sortedRankingTuple
        .map(([userId, userScore]: [string, number], index: number) => {
            const username = userNames.find(
                ({ discordId }) => discordId === userId
            )?.username;
            return `#${index + 1} ${username} - ${userScore} punktów`;
        })
        .join("\n");

    return message;
};

// get rankings by date
const getRankingOfTheWeek = async () => {
    const messagesFromLastWeek = await getThanksFromLastWeek();
    return getRanking(messagesFromLastWeek);
};

export { getRankingOfTheWeek, getRankingOfTheMonth };
