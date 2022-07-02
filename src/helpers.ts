import _ from "lodash";
import { Kid, TraitsRecord, useKids } from "./context";
import { traitsById } from "./fixtures";

type WithName = { name: string } | undefined;
type WithId = { id: string } | undefined;
type WithScore = { score?: number } | undefined;
type WithAge = { age?: number } | undefined;

export const alphabeticSortByNameProperty = (a: WithName, b: WithName) => {
  const aName = a?.name.toLowerCase();
  const bName = b?.name.toLowerCase();
  if (!aName || !bName) return 0;
  return aName < bName ? -1 : aName > bName ? 1 : 0;
};

/** Returns one of three font colors based on the given kid's score relative to all other kid's scores */
export const useScoreColorizer = (kidName: string) => {
  const [{ kids }] = useKids();

  const allScoresSorted = Object.values(kids)
    .map((kid) => kid!.score!)
    .sort();

  const min = Math.min(...allScoresSorted);
  const max = Math.max(...allScoresSorted);
  const diff = max + 1 - min;

  if (diff < 3) return "inherit"; // not enough difference

  const step = Math.round(diff / 3);
  const thisKidsScore = kids[kidName]!.score!;

  if (thisKidsScore > max - step) return "mediumseagreen";
  if (thisKidsScore < min + step) return "red";
  return "inherit";
};

export const alphabeticSortByIdProperty = (a: WithId, b: WithId) => {
  const aName = a?.id.toLowerCase();
  const bName = b?.id.toLowerCase();
  if (!aName || !bName) return 0;
  return aName < bName ? -1 : aName > bName ? 1 : 0;
};

export const sortByScoreDescending = (a: WithScore, b: WithScore) =>
  (b?.score || 0) - (a?.score || 0);

export const sortByAgeDescending = (a: WithAge, b: WithAge) =>
  (b?.age || 0) - (a?.age || 0);

export const getBaseTrait = (category: keyof TraitsRecord, id: string) =>
  traitsById[category][id];

/** Note: returns `true` if both arguments are undefined */
export const areSameKid = (a?: Kid, b?: Kid) => {
  if (a === b) return true;

  if (a?.age !== b?.age) return false;
  if (a?.gender !== b?.gender) return false;
  if (a?.name !== b?.name) return false;

  // sometimes trait categories are empty objects and sometimes they are undefined,
  // so special logic which considers `{}` and `undefined` the same "empty" value
  for (const traitCategory of _.uniq([
    ...Object.keys(a?.traits ?? {}),
    ...Object.keys(b?.traits ?? {}),
  ])) {
    //@ts-ignore
    const aValue = a?.traits?.[traitCategory];
    //@ts-ignore
    const bValue = b?.traits?.[traitCategory];

    const aComparitor = _.isEmpty(aValue) ? null : aValue;
    const bComparitor = _.isEmpty(bValue) ? null : bValue;

    if (!_.isEqual(aComparitor, bComparitor)) return false;
  }

  return true;
};
