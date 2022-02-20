import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

import { traitsById } from "../fixtures";
import { Action, AgeAdjustment, Config, Kid, KidsContextState, SelectedTraits, Trait, TraitsRecord } from ".";
import _ from "lodash";

type Updater = (type: Action["type"], payload?: Action["payload"]) => void

type KidsContextType = [KidsContextState, Updater]

const initialState: KidsContextState = {
  kids: {},
  configuredTraits: traitsById,
  selectedTraits: {},
  config: {
    sinModifier: 0,
    virtueModifier: 0,
  }
};

const getKidWithScore = (kid: Kid, state: KidsContextState): Kid => {
  try {
    const { configuredTraits, config } = state

    const scoreReducerGenetic = (acc: number, trait: Omit<Trait, "score">) => acc + configuredTraits.genetic[trait.id].score || 0
    const scoreReducerPersonality = (acc: number, trait: Omit<Trait, "score">) => {
      console.log(config.sinModifier, config.virtueModifier)
      let value = configuredTraits.personality[trait.id].score || 0
      if (configuredTraits.personality[trait.id].isSin) value += config.sinModifier ?? 0
      if (configuredTraits.personality[trait.id].isVirtue) value += config.virtueModifier ?? 0
      return acc + value
    }

    const educationScore = kid.traits.education ? configuredTraits.education[kid.traits.education.id].score : 0
    const personalityScore: number = kid.traits.personality ? Object.values(kid.traits.personality).reduce(scoreReducerPersonality, 0) : 0
    const geneticScore: number = kid.traits.genetic ? Object.values(kid.traits.genetic).reduce(scoreReducerGenetic, 0) : 0

    const finalScore = educationScore + personalityScore + geneticScore

    return { ...kid, score: finalScore }
  } catch (e) {
    return kid
  }
}

const getAllKidsScored = (state: KidsContextState) => {
  const newKids: KidsContextState["kids"] = {}

  Object.values(state.kids).forEach(kid => {
    if (!kid) return
    newKids[kid.name] = getKidWithScore(kid, state)
  })

  return newKids
}

export const KidsContext = createContext<KidsContextType>([initialState, () => { }]);

const hydrate = (): KidsContextState => {
  const savedTraits = localStorage.getItem("ck3traits");
  const savedKids = localStorage.getItem("ck3kids")
  const savedConfig = localStorage.getItem("ck3config")

  const config = savedConfig ? JSON.parse(savedConfig) : initialState.config
  const configuredTraits = savedTraits ? JSON.parse(savedTraits) : initialState.configuredTraits
  const kids = savedKids ? JSON.parse(savedKids) : {}

  return {
    ...initialState,
    kids,
    configuredTraits,
    config,
  };
};

const reducer = (state: KidsContextState, action: Action): KidsContextState => {
  console.log('ACTION', action)

  switch (action.type) {
    case "updateSelected":
      return {
        ...state,
        selectedTraits: {
          ...state.selectedTraits,
          ...action.payload as SelectedTraits,
        },
      };
    case "resetSelections":
      return { ...state, selectedTraits: initialState.selectedTraits };
    case "setKid":
      return {
        ...state,
        kids: { ...state.kids, [(action.payload as Kid).name]: getKidWithScore(action.payload as Kid, state) },
      };
    case "deleteKid":
      return {
        ...state,
        kids: { ...state.kids, [(action.payload as Kid).name]: undefined },
      };
    case "globalAgeAdjust":
      const newState = _.cloneDeep(state)
      Object.keys(newState.kids).forEach(kidId => {
        if (newState.kids[kidId]) {
          newState.kids[kidId]!.age += action.payload as AgeAdjustment
        }
      })
      return newState
    case "configureTraits":
      return {
        ...state,
        configuredTraits: action.payload as TraitsRecord,
        kids: getAllKidsScored({ ...state, configuredTraits: action.payload as TraitsRecord }),
      }
    case "updateConfig":
      return {
        ...state,
        config: { ...state.config, ...(action.payload as Config) },
        kids: getAllKidsScored({ ...state, config: action.payload as Config })
      }
    case "save":
      localStorage.setItem("ck3kids", JSON.stringify(state.kids));
      localStorage.setItem("ck3traits", JSON.stringify(state.configuredTraits));
      return state
    case "saveConfigured":
      localStorage.setItem("ck3traitsConfigured", JSON.stringify(state.configuredTraits));
      return state
    case "loadConfigured":
      const oldString = localStorage.getItem("ck3traitsConfigured");
      if (oldString) {
        const old: TraitsRecord = JSON.parse(oldString)
        return {
          ...state,
          configuredTraits: {
            ...state.configuredTraits,
            education: {
              ...state.configuredTraits.education,
              ...old.education,
            },
            genetic: {
              ...state.configuredTraits.genetic,
              ...old.genetic,
            },
            personality: {
              ...state.configuredTraits.personality,
              ...old.personality,
            }
          }
        }
      }
      return state
    case "bust":
      localStorage.removeItem("ck3kids")
      localStorage.removeItem("ck3traits")
      window.location.reload()
      return initialState
    case "load":
      return hydrate();
    default:
      return state;
  }
};

type PropsWithChildren = {
  children: ReactNode
}

export const KidsEngine = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, hydrate());

  console.log("Context state: ", state);

  const update = useCallback<Updater>(
    (type, payload) => {
      dispatch({ type, payload });
    },
    [dispatch]
  );

  useEffect(
    () => () => {
      update("save");
    },
    [update]
  );

  return (
    <KidsContext.Provider value={[state, update]}>
      {children}
    </KidsContext.Provider>
  );
};

export const useKids = () => {
  return useContext(KidsContext) || [initialState, () => { }]
};
