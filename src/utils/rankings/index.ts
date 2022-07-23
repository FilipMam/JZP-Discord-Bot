import moment from "moment";
import { DiscordUser } from "../../schema/discord-user";
import { IThanks, Thanks } from "../../schema/thanks";

const dayInMs = 1000 * 60 * 60 * 24;

const getThanksByDate = async (start: number) => {
    const thanks = await Thanks.find({
        createdTimestamp: { $gte: start },
    });
    return thanks;
};

const getThanksFromLastWeek = async () => {
    const now = new Date();
    const weekAgo = now.getTime() - dayInMs * 7;
    const thanks = await getThanksByDate(weekAgo);
    return thanks;
};

const getThanksFromStartOfThisWeek = async () => {
    const startOfTheWeek = moment().startOf("week").valueOf();
    return await getThanksByDate(startOfTheWeek);
};

const getThanksFromStartOfThisMonth = async () => {
    const startOfTheMonth = moment().startOf("month").valueOf();
    return await getThanksByDate(startOfTheMonth);
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
    const messagesFromLastWeek = await getThanksFromStartOfThisWeek();
    return getRanking(messagesFromLastWeek);
};

const getRankingOfTheMonth = async () => {
    const messagesFromLastMonth = await getThanksFromStartOfThisMonth();
    return getRanking(messagesFromLastMonth);
};

export { getRankingOfTheWeek, getRankingOfTheMonth };
