import { TraitsRecord } from "./context";
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
