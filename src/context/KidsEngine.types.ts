export type Trait = {
  name: string;
  image: string;
  id: string;
  isSin?: boolean;
  isVirtue?: boolean;
};

export type ScoredTrait = Trait & {
  score: number;
};

export type TraitsRecord = {
  personality: {
    [key: string]: ScoredTrait;
  };
  genetic: {
    [key: string]: ScoredTrait;
  };
  education: {
    [key: string]: ScoredTrait;
  };
};

export type SelectedTraits = {
  education?: Trait;
  genetic?: {
    [key: string]: Trait;
  };
  personality?: {
    [key: string]: Trait;
  };
};

export type KidTraits = {
  education?: Trait;
  genetic?: {
    [key: string]: Trait;
  };
  personality?: {
    [key: string]: Trait;
  };
};

export type Kid = {
  age: number;
  gender: string;
  name: string;
  score?: number;
  traits: KidTraits;
};

export type Config = {
  sinModifier?: number;
  virtueModifier?: number;
};

export type UpdateType =
  | "updateSelected"
  | "resetSelections"
  | "setKid"
  | "configureTraits"
  | "deleteKid"
  | "save"
  | "load"
  | "bust"
  | "saveConfigured"
  | "loadConfigured"
  | "bustGenetic"
  | "updateConfig";

export type UpdatePayloads =
  | TraitsRecord
  | SelectedTraits
  | KidTraits
  | Kid
  | Config;
