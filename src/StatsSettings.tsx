import React, { useCallback, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import _ from "lodash";

import { Config, ScoredTrait, Trait, TraitsRecord, useKids } from "./context";
import { TabPanels } from "./material/TabPanels";
import { alphabeticSortByIdProperty } from "./helpers";

const withPlus = (num: number) => num > 0 ? '+' + num : num.toString()

const getMarks = (category: keyof TraitsRecord) => Array(minMax[category].max - minMax[category].min + 1).fill(null).map((el, i) => ({
  value: minMax[category].min + i,
  label: withPlus(minMax[category].min + i)
}))

const minMax: Record<keyof TraitsRecord, { min: number, max: number }> = {
  personality: {
    min: -5,
    max: 5
  },
  genetic: {
    min: 0,
    max: 10,
  },
  education: {
    min: -5,
    max: 5,
  }
}

const TraitAdjuster = ({
  trait,
  traitCategory,
}: {
  trait: Trait;
  traitCategory: keyof TraitsRecord;
}) => {
  const [state, update] = useKids();

  const value = state.configuredTraits[traitCategory][trait.id].score

  const religionStatus = (() => {
    const _trait = state.configuredTraits[traitCategory][trait.id]
    if (_trait.isSin) return "sin"
    if (_trait.isVirtue) return "virtue"
    return "neutral"
  })();

  const updateTrait = useCallback(({ score, religiousStatus }: { score?: number; religiousStatus?: string }) => {
    const newTrait: Trait | ScoredTrait = {
      ...trait,
    }

    if (traitCategory === "personality") {
      if (religiousStatus === "neutral") {
        (newTrait as ScoredTrait).isSin = false;
        (newTrait as ScoredTrait).isVirtue = false;
      } else if (religiousStatus === "sin") {
        (newTrait as ScoredTrait).isSin = true;
        (newTrait as ScoredTrait).isVirtue = false;
      } else if (religiousStatus === "virtue") {
        (newTrait as ScoredTrait).isSin = false;
        (newTrait as ScoredTrait).isVirtue = true;
      }
    }

    if (score !== undefined) {
      (newTrait as ScoredTrait).score = score
    }

    const newConfiguredTraits: TraitsRecord = {
      ...state.configuredTraits,
      [traitCategory]: {
        ...state.configuredTraits[traitCategory],
        [trait.id]: {
          ...state.configuredTraits[traitCategory][trait.id],
          ...newTrait
        }
      }
    };
    update("configureTraits", newConfiguredTraits)
  }, [state.configuredTraits, trait, traitCategory, update]);

  return (
    <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2} >
      <Grid item xs={traitCategory === "personality" ? 6 : 12}>
        <Slider
          marks={getMarks(traitCategory)}
          min={minMax[traitCategory].min}
          max={minMax[traitCategory].max}
          onChange={(e, newValue) => {
            if (typeof newValue === 'number') {
              updateTrait({ score: newValue })
            }
          }}
          step={1}
          value={value}
          valueLabelDisplay="off"
        />
      </Grid>
      {traitCategory === 'personality' &&
        <Grid item xs={6}>
          <FormControl>
            <RadioGroup
              row
              value={religionStatus}
              defaultValue="neutral"
              name="religious-group"
              onChange={(event) => {
                updateTrait({ religiousStatus: event.target.value })
              }}
            >
              <FormControlLabel value="sin" control={<Radio size="small" />} label="Sin" />
              <FormControlLabel value="neutral" control={<Radio size="small" />} label="Neutral" />
              <FormControlLabel value="virtue" control={<Radio size="small" />} label="Virtue" />
            </RadioGroup>
          </FormControl>
        </Grid>
      }
    </Grid>
  );
};



export const StatsSettings = () => {
  const [state, update] = useKids();

  const updateConfig = useCallback(({ virtueModifier, sinModifier }) => {
    let payload: Config = {
      ...state.config,
    }

    if (virtueModifier !== undefined) {
      payload.virtueModifier = virtueModifier
    }
    if (sinModifier !== undefined) {
      payload.sinModifier = sinModifier
    }

    update("updateConfig", payload)
  }, [state.config, update])

  const traitCategoryNames = Object.keys(state.configuredTraits).sort().reverse() as (keyof TraitsRecord)[]

  const traitTabPanels = useMemo(() => {
    const _tabPanels = traitCategoryNames.map((traitCategoryName) => (
      <List key={traitCategoryName}>
        {Object.values(state.configuredTraits[traitCategoryName]).sort(alphabeticSortByIdProperty).map(trait => (
          <ListItem key={trait.name}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <Grid xs={2} item justifySelf="flex-end">
                <Typography sx={{ width: '100%', wordBreak: 'break-all' }} >{traitCategoryName === "education" ? _.startCase(trait.id).replace('_', ' ') : trait.name}</Typography>
              </Grid>
              <Grid xs={1} item>
                <Avatar
                  src={trait.image}
                  variant="square"
                />
              </Grid>
              <Grid xs={9} item>
                <TraitAdjuster traitCategory={traitCategoryName} trait={trait} />
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    ))

    return _tabPanels

  }, [state.configuredTraits, traitCategoryNames])

  const otherSettings = (
    <Stack pt={3} spacing={4} alignItems="center" justifyContent="center">
      <Box width="100%">
        <Typography gutterBottom>Sin Modifier</Typography>
        <Slider
          marks={[-5, -4, -3, -2, -1, 0].map(val => ({ value: val, label: withPlus(val) }))}
          min={-5}
          max={0}
          onChange={(e, newValue) => {
            updateConfig({ sinModifier: newValue })
          }}
          step={1}
          value={state.config.sinModifier}
          valueLabelDisplay="off"
        />
      </Box>
      <Box width="100%">
        <Typography gutterBottom>Virtue Modifier</Typography>
        <Slider
          marks={[0, 1, 2, 3, 4, 5].map(val => ({ value: val, label: withPlus(val) }))}
          min={0}
          max={5}
          onChange={(e, newValue) => {
            updateConfig({ virtueModifier: newValue })
          }}
          step={1}
          value={state.config.virtueModifier}
          valueLabelDisplay="off"
        />
      </Box>
      <Button variant="contained" onClick={() => update("save")}>Save to Local Storage</Button>
      <Button variant="contained" onClick={() => update("saveConfigured")}>Backup Trait Weighting</Button>
      <Stack p={3} pb={6} spacing={2} borderRadius={3} bgcolor="background.primary">
        <Divider variant="middle">Danger Zone</Divider>
        <Button variant="outlined" onClick={() => update("bust")}>Wipe Kids & Trait Weighting</Button>
        <Button variant="outlined" onClick={() => update("loadConfigured")}>Load Backup Trait Weighting</Button>
      </Stack>
    </Stack >
  )

  return (
    <TabPanels tabNames={[...traitCategoryNames, 'Other Settings']} tabPanels={[...traitTabPanels, otherSettings]} />
  )
};
