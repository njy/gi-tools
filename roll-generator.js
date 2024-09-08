export const stats = [
  "CRIT Rate%",
  "CRIT DMG%",
  "Energy Recharge%",
  "Elemental Mastery",
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
];

const increments = {
  "CRIT Rate%": [2.72, 3.11, 3.5, 3.89],
  "CRIT DMG%": [5.44, 6.22, 6.99, 7.77],
  "Energy Recharge%": [4.53, 5.18, 5.83, 6.48],
  "Elemental Mastery": [16.32, 18.65, 20.98, 23.31],
  HP: [209.13, 239.0, 268.88, 298.75],
  "HP%": [4.08, 4.66, 5.25, 5.83],
  ATK: [13.62, 15.56, 17.51, 19.45],
  "ATK%": [4.08, 4.66, 5.25, 5.83],
  DEF: [16.2, 18.52, 20.83, 23.15],
  "DEF%": [5.1, 5.83, 6.56, 7.29],
};

function addNew(rolls, sum, current) {
  if (!rolls[sum]) {
    rolls[sum] = [];
  }
  const prev = rolls[sum].find((roll) => roll.join(",") === current.join(","));

  if (!prev) {
    rolls[sum].push(current);
  }
}

function roundStat(stat, value) {
  if (stat.endsWith("%")) {
    return Math.round(value * 10) / 10;
  }
  return Math.round(value);
}

function addRolls(rolls, total, stat, limit) {
  if (limit === 0) {
    return;
  }
  const increment = increments[stat];
  for (let roll = 0; roll < increment.length; roll++) {
    const currentTotal = total.concat(increment[roll]).sort((a, b) => b - a);
    // use 100x multiplier to fix floating math
    const sum = roundStat(stat, currentTotal.reduce((res, current) => res + current * 100, 0) / 100);
    addNew(rolls, sum, currentTotal);
    addRolls(rolls, currentTotal, stat, limit - 1);
  }
}

function generateRolls(stat) {
  const rolls = {};
  addRolls(rolls, [], stat, 6);
  return rolls;
}

export function breakdownRolls(stat, value) {
  if (!value) {
    return;
  }
  const rolls = generateRolls(stat);
  const match = Object.keys(rolls).find((key) => Number(key) === Number(value));
  if (!match) {
    return "invalid";
  }
  const components = rolls[match][0];
  return `${components.join(" + ")}`;
}

export function rollValue(stat, value) {
  if (!value) {
    return;
  }
  const rolls = generateRolls(stat);
  const match = Object.keys(rolls).find((key) => Number(key) === Number(value));
  if (!match) {
    return;
  }
  const maxPossible = Object.keys(rolls).reduce((max, current) => Math.max(max, Number(current)), 0);

  return `${value} / ${maxPossible} (${((value * 600) / maxPossible).toFixed(0)}%)`;
}
