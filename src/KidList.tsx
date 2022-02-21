import React, { useEffect, useState } from "react";
import {
  Grid,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
  Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { alphabeticSortByNameProperty, sortByAgeDescending, sortByScoreDescending } from "./helpers";
import { useKids } from "./context";
import { KidCard } from "./KidCard";
import { SelectedKidChanger } from "./types";

const sorters = {
  name: alphabeticSortByNameProperty,
  score: sortByScoreDescending,
  age: sortByAgeDescending,
};

export const KidList = ({ onSelectKid }: { onSelectKid: SelectedKidChanger }) => {
  const [state, update] = useKids();
  const [sortBy, setSortBy] = useState<keyof typeof sorters>("score");
  const [kidsArray, setKidsArray] = useState(Object.values(state.kids).sort(sorters[sortBy || "score"]) || [])

  const handleGlobalAgeChange = (adjustment: 1 | -1) => {
    update("globalAgeAdjust", adjustment)
  }

  const handleEditKid = (kidName: string | null) => () => {
    onSelectKid(kidName)
  }

  useEffect(() => {
    const newKidsArray = Object.values(state.kids).sort(sorters[sortBy]) || []
    setKidsArray(newKidsArray)
  }, [state.kids, sortBy])


  return (
    <Stack alignItems="center">
      <Grid container
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        spacing={0}
      >
        <Grid xs={4} item width="100%" />
        <Grid xs={4} item display="flex" justifyContent="center">
          <ToggleButtonGroup
            color="primary"
            value={sortBy}
            exclusive
            onChange={(_, val) => {
              if (val !== null) {
                setSortBy(val);
              }
            }}
          >
            <ToggleButton value="score">sort by score</ToggleButton>
            <ToggleButton value="name">sort by name</ToggleButton>
            <ToggleButton value="age">sort by age</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid xs={4} item>
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-end">
            <Typography variant="button">Global Age Adjustment:</Typography>
            <Fab size="small" onClick={(e) => handleGlobalAgeChange(-1)}>
              <RemoveIcon />
            </Fab>
            <Fab size="small" onClick={(e) => handleGlobalAgeChange(1)}>
              <AddIcon />
            </Fab>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ padding: "20px" }}
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {kidsArray.map((kid) => kid ? (
          <Grid key={kid.name} item>
            <KidCard onEditClick={handleEditKid(kid.name)} kid={kid} />
          </Grid>
        ) : null)
        }
      </Grid>
    </Stack >
  );
};
