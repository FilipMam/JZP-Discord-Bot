import { popeCron } from "./pope";

interface ICron {
    init: () => void;
}

const crons = [popeCron];

const initCrons = () => {
    crons.forEach(({ init }) => init());
};
export { initCrons, ICron };
