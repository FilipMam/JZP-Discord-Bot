import { GuildMember } from "discord.js";

const rankTresholds: { [k: number]: string } = {
    10: "999725115954692217",
    25: "999725806265839726",
    50: "999744810816639066",
    100: "999744934275993680",
    150: "999745068753764423",
};

const getCurrentRole = (n: number): string => {
    const treshhold = Number(
        Object.keys(rankTresholds)
            .filter((key) => +key <= +n)
            .at(-1)
    );

    return rankTresholds[treshhold];
};

const updateRankRole = (
    thanksReceived: number,
    user?: GuildMember
): string | undefined => {
    const newRole = getCurrentRole(thanksReceived);

    if (!user || !newRole) return;

    if (user.roles.cache.some((role) => role.id === newRole)) {
        return;
    }

    const rankTresholdsValues = Object.values(rankTresholds);
    const previousRoleIndex = rankTresholdsValues.indexOf(newRole) - 1;
    const previousRole = user.roles.cache.find(
        (role) => role.id === rankTresholdsValues[previousRoleIndex]
    );

    if (previousRole) {
        user.roles.remove(previousRole);
    }
    user.roles.add(newRole);

    return newRole;
};

export { getCurrentRole, updateRankRole };
