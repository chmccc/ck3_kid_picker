import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  ImageList,
  ImageListItem,
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  CardHeader,
  IconButton
} from "@mui/material";
import { alphabeticSortByNameProperty } from "./helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { useKids, Kid } from "./context";


import * as Colors from "@mui/material/colors";
import { useCallback, useState } from "react";
import { TooltipAvatar } from "./TooltipAvatar";
import _ from "lodash";

export const KidCard = ({ kid }: { kid: Kid }) => {
  const [, update] = useKids();
  const { traits } = kid

  const personalityTraits = Object.values(traits.personality || {})
  const personalityAvatars = personalityTraits.map((trait) => (
    <TooltipAvatar type="personality" key={trait.name} trait={trait} />
  )).concat(Array(3 - personalityTraits.length).fill(<TooltipAvatar />))

  return (
    <Card
      key={kid.name}
      sx={{ textAlign: "center", backgroundColor: "background.primary" }}
    >
      <CardHeader
        title={kid.name}
        subheader={(
          <>
            <Typography>{_.startCase(kid.gender)}</Typography>
            <Typography>{`Age: ${kid.age}`}</Typography>
          </>
        )}
        sx={{ px: 3, py: 1, bgcolor: "primary.light" }}
      />
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h6">
            {`Score: ${kid.score || "not found"}`}
          </Typography>
          {<TooltipAvatar type="education" trait={traits.education} />}
          <Stack direction="row" justifyContent="space-around" spacing={1}>
            {personalityAvatars}
          </Stack>
          <Stack direction="row" justifyContent="space-around" spacing={1}>
            {traits.genetic ? Object.values(traits.genetic).map((trait) => (
              <TooltipAvatar type="genetic" key={trait.name} trait={trait} />
            )) : null}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => update("deleteKid", kid)}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};
