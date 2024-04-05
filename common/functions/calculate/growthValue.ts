/* eslint-disable no-unused-vars */
export enum TYPE {
  NO_CHANGE = 'NO_CHANGE',
  INCREASE = 'INCREASE',
  DECREASES = 'DECREASES',
}
type Response = { growth: TYPE; value: number };

const checkRoundedNumber = (num: number) => +(num % 1 === 0 ? num : num.toFixed(2));

export function value(lastMonth: number = 0, currentMonth: number = 0): Response {
  let growth = TYPE.NO_CHANGE;
  if (lastMonth < currentMonth) growth = TYPE.INCREASE;
  else if (lastMonth > currentMonth) growth = TYPE.DECREASES;

  if ((!lastMonth && !currentMonth) || lastMonth === currentMonth) return { growth, value: 0 };
  else if (!lastMonth && currentMonth) return { growth, value: 100 };
  else if (lastMonth && !currentMonth) return { growth, value: -100 };
  else {
    const growthValue = ((currentMonth - lastMonth) / lastMonth) * 100;
    return { growth, value: checkRoundedNumber(growthValue) };
  }
}
