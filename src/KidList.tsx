import React, { useEffect, useState } from "react";
import {
  Grid,
  Stack,
  Box,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";

import { alphabeticSortByNameProperty, sortByAgeDescending, sortByScoreDescending } from "./helpers";
import { useKids } from "./context";
import { KidCard } from "./KidCard";

const sorters = {
  name: alphabeticSortByNameProperty,
  score: sortByScoreDescending,
  age: sortByAgeDescending,
};

export const KidList = () => {
  const [state] = useKids();
  const [sortBy, setSortBy] = useState<keyof typeof sorters>("score");
  const [kidsArray, setKidsArray] = useState(Object.values(state.kids).sort(sorters[sortBy || "score"]) || [])

  useEffect(() => {
    const newKidsArray = Object.values(state.kids).sort(sorters[sortBy]) || []
    setKidsArray(newKidsArray)
  }, [state.kids, sortBy])


  return (
    <Stack alignItems="center">
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
      >
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
      </Box>
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
            <KidCard kid={kid} />
          </Grid>
        ) : null)
        }
      </Grid>
    </Stack>
  );
};
